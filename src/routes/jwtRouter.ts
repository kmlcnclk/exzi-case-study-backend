import express, { Router } from "express";
import JwtController from "../controllers/jwtController";

class JwtRouter {
  jwtRouter: Router;
  jwtController: JwtController;

  constructor() {
    this.jwtController = new JwtController();
    this.jwtRouter = express.Router();
    this.routes();
  }

  routes() {
    this.createJwt();
  }

  createJwt() {
    this.jwtRouter.post("/refresh", this.jwtController.refresh);
  }
}

export default JwtRouter;
