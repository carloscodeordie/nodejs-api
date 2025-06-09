import express from "express";
import path from "path";
import router from "./router";

const app = express();

app.use("/api", router);

export default app;
