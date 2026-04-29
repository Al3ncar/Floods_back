import express from "express";
import { Router } from "express";
import useControl  from "../controllers/controllers.js";

const router = Router();

router.get("/users", useControl.getAll);
router.post("/users", useControl.createUser);
router.put("/users/:id", useControl.roleEditUser);

router.get("/users/volunteer", useControl.getAllVolunteer);
router.get("/users/help-me", useControl.getAllHelpMe);

router.get("/requests", useControl.requestsAll);
router.post("/requests", useControl.createRequest)
router.put("/requests/:id", useControl.editRequest)
router.delete("/requests/:id", useControl.removeRequest)

router.post("/requests/:id/applications", useControl.removeRequest)
 
export default router