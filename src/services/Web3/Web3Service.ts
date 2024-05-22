import Web3, { Bytes, EthExecutionAPI, SupportedProviders } from "web3";
import erc20ContractArtifact from "../../contracts/Erc20Token.json";
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
    account: string
  ) {
    const currentNetwork = this.whichNetwork(network);

    const provider = new HDWalletProvider({
      mnemonic: {
        phrase: process.env.MNEMONIC as string,
      },
      providerOrUrl: currentNetwork,
    }) as SupportedProviders<EthExecutionAPI>;
    this._web3 = new Web3(provider);

    this._contract = new this._web3.eth.Contract(
      erc20ContractArtifact.abi,
      contractAddress
    );

    this._contractAddress = contractAddress;
    this._privateKey = privateKey;
    this._account = account;
  }

  private whichNetwork(network: string) {
    switch (network.toLowerCase()) {
      case "eth":
        return process.env.INFURA_ETHEREUM_TESTNET_PROVIDER;
      default:
        return process.env.INFURA_ETHEREUM_TESTNET_PROVIDER;
    }
  }

  async totalSupply() {
    return this._contract.methods.totalSupply().call();
  }

  async balanceOf(address: string): Promise<{
    balance: number;
    tokenName: string;
    tokenSymbol: string;
  }> {
    const balance = await this._contract.methods.balanceOf(address).call();

    const { tokenName, tokenSymbol } = await this.getTokenNameAndSymbol();

    return {
      tokenName,
      tokenSymbol,
      balance: Number(balance) / 10 ** 18,
    };
  }

  async getTokenNameAndSymbol(): Promise<{
    tokenName: string;
    tokenSymbol: string;
  }> {
    const tokenName = await this._contract.methods.name().call();
    const tokenSymbol = await this._contract.methods.symbol().call();

    return {
      tokenName,
      tokenSymbol,
    };
  }

  async owner() {
    return this._contract.methods.owner().call();
  }

  async getTransactions() {
    let datas = [];
    const logs = await this._contract.getPastEvents({
      event: "allEvents",
      fromBlock: "earliest",
      toBlock: "latest",
    });

    for (let i = 0; i < logs.length; i++) {
      let data: any = {};
      data["transactionHash"] = logs[i].transactionHash;
      const t = await this._web3.eth.getTransaction(logs[i].transactionHash);
      data["from"] = t.from;
      data["to"] = t.to;
      const bn = await this._web3.eth.getBlock(t.blockNumber);

      data["age"] = Math.floor(Date.now() / 1000) - Number(bn.timestamp);
      datas.push(data);
    }
    return datas;
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
      if (err.error.message.indexOf("insufficient funds") != -1) {
        throw new CustomError("Web3 JS Error", "Insufficient funds", 500);
      } else {
        throw new CustomError("Web3 JS Error", err.error.message, 500);
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
      if (err.error.message.indexOf("insufficient funds") != -1) {
        throw new CustomError("Web3 JS Error", "Insufficient funds", 500);
      } else {
        throw new CustomError("Web3 JS Error", err.error.message, 500);
      }
    }
  }

  public async transfer(to: string, amount: number): Promise<void> {
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

      await this._web3.eth.sendSignedTransaction(
        signedTransaction.rawTransaction
      );
    } catch (err: any) {
      if (err.error.message.indexOf("insufficient funds") != -1) {
        throw new CustomError("Web3 JS Error", "Insufficient funds", 500);
      } else {
        throw new CustomError("Web3 JS Error", err.error.message, 500);
      }
    }
  }

  public async transferForClaim(to: string, amount: number): Promise<Bytes> {
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
      if (err?.error?.message.indexOf("insufficient funds") != -1) {
        throw new CustomError("Web3 JS Error", "Insufficient funds", 500);
      } else {
        throw new CustomError("Web3 JS Error", err.error.message, 500);
      }
    }
  }
}
