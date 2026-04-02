import {Router} from "express";
import { getAllProperties } from "../controllers/PropertyController";

const propertyRoutes: Router = Router();

propertyRoutes.get("/",getAllProperties);

export default propertyRoutes;
