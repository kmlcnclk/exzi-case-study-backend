import WalletDAO from "../../data/WalletDAO";
import { EthereumKeyPair } from "../../lib/EthereumKeyPair";
import { v4 } from "uuid";
import UserService from "../User/UserService";
import { WalletDocument } from "../../models/walletModel";
import crypto from "crypto";
import fs from "fs";
import { ethers } from "ethers";
import ethUSDTContract from "../../contracts/eth_usdt_contract.json";
import ethUSDCContract from "../../contracts/eth_usdc_contract.json";
import bscUSDTContract from "../../contracts/bsc_usdt_contract.json";
import bscUSDCContract from "../../contracts/bsc_usdc_contract.json";
import bscETHContract from "../../contracts/bsc_eth_contract.json";
import Web3 from "web3";

class WalletService {
  userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async hashUserWalletPrivateKey(walletPrivateKey: string): Promise<string> {
    const publicKey = fs.readFileSync(
      process.env.PUBLIC_KEY_PATH as string,
      "utf8"
    );

    const encryptedData = await crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(walletPrivateKey, "utf8")
    );
    return encryptedData.toString("base64");
  }

  async decryptHashedWalletPrivateKey(hash: string): Promise<string> {
    const encryptedBuffer = Buffer.from(hash, "base64");

    const privateKey = fs.readFileSync(
      process.env.PRIVATE_KEY_PATH as string,
      "utf8"
    );

    const decryptedData = await crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      encryptedBuffer
    );

    return decryptedData.toString("utf8");
  }

  createEthereumWallet(): { privateKey: string; address: string } {
    const keyPairNewKey = new EthereumKeyPair();

    const privateKey = keyPairNewKey.getPrivateAddress();
    const address = keyPairNewKey.getPublicAddress();

    return { privateKey, address };
  }

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

  saveWalletToUser = async (
    userId: string,
    walletId: string,
    walletType: string
  ) => {
    this.userService.saveWalletToUser(userId, walletId, walletType);
  };

  findWalletByUserId = async (
    userId: string
  ): Promise<WalletDocument | null> => {
    const wallet = await WalletDAO.findOne({ user: userId });
    return wallet;
  };

  getAllBalancesForEthereum = async (
    walletAddress: string
  ): Promise<{
    ethereumBalance: string;
    usdcBalanceOnEthereum: string;
    usdtBalanceOnEthereum: string;
  }> => {
    const NODE_ENV = process.env.NODE_ENV;

    const provider = new ethers.InfuraProvider(
      NODE_ENV === "production" ? "mainnet" : "sepolia",
      process.env.INFURA_PROJECT_ID
    );

    const ethereumBalance = await this.getBalanceForEthereum(
      walletAddress,
      provider
    );

    let usdcBalanceOnEthereum = "0.0",
      usdtBalanceOnEthereum = "0.0";

    if (NODE_ENV === "production") {
      usdcBalanceOnEthereum = await this.getBalanceForUSDCOnEthereum(
        walletAddress,
        provider
      );

      usdtBalanceOnEthereum = await this.getBalanceForUSDTOnEthereum(
        walletAddress,
        provider
      );
    }

    return {
      ethereumBalance,
      usdcBalanceOnEthereum,
      usdtBalanceOnEthereum,
    };
  };

  getAllBalancesForBinance = async (
    walletAddress: string
  ): Promise<{
    binanceBalance: string;
    usdcBalanceOnBinance: string;
    usdtBalanceOnBinance: string;
    ethBalanceOnBinance: string;
  }> => {
    const NODE_ENV = process.env.NODE_ENV;

    const web3 = new Web3(
      NODE_ENV === "production"
        ? process.env.INFURA_BSC_PROVIDER
        : process.env.INFURA_BSC_TESTNET_PROVIDER
    );

    const binanceBalance = await this.getBalanceForBinance(walletAddress, web3);

    let usdcBalanceOnBinance = "0.0",
      usdtBalanceOnBinance = "0.0",
      ethBalanceOnBinance = "0.0";

    if (NODE_ENV === "production") {
      const usdcBalanceOnBinance = await this.getBalanceForUSDCOnBinance(
        walletAddress,
        web3
      );

      const usdtBalanceOnBinance = await this.getBalanceForUSDTOnBinance(
        walletAddress,
        web3
      );

      const ethBalanceOnBinance = await this.getBalanceForETHOnBinance(
        walletAddress,
        web3
      );
    }
    return {
      binanceBalance,
      usdcBalanceOnBinance,
      usdtBalanceOnBinance,
      ethBalanceOnBinance,
    };
  };

  getBalanceForBinance = async (
    walletAddress: string,
    web3: Web3
  ): Promise<string> => {
    const balance = await web3.eth.getBalance(walletAddress);
    return web3.utils.fromWei(balance, "ether");
  };

  getBalanceForUSDCOnBinance = async (
    walletAddress: string,
    web3: Web3
  ): Promise<string> => {
    const USDC_ADDRESS_BSC = "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d";

    const contract = new web3.eth.Contract(bscUSDCContract, USDC_ADDRESS_BSC);
    const balance = await contract.methods.balanceOf(walletAddress).call();
    return web3.utils.fromWei(balance as unknown as number, "ether");
  };

  getBalanceForUSDTOnBinance = async (
    walletAddress: string,
    web3: Web3
  ): Promise<string> => {
    const USDT_ADDRESS_BSC = "0x55d398326f99059fF775485246999027B3197955";

    const contract = new web3.eth.Contract(bscUSDTContract, USDT_ADDRESS_BSC);
    const balance = await contract.methods.balanceOf(walletAddress).call();
    return web3.utils.fromWei(balance as unknown as number, "ether");
  };

  getBalanceForETHOnBinance = async (
    walletAddress: string,
    web3: Web3
  ): Promise<string> => {
    const PEG_ETH_ADDRESS_BSC = "0x2170Ed0880ac9A755fd29B2688956BD959F933F8";

    const contract = new web3.eth.Contract(bscETHContract, PEG_ETH_ADDRESS_BSC);
    const balance = await contract.methods.balanceOf(walletAddress).call();
    return web3.utils.fromWei(balance as unknown as string, "ether");
  };

  getBalanceForUSDCOnEthereum = async (
    walletAddress: string,
    provider: ethers.InfuraProvider
  ): Promise<string> => {
    const USDC_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

    const contract = new ethers.Contract(
      USDC_ADDRESS,
      ethUSDCContract,
      provider
    );
    const balance = await contract.balanceOf(walletAddress);
    return ethers.formatUnits(balance, 6);
  };

  getBalanceForUSDTOnEthereum = async (
    walletAddress: string,
    provider: ethers.InfuraProvider
  ): Promise<string> => {
    const USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

    const contract = new ethers.Contract(
      USDT_ADDRESS,
      ethUSDTContract,
      provider
    );
    const balance = await contract.balanceOf(walletAddress);
    return ethers.formatUnits(balance, 6);
  };

  getBalanceForEthereum = async (
    walletAddress: string,
    provider: ethers.InfuraProvider
  ): Promise<string> => {
    const balance = await provider.getBalance(walletAddress);
    return ethers.formatEther(balance);
  };
}

export default WalletService;
