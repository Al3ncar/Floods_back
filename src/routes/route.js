import express from "express";
import { Router } from "express";
import useControl  from "../controllers/controllers.js";

const router = Router();

router.get("/users", useControl.getAll);
router.post("/users", useControl.addUsers);

export default router