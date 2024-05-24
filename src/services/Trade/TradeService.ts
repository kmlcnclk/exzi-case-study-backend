import TradeHistoryDAO from "../../data/TradeHistoryDAO";
import { TradeHistoryDocument } from "../../models/tradeHistoryModel";
import { WalletDocument } from "../../models/walletModel";
import BinanceService from "../Binance/BinanceService";
import EthereumService from "../Ethereum/EthereumService";
import SwapService from "../Swap/SwapService";
import WalletService from "../Wallet/WalletService";

class TradeService {
  ethereumService: EthereumService;
  binanceService: BinanceService;
  walletService: WalletService;
  swapService: SwapService;

  constructor() {
    this.ethereumService = new EthereumService();
    this.walletService = new WalletService();
    this.binanceService = new BinanceService();
    this.swapService = new SwapService();
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
    });
  };

  findWalletByUserId = (userId: string): Promise<WalletDocument | null> => {
    return this.walletService.findWalletByUserId(userId);
  };

  buyAndSellCoin = async (
    userID: string,
    amount: string,
    tokens: string[],
    network: string
  ): Promise<string | undefined | object> => {
    const wallet = await this.walletService.findWalletByUserId(userID);

    const privateKey = await this.walletService.decryptHashedWalletPrivateKey(
      wallet?.privateKey as string
    );

    const receipt = await this.swapService.buyAndSellCoin(
      privateKey,
      amount,
      tokens,
      network
    );

    return receipt;
  };
}

export default TradeService;
