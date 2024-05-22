import { Request } from "express";
import { ISignJwt } from "./Jwt";

export interface RequestWithUser extends Request {
  user?: ISignJwt;
}
