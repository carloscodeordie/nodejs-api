import express from "express";
import path from "path";

const app = express();

app.get("/", (req, res) => {
  res.sendFile(path.resolve("pages/index.html"));
});

export default app;
