import { Request, Response, NextFunction } from "express";
import { Favourite, Property, SyncFavoritesRequest } from "../types";
import pool from "../config/db";

export const getAllFavorites = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = request.userId;
        const result = await pool.query(`
            SELECT p.* 
            FROM properties p 
            INNER JOIN favourites f ON p.id = f.property_id 
            WHERE f.user_id = $1
            ORDER BY f.created_at DESC
        `, [userId]);

        const properties: Property[] = result.rows.map((row: any) => ({
            ...row,
            isFavourited: true
        }));

        response.status(200).json({ properties });
    } catch (error) {
        console.error('Get All Favorites Error:', error);
        response.status(500).json({ error: 'Internal server error' });
    }
};

export const syncFavorites = async (request: Request, response: Response, next: NextFunction) => {
    const { added, removed }: SyncFavoritesRequest = request.body;
    const userId = request.userId;

    if (!userId) {
        response.status(401).json({ error: "Unauthorized" });
        return;
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Handle removals
        if (removed && removed.length > 0) {
            await client.query(
                'DELETE FROM favourites WHERE user_id = $1 AND property_id = ANY($2::int[])',
                [userId, removed]
            );
        }

        // Handle additions (using ON CONFLICT to avoid duplicate errors if some are already favorited)
        if (added && added.length > 0) {
            for (const propertyId of added) {
                await client.query(
                    'INSERT INTO favourites (user_id, property_id) VALUES ($1, $2) ON CONFLICT (user_id, property_id) DO NOTHING',
                    [userId, propertyId]
                );
            }
        }

        await client.query('COMMIT');
        response.status(200).json({ success: true, message: "Favorites synced successfully" });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Sync Favorites Error:', error);
        response.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
};