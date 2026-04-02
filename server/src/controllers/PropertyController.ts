import { NextFunction, Request, Response } from "express";
import { Property } from "../types";
import pool from "../config/db";

export const getAllProperties = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = request.userId;

        let query = 'SELECT * FROM properties';
        let params: any[] = [];

        if (userId) {
            query = `
                SELECT p.*, (f.id IS NOT NULL) AS "isFavourited" 
                FROM properties p 
                LEFT JOIN favourites f ON p.id = f.property_id AND f.user_id = $1
                ORDER BY p.id
            `;
            params = [userId];
        }

        const result = await pool.query(query, params);
        
        // If not logged in, manually add isFavourited: false to each row
        const properties: Property[] = result.rows.map(row => ({
            ...row,
            isFavourited: userId ? row.isFavourited : false
        }));

        response.status(200).json({ properties });
    } catch (error) {
        console.error('Get All Properties Error:', error);
        response.status(500).json({ error: 'Internal server error' });
    }
};
    