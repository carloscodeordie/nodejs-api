import { User } from "../../models/user"; // adjust this path to your User model

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
