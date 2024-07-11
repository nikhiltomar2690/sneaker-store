import express from "express";
import { deleteUser, getAllUsers, getUser, newUser, } from "../controllers/user.js";
import { adminOnly } from "../middlewares/auth.js";
const app = express.Router();
// route - /api/v1/user/new
// // usecase of this route: create a new user
app.post("/new", newUser);
// route - /api/v1/user/all
// // usecase of this route : get all users
app.get("/all", adminOnly, getAllUsers);
// route - /api/v1/user/:id
// usecase of this route : get user by id
// app.get("/:id", getUser);
// app.delete("/:id", deleteUser);
app.route("/:id").get(getUser).delete(adminOnly, deleteUser);
export default app;
