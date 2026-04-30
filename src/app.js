import express from "express";
import router from "./routes/route.js";
import pool from "./config/db.js";

const app = express();
app.use(express.json());
app.use("/api", router);
export { app };
