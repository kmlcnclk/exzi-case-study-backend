import Web3, { Bytes, EthExecutionAPI, SupportedProviders } from "web3";
import HDWalletProvider from "@truffle/hdwallet-provider";
import { IErc20 } from "./IErc20";
import CustomError from "../../helpers/errors/CustomError";

export default class Erc20Token implements IErc20 {
  private _web3: Web3;
  private _contract: any;
  private _contractAddress: string;
  private _privateKey: string;
  private _account: string;

  constructor(
    network: string,
    contractAddress: string,
    privateKey: string,
    account: string,
    contractABI: any
  ) {
    const currentNetwork = this.whichNetwork(network);

    const provider = new HDWalletProvider({
      mnemonic: {
        phrase: process.env.MNEMONIC as string,
      },
      providerOrUrl: currentNetwork,
    }) as SupportedProviders<EthExecutionAPI>;
    this._web3 = new Web3(provider);

    this._contract = new this._web3.eth.Contract(contractABI, contractAddress);

    this._contractAddress = contractAddress;
    this._privateKey = privateKey;
    this._account = account;
  }

  balanceOf(address: string): Promise<object> {
    throw new Error("Method not implemented.");
  }

  private whichNetwork(network: string) {
    const NODE_ENV = process.env.NODE_ENV;

    switch (network.toLowerCase()) {
      case "bsc":
        return NODE_ENV === "production"
          ? process.env.INFURA_BSC_PROVIDER
          : process.env.INFURA_BSC_TESTNET_PROVIDER;
      case "eth":
        return NODE_ENV === "production"
          ? process.env.INFURA_ETHEREUM_PROVIDER
          : process.env.INFURA_ETHEREUM_TESTNET_PROVIDER;
      default:
        return process.env.INFURA_BSC_TESTNET_PROVIDER;
    }
  }

  async totalSupply() {
    return this._contract.methods.totalSupply().call();
  }

  async owner() {
    return this._contract.methods.owner().call();
  }

  async approve(spender: string, amount: number) {
    const tokenAmount = Web3.utils.toBigInt(
      Web3.utils.toWei(String(amount), "ether")
    );
    const transaction = await this._contract.methods
      .approve(spender, tokenAmount)
      .send({ from: this._account });
    return transaction;
  }

  public async mint(to: string, amount: number): Promise<void> {
    try {
      const tokenAmount = Web3.utils.toBigInt(
        Web3.utils.toWei(String(amount), "ether")
      );
      const mintTx = this._contract.methods.mint(to, tokenAmount);

      const data = mintTx.encodeABI();

      const tx = {
        to: this._contractAddress,
        from: to,
        data: data,
      } as any;

      const gas = await this._web3.eth.estimateGas(tx);
      const gasPrice = await this._web3.eth.getGasPrice();
      const nonce = await this._web3.eth.getTransactionCount(to);

      tx.gas = this._web3.utils.toHex(gas);
      tx.gasPrice = this._web3.utils.toHex(gasPrice);
      tx.nonce = this._web3.utils.toHex(nonce);

      const signedTransaction = await this._web3.eth.accounts.signTransaction(
        tx,
        this._privateKey
      );

      await this._web3.eth.sendSignedTransaction(
        signedTransaction.rawTransaction
      );
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
  }

  async transferOwnership(newOwner: string) {
    const transaction = await this._contract.methods
      .transferOwnership(newOwner)
      .send({ from: this._account });
    return transaction;
  }

  public async transferFrom(
    from: string,
    to: string,
    amount: number
  ): Promise<void> {
    try {
      const tokenAmount = Web3.utils.toBigInt(
        Web3.utils.toWei(String(amount), "ether")
      );

      const transferTx = this._contract.methods.transferFrom(
        from,
        to,
        tokenAmount
      );

      const data = transferTx.encodeABI();

      const tx = {
        to: this._contractAddress,
        data: data,
      } as any;

      const gas = await this._web3.eth.estimateGas(tx);
      const gasPrice = await this._web3.eth.getGasPrice();
      const nonce = await this._web3.eth.getTransactionCount(from);

      tx.gas = this._web3.utils.toHex(gas);
      tx.gasPrice = this._web3.utils.toHex(gasPrice);
      tx.nonce = this._web3.utils.toHex(nonce);

      const signedTransaction = await this._web3.eth.accounts.signTransaction(
        tx,
        this._privateKey
      );

      await this._web3.eth.sendSignedTransaction(
        signedTransaction.rawTransaction
      );
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
  }

  public async transfer(to: string, amount: number): Promise<Bytes> {
    try {
      const tokenAmount = Web3.utils.toBigInt(
        Web3.utils.toWei(String(amount), "ether")
      );

      const transferTx = this._contract.methods.transfer(to, tokenAmount);

      const data = transferTx.encodeABI();
      const tx = {
        to: this._contractAddress,
        from: this._account,
        data: data,
      } as any;

      const gas = await this._web3.eth.estimateGas(tx);
      const gasPrice = await this._web3.eth.getGasPrice();
      const nonce = await this._web3.eth.getTransactionCount(this._account);

      tx.gas = this._web3.utils.toHex(gas);
      tx.gasPrice = this._web3.utils.toHex(gasPrice);
      tx.nonce = this._web3.utils.toHex(nonce);

      const signedTransaction = await this._web3.eth.accounts.signTransaction(
        tx,
        this._privateKey
      );

      const { transactionHash } = await this._web3.eth.sendSignedTransaction(
        signedTransaction.rawTransaction
      );
      return transactionHash;
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
  }
}
