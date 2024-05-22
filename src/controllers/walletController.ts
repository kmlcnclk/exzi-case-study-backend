import { NextFunction, Response } from "express";
import WalletService from "../services/Wallet/WalletService";
import { RequestWithUser } from "../types/express";
import logger from "../logger";
import { get } from "lodash";
import CustomError from "../helpers/errors/CustomError";
import TokenService from "../services/Token/TokenService";
import ethers from "ethers";
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
      const walletData: { type: string } = req.body;

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
        walletId,
        walletData.type
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

  withdraw = async (req: RequestWithUser, res: Response) => {
    try {
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

  balance = async (req: RequestWithUser, res: Response) => {
    try {
      const userID = get(req.user, "_id") as string;

      const wallet = await this.walletService.findWalletByUserId(userID);

      const { ethereumBalance, usdcBalanceOnEthereum, usdtBalanceOnEthereum } =
        await this.walletService.getAllBalancesForEthereum(
          wallet?.address as string
        );

      const {
        binanceBalance,
        ethBalanceOnBinance,
        usdcBalanceOnBinance,
        usdtBalanceOnBinance,
      } = await this.walletService.getAllBalancesForBinance(
        wallet?.address as string
      );
      console.log(1);

      return res.status(200).json({
        balances: {
          ethereum: {
            ethereumBalance,
            usdcBalanceOnEthereum,
            usdtBalanceOnEthereum,
          },
          binance: {
            binanceBalance,
            ethBalanceOnBinance,
            usdcBalanceOnBinance,
            usdtBalanceOnBinance,
          },
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
