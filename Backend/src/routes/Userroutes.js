import express from "express";
import { Loginfun, Signupfun } from "../Controller/UserController.js";
import { delfun } from "../controller/AdminController.js";

const UserRouter = express.Router();

UserRouter.post("/signup", Signupfun);

UserRouter.post("/login", Loginfun);

UserRouter.delete("/delete/:id", delfun);

export default UserRouter;
