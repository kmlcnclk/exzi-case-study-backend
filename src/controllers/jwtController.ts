import { Response, Request } from "express";
import { get } from "lodash";
import JwtService from "../services/Jwt/JwtService";
import { ISignJwt } from "../types/Jwt";
import logger from "../logger";

class JwtController {
  jwtService: JwtService;

  constructor() {
    this.jwtService = new JwtService();
  }

  refresh = async (req: Request, res: Response) => {
    try {
      const refreshToken = get(req, "headers.x-refresh");
      if (refreshToken != undefined || refreshToken) {
        const refreshTokenResponse = await this.jwtService.isValidRefreshToken(
          refreshToken as string
        );

        if (get(refreshTokenResponse, "value") == true) {
          //TODO: old token valid to invalid & new token generate - return

          const user = get(refreshTokenResponse, "user") as unknown as ISignJwt;
          await this.jwtService.updateJwtValidWithFalseOnDb(user._id);

          const generatedTokensData =
            await this.jwtService.generateWithIdAndSaveDbJwtToken<ISignJwt>(
              user
            );

          logger.info("JWT Refresh is successful");

          return res.status(201).json(generatedTokensData);
        } else {
          logger.error({
            status: 403,
            name: "Forbidden",
            data: {
              data: get(refreshTokenResponse, "value"),
              message: get(refreshTokenResponse, "message"),
            },
          });
          return res.status(403).json({
            data: get(refreshTokenResponse, "value"),
            message: get(refreshTokenResponse, "message"),
          });
        }
      } else {
        logger.error({
          status: 404,
          name: "Not Found",
          message: "JWT Refresh Token Do Not Exist",
        });
        return res
          .status(404)
          .json({ message: "JWT Refresh Token Do Not Exist" });
      }
    } catch (err: any) {
      logger.error({
        status: 500,
        name: err.name,
        message: err.message,
      });
      return res.status(500).json({ error: err.message });
    }
  };
}

export default JwtController;
