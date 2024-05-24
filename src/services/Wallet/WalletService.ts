import WalletDAO from "../../data/WalletDAO";
import { EthereumKeyPair } from "../../lib/EthereumKeyPair";
import { v4 } from "uuid";
import UserService from "../User/UserService";
import { WalletDocument } from "../../models/walletModel";
import { Bytes } from "web3";
import NodeRSA from "node-rsa";
import fs from "fs";
import EthereumService from "../Ethereum/EthereumService";
import BinanceService from "../Binance/BinanceService";
import WithdrawService from "../Withdraw/WithdrawService";

class WalletService {
  userService: UserService;
  ethereumService: EthereumService;
  binanceService: BinanceService;
  withdrawService: WithdrawService;

  _key: NodeRSA;

  constructor() {
    this.userService = new UserService();

    const NODE_RSA_PRIVATE_KEY = fs.readFileSync("rsa_key.pem", "utf-8");

    this._key = new NodeRSA(NODE_RSA_PRIVATE_KEY as string);

    this.ethereumService = new EthereumService();
    this.binanceService = new BinanceService();

    this.withdrawService = new WithdrawService();
  }

  async hashUserWalletPrivateKey(walletPrivateKey: string): Promise<string> {
    return this._key.encrypt(walletPrivateKey, "base64");
  }

  async decryptHashedWalletPrivateKey(hash: string): Promise<string> {
    return this._key.decrypt(hash, "utf8");
  }

  createEthereumWallet(): { privateKey: string; address: string } {
    const keyPairNewKey = new EthereumKeyPair();

    const privateKey = keyPairNewKey.getPrivateAddress();
    const address = keyPairNewKey.getPublicAddress();

    return { privateKey, address };
  }

  createWithdraw = async (userID: string, walletID: string, tx: string) => {
    await this.withdrawService.createWithdraw(userID, walletID, tx);
  };

  async createWallet(
    userId: string,
    address: string,
    hashOfPrivateKey: string
  ): Promise<string> {
    const wallet: WalletDocument = await WalletDAO.create({
      user: userId,
      address,
      privateKey: hashOfPrivateKey,
      profileImage: `https://www.gravatar.com/avatar/${v4()}?d=identicon`,
    });

    return wallet._id as unknown as string;
  }

  createWallets = async (): Promise<{
    address: string;
    hashOfPrivateKey: string;
  }> => {
    const { address, privateKey } = this.createEthereumWallet();
    const hashOfPrivateKey = await this.hashUserWalletPrivateKey(privateKey);

    return { address, hashOfPrivateKey };
  };

  saveWalletToUser = async (userId: string, walletId: string) => {
    this.userService.saveWalletToUser(userId, walletId);
  };

  findWalletByUserId = async (
    userId: string
  ): Promise<WalletDocument | null> => {
    const wallet = await WalletDAO.findOne({ user: userId });
    return wallet;
  };

  balance = async (wallet: WalletDocument) => {
    const { ethereumBalance, usdcBalanceOnEthereum, usdtBalanceOnEthereum } =
      await this.ethereumService.getAllBalancesForEthereum(
        wallet?.address as string
      );

    const {
      binanceBalance,
      ethBalanceOnBinance,
      usdcBalanceOnBinance,
      usdtBalanceOnBinance,
    } = await this.binanceService.getAllBalancesForBinance(
      wallet?.address as string
    );

    return {
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
    };
  };

  withdraw = async (
    amount: string,
    privateKey: string,
    to: string,
    from: string,
    network: string,
    token: string
  ): Promise<string | boolean | Bytes | undefined> => {
    let result;
    if (network === "eth") {
      result = this.ethereumService.withdrawForEthereum(
        amount,
        privateKey,
        to,
        token
      );
    } else if (network === "bsc") {
      result = this.binanceService.withdrawForBinance(
        amount,
        privateKey,
        to,
        from,
        token
      );
    }
    return result;
  };
}

export default WalletService;
