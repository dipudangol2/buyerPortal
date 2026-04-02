import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWTPayload } from "../types";

export const verifyToken = (request: Request, response: Response, next: NextFunction) => {
    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) throw new Error("JWT_SECRET not set");

        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            response.status(401).json({ message: "User is not Authenticated." });
            return;
        }

        const token = authHeader.split(" ")[1];

        jwt.verify(token, jwtSecret, (error: jwt.VerifyErrors | null, payload: any) => {
            if (error) {
                response.status(403).json({ message: "Invalid Token" });
                return;
            }

            const decoded = payload as JWTPayload;

            if (decoded && typeof decoded === "object" && "userId" in decoded) {
                request.userId = decoded.userId;
                return next();
            }

            response.status(403).json({ message: "Malformed token payload" });
        });

    } catch (error) {
        console.error("Authentication error", error);
        response.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Optional auth middleware — sets request.userId if a valid Bearer token is
 * present, but silently continues without it if the header is absent.
 * (getAllProperties needed this as every property was getting flagged as false and did not render on the dashboard)
 */
export const optionalAuth = (request: Request, response: Response, next: NextFunction) => {
    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) throw new Error("JWT_SECRET not set");

        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next();
        }

        const token = authHeader.split(" ")[1];

        jwt.verify(token, jwtSecret, (error: jwt.VerifyErrors | null, payload: any) => {
            if (!error && payload) {
                const decoded = payload as JWTPayload;
                if (decoded && typeof decoded === "object" && "userId" in decoded) {
                    request.userId = decoded.userId;
                }
            }
            return next();
        });
    } catch (error) {
        return next();
    }
};