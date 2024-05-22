import { Bytes } from "web3";
import Erc20Token from "../Web3/Web3Service";

class TokenService {
  private _erc20Token: Erc20Token;

  constructor(
    network: string,
    contractAddress: string,
    privateKey: string,
    account: string
  ) {
    this._erc20Token = new Erc20Token(
      network,
      contractAddress,
      privateKey,
      account
    );
  }

  async mint(to: string, amount: number): Promise<void> {
    await this._erc20Token.mint(to, amount);
  }

  async transferFrom(from: string, to: string, amount: number): Promise<void> {
    await this._erc20Token.transferFrom(from, to, amount);
  }

  async transfer(to: string, amount: number): Promise<void> {
    await this._erc20Token.transfer(to, amount);
  }

  async transferForClaim(to: string, amount: number): Promise<Bytes> {
    return await this._erc20Token.transferForClaim(to, amount);
  }

  async totalSupply(): Promise<number> {
    return this._erc20Token.totalSupply();
  }

  async balanceOf(address: string) {
    return this._erc20Token.balanceOf(address);
  }

  async getTransactions() {
    return this._erc20Token.getTransactions();
  }
}

export default TokenService;
