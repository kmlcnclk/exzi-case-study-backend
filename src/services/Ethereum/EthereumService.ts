import { Contract, ethers } from "ethers";
import ethUSDTContract from "../../contracts/eth_usdt_contract.json";
import ethUSDCContract from "../../contracts/eth_usdc_contract.json";
import BigNumber from "bignumber.js";
import CustomError from "../../helpers/errors/CustomError";

class EthereumService {
  constructor() {}

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

  withdrawForEthereum = async (
    amount: string,
    privateKey: string,
    to: string,
    token: string
  ) => {
    const NODE_ENV = process.env.NODE_ENV;

    const provider = new ethers.InfuraProvider(
      NODE_ENV === "production" ? "mainnet" : "sepolia",
      process.env.INFURA_PROJECT_ID
    );

    const wallet = new ethers.Wallet(privateKey, provider);

    let result: string | boolean = false;

    if (token === "usdt") {
      if (NODE_ENV === "production") {
        result = await this.withdrawForUSDTOnEthereum(
          amount,
          wallet.address,
          to,
          provider
        );
      } else {
        return "0x";
      }
    } else if (token === "usdc") {
      if (NODE_ENV === "production") {
        result = await this.withdrawForUSDCOnEthereum(
          amount,
          wallet.address,
          to,
          provider
        );
      } else {
        return "0x";
      }
    } else {
      result = await this.withdrawForETHOnEthereum(amount, to, wallet);
    }

    return result;
  };

  withdrawForETHOnEthereum = async (
    value: string,
    to: string,
    wallet: ethers.Wallet
  ): Promise<string | boolean> => {
    try {
      const amount = ethers.parseUnits(value.toString(), 18);

      const tx = {
        to: to,
        value: amount,
        gasLimit: 30000,
        gasPrice: 42000000000,
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
      } else if (err.message.includes("too many decimal")) {
        throw new CustomError(
          "Small Amount Error",
          "The amount is too small to make this transaction",
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

  withdrawForUSDTOnEthereum = async (
    value: string,
    from: string,
    to: string,
    provider: ethers.InfuraProvider
  ) => {
    try {
      const tokenContract = new ethers.Contract(
        "0xdac17f958d2ee523a2206206994597c13d831ec7",
        ethUSDTContract,
        provider
      );

      const balance = await tokenContract.balanceOf(from);

      const decimals = await tokenContract.decimals();

      const amount = ethers.parseUnits(value.toString(), Number(decimals));

      const isBalanceGreater = new BigNumber(
        Number(balance)
      ).isGreaterThanOrEqualTo(Number(amount));

      if (isBalanceGreater) {
        const tx = await tokenContract.transfer(to, amount);

        await tx.wait();

        if (tx.from === from) return tx.hash;
      } else {
        throw new CustomError(
          "Insufficient Funds Error",
          "Your balance is not enough to make this transaction",
          500
        );
      }
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
      } else if (err.message.includes("too many decimal")) {
        throw new CustomError(
          "Small Amount Error",
          "The amount is too small to make this transaction",
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

  withdrawForUSDCOnEthereum = async (
    value: string,
    from: string,
    to: string,
    provider: ethers.InfuraProvider
  ) => {
    try {
      const tokenContract = new Contract(
        "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        ethUSDCContract,
        provider
      );

      const balance = await tokenContract.balanceOf(from);

      const decimals = await tokenContract.decimals();

      const amount = ethers.parseUnits(value.toString(), Number(decimals));

      const isBalanceGreater = new BigNumber(
        Number(balance)
      ).isGreaterThanOrEqualTo(Number(amount));

      if (isBalanceGreater) {
        const tx = await tokenContract.transfer(to, amount);

        await tx.wait();

        if (tx.from === from) return tx.hash;
      } else {
        throw new CustomError(
          "Insufficient Funds Error",
          "Your balance is not enough to make this transaction",
          500
        );
      }
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
      } else if (err.message.includes("too many decimal")) {
        throw new CustomError(
          "Small Amount Error",
          "The amount is too small to make this transaction",
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
}

export default EthereumService;
