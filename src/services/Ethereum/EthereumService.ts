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

    if (token === "tether") {
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
      if (err.message.includes("insufficient funds")) {
        throw new CustomError(
          "Insufficient Funds Error",
          "Your balance is not enough to make this transaction",
          500
        );
      } else {
        throw new CustomError("Blockchain JS Error", err.message, 500);
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
      }
      return false;
    } catch (err: any) {
      if (err.message.includes("insufficient funds")) {
        throw new CustomError(
          "Insufficient Funds Error",
          "Your balance is not enough to make this transaction",
          500
        );
      } else {
        throw new CustomError("Blockchain JS Error", err.message, 500);
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
      }
      return false;
    } catch (err: any) {
      if (err.message.includes("insufficient funds")) {
        throw new CustomError(
          "Insufficient Funds Error",
          "Your balance is not enough to make this transaction",
          500
        );
      } else {
        throw new CustomError("Blockchain JS Error", err.message, 500);
      }
    }
  };

  buyCoin = async (privateKey: string, value: string, tokens: string[]) => {
    const NODE_ENV = process.env.NODE_ENV;

    const provider = new ethers.InfuraProvider(
      NODE_ENV === "production" ? "mainnet" : "sepolia",
      process.env.INFURA_PROJECT_ID
    );

    let from = "",
      to = "";

    if (tokens[0] === "eth") {
      from = "0x0000000000000000000000000000000000000000";
    } else if (tokens[0] === "usdc") {
      from = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    } else if (tokens[0] === "tether") {
      from = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
    }

    if (tokens[1] === "eth") {
      from = "0x0000000000000000000000000000000000000000";
    } else if (tokens[1] === "usdc") {
      from = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    } else if (tokens[1] === "tether") {
      from = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
    }

    let receipt: any;

    if (tokens[0] === "eth") {
      receipt = await this.buyExchange(privateKey, provider, from, to, value);
    } else {
      receipt = await this.buyExchangeWithContracts(
        privateKey,
        provider,
        from,
        to,
        value
      );
    }

    return receipt;
  };

  buyExchange = async (
    privateKey: string,
    provider: ethers.Provider,
    from: string,
    to: string,
    value: string
  ) => {
    try {
      const wallet = new ethers.Wallet(privateKey, provider);

      const amount = await ethers.parseEther(value);

      const uniswapRouterAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";

      const uniswapRouterABI = [
        "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) payable returns (uint[] memory amounts)",
      ];

      const uniswapRouterContract = new ethers.Contract(
        uniswapRouterAddress,
        uniswapRouterABI,
        wallet
      );

      const amountOutMin = 0;
      const path = [from, to];
      const toAddress = wallet.address;
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
      console.log(1);

      const tx = await uniswapRouterContract.swapExactETHForTokens(
        amountOutMin,
        path,
        toAddress,
        deadline,
        amount
      );
      console.log(1);

      console.log(`Transaction hash: ${tx.hash}`);
      console.log(1);

      const receipt = await tx.wait();

      console.log(receipt);
      return receipt;
    } catch (err: any) {
      if (err.message.includes("too many decimal")) {
        throw new CustomError(
          "Small Amount Error",
          "The amount is too small to make this transaction",
          500
        );
      } else if (err.message.includes("insufficient funds")) {
        throw new CustomError(
          "Insufficient Funds Error",
          "Your balance is not enough to make this transaction",
          500
        );
      } else if (err.message.includes("unconfigured name")) {
        throw new CustomError(
          "Internal Server Error",
          "Internal Server Error | Unconfigured Name",
          500
        );
      } else {
        throw new CustomError("Blockchain JS Error", err.message, 500);
      }
    }
  };

  buyExchangeWithContracts = async (
    privateKey: string,
    provider: ethers.Provider,
    from: string,
    to: string,
    value: string
  ) => {
    try {
      const uniswapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

      const uniswapRouterABI = [
        "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) returns (uint[] memory amounts)",
      ];

      const wallet = new ethers.Wallet(privateKey, provider);

      const amount = await ethers.parseUnits(value, 6);

      const uniswapRouterContract = new ethers.Contract(
        uniswapRouterAddress,
        uniswapRouterABI,
        wallet
      );
      const amountOutMin = 0;
      const path = [from, to];
      const toAddress = wallet.address;
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

      const usdtContract = new ethers.Contract(
        from,
        [
          "function approve(address spender, uint256 amount) public returns (bool)",
        ],
        wallet
      );

      const approveTx = await usdtContract.approve(
        uniswapRouterAddress,
        amount
      );

      console.log(`Approve transaction hash: ${approveTx.hash}`);
      await approveTx.wait();

      const swapTx = await uniswapRouterContract.swapExactTokensForTokens(
        amount,
        amountOutMin,
        path,
        toAddress,
        deadline
      );

      console.log(`Swap transaction hash: ${swapTx.hash}`);

      const receipt = await swapTx.wait();

      console.log(`Transaction was mined in block ${receipt.blockNumber}`);

      return receipt;
    } catch (err: any) {
      if (err.message.includes("too many decimal")) {
        throw new CustomError(
          "Small Amount Error",
          "The amount is too small to make this transaction",
          500
        );
      } else if (err.message.includes("insufficient funds")) {
        throw new CustomError(
          "Insufficient Funds Error",
          "Your balance is not enough to make this transaction",
          500
        );
      } else if (err.message.includes("unconfigured name")) {
        throw new CustomError(
          "Internal Server Error",
          "Internal Server Error | Unconfigured Name",
          500
        );
      } else {
        throw new CustomError("Blockchain JS Error", err.message, 500);
      }
    }
  };

  sellCoin = () => {};
}

export default EthereumService;
