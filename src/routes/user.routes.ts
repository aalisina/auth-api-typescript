import express from "express";
import {
  createUserHandler,
  verifyUserHandler,
} from "../controllers/user.controller";
import validateResource from "../middlewares/validateResource";
import { createUserSchema, verifyUserSchema } from "../schemas/user.schema";

const router = express.Router();

router.post(
  "/api/users",
  validateResource(createUserSchema),
  createUserHandler
);

router.post(
  "/api/users/verify/:id/:verificationCode",
  validateResource(verifyUserSchema),
  verifyUserHandler
);

export default router;
