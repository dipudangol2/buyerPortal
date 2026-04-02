import { Router } from "express";
import { getAllProperties } from "../controllers/PropertyController";
import { optionalAuth } from "../middlewares/AuthMiddleware";

const propertyRoutes: Router = Router();

// optionalAuth sets request.userId when a valid Bearer token is present,
// so getAllProperties can JOIN favourites and return isFavourited per user to render them on the frontend.
propertyRoutes.get("/", optionalAuth, getAllProperties);

export default propertyRoutes;
