import { Router } from "express";
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from "./controller";

const AdminUserRouter = Router();

AdminUserRouter.post("/users", createUser);
AdminUserRouter.post("/users/all", getAllUsers);
AdminUserRouter.get("/users/:id", getUser);
AdminUserRouter.put("/users/:id", updateUser);
AdminUserRouter.delete("/users/:id", deleteUser);

export default AdminUserRouter;