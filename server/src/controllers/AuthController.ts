import { Request, Response, NextFunction } from "express";
import { hashPassword, createToken, comparePasswords } from "../utils/utils";
import pool from "../config/db";
import { User } from "../types";

export const signup = async (request: Request, response: Response, next: NextFunction) => {
    const { name, email, password } = request.body;

    try {
        const userCheck = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            response.status(400).json({ error: 'Cannot use the email providec.' });
            return;
        }

        const hashedPassword = await hashPassword(password);

        const result = await pool.query(
            `INSERT INTO users (name, email, password) 
             VALUES ($1, $2, $3) 
             RETURNING id, name, email, role`,
            [name, email, hashedPassword]
        );

        const newUser: User = result.rows[0];

        response.status(201).json({
            message: 'User registered successfully',
            user: newUser
        });
    } catch (error) {
        console.error('Signup Error:', error);
        response.status(500).json({ error: 'Internal server error' });
    }
};

export const login = async (request: Request, response: Response, next: NextFunction) => {
    const { email, password } = request.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user: User = result.rows[0];

        if (!user) {
            response.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        const isMatch = await comparePasswords(password, user.password as string);
        if (!isMatch) {
            response.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        const token = createToken(user.email, user.id);

        response.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        response.status(500).json({ error: 'Internal server error' });
    }
};

export const getCurrentUser = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = request.userId;
        const result = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [userId]);
        const user: User = result.rows[0];

        if (!user) {
            response.status(404).json({ error: 'User not found' });
            return;
        }

        response.status(200).json({ user });
    } catch (error) {
        console.error('Me Error:', error);
        response.status(500).json({ error: 'Internal server error' });
    }
};

export const logout = async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Since we use Bearer tokens in localStorage, logout is handled by the client
        // by clearing the token. We just return success here.
        response.status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};