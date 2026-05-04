import express from "express";
import { Router } from "express";

import validEditReq from "../validator/joi-edit-req.js";
import validRequest from "../validator/joi-req.js";
import useControl from "../controllers/controllers.js";
import validUser from "../validator/joi-user.js";
import auth from "../auth/auth.js";

const router = Router();

router.post("/login", useControl.login);

router.get("/api/users", useControl.getAll);
router.post("/api/users", validUser, useControl.createUser);
router.put("/api/users/:id", auth, useControl.editUserData);
router.delete("/api/users/:id", auth, useControl.deleteUser);

router.get("/api/requests", useControl.requestsAll);
router.post("/api/requests", validRequest, auth, useControl.createRequest);
router.put("/api/requests/:id", validEditReq, auth, useControl.editRequest);
router.delete("/api/requests/:id", auth, useControl.removeRequest);

router.post(
  "/api/requests/:id/applications",
  auth,
  useControl.createApplication,
);

export default router;
