import { Router } from "express";
import { getAllFavorites, syncFavorites } from "../controllers/FavoritesController";
import { verifyToken } from "../middlewares/AuthMiddleware";

const favoriteRoutes: Router = Router();

//All favorite routes should be accessed by an authenticated user
favoriteRoutes.use(verifyToken);

favoriteRoutes.get("/", getAllFavorites);
favoriteRoutes.post("/sync", syncFavorites);

export default favoriteRoutes;
