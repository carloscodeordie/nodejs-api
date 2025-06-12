import app from "./server";
import * as dotenv from "dotenv";

dotenv.config();

const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
