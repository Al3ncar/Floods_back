import express from "express";
import { Router } from "express";
import useControl from "../controllers/controllers.js";
import validUser from "../validator/joiUser.js";
import auth from "../auth/auth.js";

const router = Router();

router.post("/login", useControl.login);
router.get("/api/users", useControl.getAll);
router.post("/api/users", validUser, useControl.createUser);
router.put("/api/users/:id", auth, useControl.roleEditUser);

router.get("/api/users/volunteer", useControl.getAllVolunteer);
router.get("/api/users/help-me", useControl.getAllHelpMe);

router.get("/api/requests", useControl.requestsAll);
router.post("/api/requests", auth, useControl.createRequest);
router.put("/api/requests/:id", auth, useControl.editRequest);
router.delete("/api/requests/:id", auth, useControl.removeRequest);

router.post(
  "/api/requests/:id/applications",
  auth,
  useControl.createApplication,
);

export default router;
