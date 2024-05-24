import { ethers } from "ethers";
import CustomError from "../../helpers/errors/CustomError";

class SwapService {
  public buyAndSellCoin = async (
    privateKey: string,
    value: string,
    tokens: string[],
    network: string
  ) => {
    const NODE_ENV = process.env.NODE_ENV;

    const provider = new ethers.InfuraProvider(
      NODE_ENV === "production" ? "mainnet" : "sepolia",
      process.env.INFURA_PROJECT_ID
    );

    let from = "",
      to = "",
      receipt: any,
      contractAddress: string = "";

    if (NODE_ENV === "production") {
      if (network === "eth") {
        if (tokens[0] === "eth") {
          from = "0x0000000000000000000000000000000000000000";
        } else if (tokens[0] === "usdc") {
          from = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
        } else if (tokens[0] === "usdt") {
          from = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
        }

        if (tokens[1] === "eth") {
          to = "0x0000000000000000000000000000000000000000";
        } else if (tokens[1] === "usdc") {
          to = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
        } else if (tokens[1] === "usdt") {
          to = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
        }

        contractAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
        if (tokens[0] === "eth") {
          receipt = await this.swapExchange(
            privateKey,
            provider,
            from,
            to,
            value,
            contractAddress,
            tokens
          );
        } else {
          receipt = await this.swapWithContracts(
            privateKey,
            provider,
            from,
            to,
            value,
            contractAddress,
            tokens
          );
        }
      } else if (network === "bsc") {
        if (tokens[0] === "eth") {
          from = "0x2170Ed0880ac9A755fd29B2688956BD959F933F8";
        } else if (tokens[0] === "usdc") {
          from = "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d";
        } else if (tokens[0] === "usdt") {
          from = "0x55d398326f99059ff775485246999027b3197955";
        } else if (tokens[0] === "bnb") {
          from = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
        }

        if (tokens[1] === "eth") {
          to = "0x2170Ed0880ac9A755fd29B2688956BD959F933F8";
        } else if (tokens[1] === "usdc") {
          to = "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d";
        } else if (tokens[1] === "usdt") {
          to = "0x55d398326f99059ff775485246999027b3197955";
        } else if (tokens[0] === "bnb") {
          from = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
        }

        contractAddress = "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24";

        receipt = await this.swapWithContracts(
          privateKey,
          provider,
          from,
          to,
          value,
          contractAddress,
          tokens
        );
      } else {
        throw new CustomError(
          "Bad Request",
          "This network is not supported now!",
          400
        );
      }
    } else {
      throw new CustomError(
        "Internal Server Error",
        "Project NODE_ENV variable is not support to this operation",
        500
      );
    }

    return receipt;
  };

  private swapExchange = async (
    privateKey: string,
    provider: ethers.Provider,
    from: string,
    to: string,
    value: string,
    contractAddress: string,
    tokens: string[]
  ) => {
    try {
      const wallet = new ethers.Wallet(privateKey, provider);

      const amount = await this.parseUnitsForCoin(value, tokens[0]);

      const uniswapRouterAddress = contractAddress;

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

      const tx = await uniswapRouterContract.swapExactETHForTokens(
        amountOutMin,
        path,
        toAddress,
        deadline,
        amount,
        {
          gasLimit: 30000,
          gasPrice: 42000000000,
        }
      );

      const receipt = await tx.wait();

      return receipt.transactionHash;
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
      } else if (err.message.includes("no matching fragment")) {
        throw new CustomError(
          "Internal Server Error",
          "Internal Server Error | address of the contract is not correct",
          500
        );
      } else {
        throw new CustomError("Blockchain JS Error", err.message, 500);
      }
    }
  };

  private swapWithContracts = async (
    privateKey: string,
    provider: ethers.Provider,
    from: string,
    to: string,
    value: string,
    contractAddress: string,
    tokens: string[]
  ) => {
    try {
      const uniswapRouterAddress = contractAddress;

      const uniswapRouterABI = [
        "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) returns (uint[] memory amounts)",
      ];

      const wallet = new ethers.Wallet(privateKey, provider);

      const amount = await this.parseUnitsForCoin(value, tokens[0]);

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

      await approveTx.wait();

      const swapTx = await uniswapRouterContract.swapExactTokensForTokens(
        amount,
        amountOutMin,
        path,
        toAddress,
        deadline,
        {
          gasLimit: 30000,
          gasPrice: 42000000000,
        }
      );

      const receipt = await swapTx.wait();

      return receipt.transactionHash;
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
      } else if (err.message.includes("no matching fragment")) {
        throw new CustomError(
          "Internal Server Error",
          "Internal Server Error | address of the contract is not correct",
          500
        );
      } else {
        throw new CustomError("Blockchain JS Error", err.message, 500);
      }
    }
  };

  private parseUnitsForCoin = async (value: string, coin: string) => {
    let decimals;
    switch (coin) {
      case "usdt":
        decimals = 6;
        break;
      case "usdc":
        decimals = 6;
        break;
      case "eth":
        decimals = 18;
        break;
      case "bnb":
        decimals = 18;
        break;
      default:
        decimals = 18;
    }

    return ethers.parseUnits(value, decimals);
  };
}

export default SwapService;
