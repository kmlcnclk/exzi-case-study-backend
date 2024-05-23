import TradeHistoryDAO from "../../data/TradeHistoryDAO";
import CustomError from "../../helpers/errors/CustomError";
import { TradeHistoryDocument } from "../../models/tradeHistoryModel";
import { WalletDocument } from "../../models/walletModel";
import EthereumService from "../Ethereum/EthereumService";
import WalletService from "../Wallet/WalletService";

class TradeService {
  ethereumService: EthereumService;
  walletService: WalletService;

  constructor() {
    this.ethereumService = new EthereumService();
    this.walletService = new WalletService();
  }

  findTradeHistoriesByUserId = async (
    userId: string
  ): Promise<TradeHistoryDocument[]> => {
    const tradeHistories: TradeHistoryDocument[] =
      (await TradeHistoryDAO.findAllWithProperty({
        user: userId,
      })) as TradeHistoryDocument[];

    return tradeHistories;
  };

  buy = async (value: string, tokens: string[], userId: string) => {
    const wallet = await this.walletService.findWalletByUserId(userId);

    if (!wallet) throw new CustomError("Not Found", "Wallet not found", 404);

    const decryptedPrivateKey =
      await this.walletService.decryptHashedWalletPrivateKey(
        wallet?.privateKey
      );

    return await this.ethereumService.buyCoin(
      "39741f8a04a7d4fa71b22193a520ab137885bdb280eafcb1195b6d8750b4e3b8",
      value,
      tokens
    );
  };

  createBuyTradeHistory = async (
    amount: string,
    userID: string,
    walletID: string,
    tx: string,
    tokens: string[],
    network: string
  ) => {
    await TradeHistoryDAO.create({
      amount: Number(amount),
      fromCoin: tokens[0],
      toCoin: tokens[1],
      network,
      tx,
      user: userID,
      wallet: walletID,
      status: "buy",
    });
  };

  findWalletByUserId = (userId: string): Promise<WalletDocument | null> => {
    return this.walletService.findWalletByUserId(userId);
  };
}

export default TradeService;
