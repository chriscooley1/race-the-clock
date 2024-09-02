const express = require("express");
const path = require("path");
const cors = require("cors");
import { Request, Response } from "express";

const app = express();

// Define allowed origins
const allowedOrigins = ['https://race-the-clock-frontend-production.up.railway.app'];

app.use(cors({
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        // Allow requests with no origin, like mobile apps or curl requests
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true); // Origin is allowed
        } else {
            callback(new Error('Not allowed by CORS')); // Origin is not allowed
        }
    },
    credentials: true // Allow cookies to be sent along with requests
}));

app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
