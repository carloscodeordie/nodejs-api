import express from "express";
import router from "./router";
import morgan from "morgan";
import cors from "cors";
import { protectMiddleware } from "./middleware/protect";
import { createUser, signin } from "./handlers/user";
import { errorHandler } from "./handlers/error";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Protected routes
app.use("/api", protectMiddleware, router);

// Unprotected routes
app.post("/user", createUser);
app.post("/signin", signin);

// Error handler
app.use(errorHandler);

export default app;
