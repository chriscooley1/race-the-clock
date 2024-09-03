const express = require("express");
const path = require("path");
const cors = require("cors");
import { Request, Response } from "express";

const app = express();

// Define allowed origins
const allowedOrigins = ["https://race-the-clock-frontend-production.up.railway.app"];

app.use(cors({
  origin: true, // This allows all origins
  credentials: true
}));

app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
