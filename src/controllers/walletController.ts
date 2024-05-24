import { NextFunction, Response } from "express";
import WalletService from "../services/Wallet/WalletService";
import { RequestWithUser } from "../types/express";
import logger from "../logger";
import { get } from "lodash";
import CustomError from "../helpers/errors/CustomError";
import { WalletDocument } from "../models/walletModel";

class WalletController {
  walletService: WalletService;

  constructor() {
    this.walletService = new WalletService();
  }

  createWallet = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // TODO: bunu middleware e yaz
      const wallet = await this.walletService.findWalletByUserId(
        get(req.user, "_id") as string
      );

      if (wallet?._id)
        throw next(
          new CustomError("Bad Request", "Wallet already exists", 400)
        );

      const { address, hashOfPrivateKey } =
        await this.walletService.createWallets();

      const walletId = await this.walletService.createWallet(
        get(req.user, "_id") as string,
        address,
        hashOfPrivateKey
      );

      this.walletService.saveWalletToUser(
        get(req.user, "_id") as string,
        walletId
      );

      logger.info("Wallet successfully created");

      return res.status(201).json({
        message: "Wallet successfully created",
      });
    } catch (err: any) {
      logger.error({
        status: 500,
        name: err.name,
        message: err.message,
      });
      return res.status(500).json({ error: err.message });
    }
  };

  withdraw = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { amount, to, network, token } = req.body;

      const wallet: WalletDocument =
        (await this.walletService.findWalletByUserId(
          get(req.user, "_id") as string
        )) as WalletDocument;

      if (!wallet)
        throw next(new CustomError("Not Found", "Wallet not found", 404));

      const privateDecrypt =
        await this.walletService.decryptHashedWalletPrivateKey(
          wallet.privateKey
        );

      const result = await this.walletService.withdraw(
        amount,
        privateDecrypt,
        to,
        wallet.address,
        network,
        token
      );

      if (
        result === "0x" ||
        result === "" ||
        result === null ||
        result === undefined
      )
        throw next(
          new CustomError(
            "Internal Server Error",
            "Withdraw is not successful",
            500
          )
        );

      await this.walletService.createWithdraw(
        get(req.user, "_id") as string,
        wallet?._id as string,
        result as string
      );

      logger.info("Withdraw successfully completed");

      return res.status(200).json({
        message: "Withdraw successfully completed",
      });
    } catch (err: any) {
      if (err.status) {
        return res.status(err.status).json({
          error: {
            name: err.name,
            message: err.message,
          },
        });
      }

      return res.status(500).json({
        error: {
          name: err.name,
          message: err.message,
        },
      });
    }
  };

  balance = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userID = get(req.user, "_id") as string;

      const wallet = await this.walletService.findWalletByUserId(userID);

      if (!wallet)
        throw next(new CustomError("Not Found", "Wallet not found", 404));

      const { binance, ethereum } = await this.walletService.balance(wallet);

      return res.status(200).json({
        balances: {
          ethereum,
          binance,
        },
      });
    } catch (err: any) {
      logger.error({
        status: 500,
        name: err.name,
        message: err.message,
      });
      return res.status(500).json({ error: err.message });
    }
  };

  getWalletByUserId = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const wallet = await this.walletService.findWalletByUserId(
        get(req.user, "_id") as string
      );

      if (!wallet)
        throw next(new CustomError("Not Found", "Wallet not found", 404));

      return res.status(200).json({
        walletAddress: wallet.address,
      });
    } catch (err: any) {
      if (err.status) {
        return res.status(err.status).json({
          error: {
            name: err.name,
            message: err.message,
          },
        });
      }

      return res.status(500).json({
        error: {
          name: err.name,
          message: err.message,
        },
      });
    }
  };
}

export default WalletController;
