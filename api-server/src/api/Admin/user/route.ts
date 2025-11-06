import { Router } from "express";
import { createUser, CSVUsers, deleteUser, getAllUsers, getUser, updateUser } from "./controller";

const AdminUserRouter = Router();

AdminUserRouter.post("/users", createUser);
AdminUserRouter.post("/users/all", getAllUsers);
AdminUserRouter.get("/users/csv", CSVUsers);
AdminUserRouter.get("/users/:id", getUser);
AdminUserRouter.put("/users/:id", updateUser);
AdminUserRouter.delete("/users/:id", deleteUser);

export default AdminUserRouter;