import Web3, { Bytes } from "web3";
import bscUSDTContract from "../../contracts/bsc_usdt_contract.json";
import bscUSDCContract from "../../contracts/bsc_usdc_contract.json";
import bscETHContract from "../../contracts/bsc_eth_contract.json";
import Erc20Token from "../Web3/Web3Service";
import { ethers } from "ethers";
import CustomError from "../../helpers/errors/CustomError";

class BinanceService {
  constructor() {}

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
      usdcBalanceOnBinance = await this.getBalanceForUSDCOnBinance(
        walletAddress,
        web3
      );

      usdtBalanceOnBinance = await this.getBalanceForUSDTOnBinance(
        walletAddress,
        web3
      );

      ethBalanceOnBinance = await this.getBalanceForETHOnBinance(
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

  withdrawForBinance = async (
    amount: string,
    privateKey: string,
    to: string,
    from: string,
    token: string
  ) => {
    const NODE_ENV = process.env.NODE_ENV;

    const provider = new ethers.JsonRpcProvider(
      NODE_ENV === "production"
        ? process.env.INFURA_BSC_PROVIDER
        : process.env.INFURA_BSC_TESTNET_PROVIDER,
      { name: "binance", chainId: NODE_ENV === "production" ? 56 : 97 }
    );

    const wallet = new ethers.Wallet(privateKey, provider);

    let result: string | boolean | Bytes = false;

    if (token === "usdt") {
      if (NODE_ENV === "production") {
        result = await this.withdrawForUSDTOnBinance(
          amount,
          from,
          to,
          privateKey
        );
      } else {
        return "0x";
      }
    } else if (token === "usdc") {
      if (NODE_ENV === "production") {
        result = await this.withdrawForUSDCOnBinance(
          amount,
          from,
          to,
          privateKey
        );
      } else {
        return "0x";
      }
    } else if (token === "eth") {
      if (NODE_ENV === "production") {
        result = await this.withdrawForETHOnBinance(
          amount,
          from,
          to,
          privateKey
        );
      } else {
        return "0x";
      }
    } else {
      result = await this.withdrawForBNBOnBinance(amount, to, wallet);
    }

    return result;
  };

  withdrawForBNBOnBinance = async (
    value: string,
    to: string,
    wallet: ethers.Wallet
  ): Promise<string | boolean> => {
    try {
      const amount = ethers.parseUnits(value.toString(), 18);

      const tx = {
        to: to,
        value: amount,
        gasLimit: 32000,
        gasPrice: 3000000000,
      };

      const transaction = await wallet.sendTransaction(tx);

      const receipt = await transaction.wait();

      if (receipt?.from === wallet.address && receipt?.to === to)
        return receipt?.hash;
      return false;
    } catch (err: any) {
      if (
        err?.message?.includes("insufficient funds") ||
        err?.error?.message?.includes("insufficient funds") ||
        err?.error?.message?.includes("exceeds balance")
      ) {
        throw new CustomError(
          "Insufficient Funds Error",
          "Your balance is not enough to make this transaction",
          500
        );
      } else {
        throw new CustomError(
          "Blockchain JS Error",
          err?.message || err?.error?.message,
          500
        );
      }
    }
  };

  withdrawForUSDTOnBinance = async (
    value: string,
    from: string,
    to: string,
    privateKey: string
  ) => {
    const erc20Token = new Erc20Token(
      "bsc",
      "0x55d398326f99059fF775485246999027B3197955",
      privateKey,
      from,
      bscUSDTContract
    );

    const tx = await erc20Token.transfer(to, Number(value));
    return tx;
  };

  withdrawForUSDCOnBinance = async (
    value: string,
    from: string,
    to: string,
    privateKey: string
  ) => {
    const erc20Token = new Erc20Token(
      "bsc",
      "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
      privateKey,
      from,
      bscUSDCContract
    );

    const tx = await erc20Token.transfer(to, Number(value));
    return tx;
  };

  withdrawForETHOnBinance = async (
    value: string,
    from: string,
    to: string,
    privateKey: string
  ) => {
    const erc20Token = new Erc20Token(
      "bsc",
      "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
      privateKey,
      from,
      bscETHContract
    );

    const tx = await erc20Token.transfer(to, Number(value));
    return tx;
  };
}

export default BinanceService;
