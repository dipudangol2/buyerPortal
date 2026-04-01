import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/AuthRoutes";

dotenv.config();
const port = process.env.PORT || 8000;

const app: Application = express();
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
        credentials: true
    })
)

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
