import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/AuthRoutes";
import propertyRoutes from "./routes/PropertyRoutes";
import favoriteRoutes from "./routes/FavoriteRoutes";

dotenv.config();
const port = process.env.PORT || 8000;

const app: Application = express();
app.use(
    cors({
        origin: "*",
        methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
        credentials: true
    })
)

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/favorites", favoriteRoutes);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
