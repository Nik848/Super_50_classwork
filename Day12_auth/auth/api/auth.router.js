/*
  ORIGINAL COMMENT:
  create a router
  attach these endpoints:

  POST /register
      -dto
      -controler
  POST /login
      -dto
      -controler
  POST /logout
      -dto
      -controler

  return this json response:
  {
      success:true,
      message:"ok",
  }

  IMPLEMENTATION:
  - Express Router with three POST endpoints
  - Each endpoint uses its DTO validation middleware before the controller
  - register → validateRegistration → register controller
  - login → validateLogin → login controller
  - logout → validateLogout → logout controller
*/
import { Router } from "express";
import { validateRegistration } from "./dto/regis.dto.js";
import { validateLogin } from "./dto/login.dto.js";
import { validateLogout } from "./dto/logout.dto.js";
import { register, login, logout } from "./auth.controller.js";

const authRouter = Router();

// POST /register — validate body then create user
authRouter.post("/register", validateRegistration, register);

// POST /login — validate body then authenticate user
authRouter.post("/login", validateLogin, login);

// POST /logout — pass-through validation then clear cookie
authRouter.post("/logout", validateLogout, logout);

export default authRouter;