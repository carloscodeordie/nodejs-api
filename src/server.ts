import express from "express";
import router from "./router";
import morgan from "morgan";
import cors from "cors";
import { protectMiddleware } from "./middleware/protect";
import { createUser, signin } from "./handlers/user";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", protectMiddleware, router);
app.post("/user", createUser);
app.post("/signin", signin);

export default app;
