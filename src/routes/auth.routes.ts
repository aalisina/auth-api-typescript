import express from "express";
import { createSessionHandler } from "../controllers/auth.controller";
import validateResource from "../middlewares/validateResource";
import { createSessionSchema } from "../schemas/auth.schema";

const router = express.Router();

router.post(
  "/api/sessions",
  validateResource(createSessionSchema),
  createSessionHandler
);

export default router;
