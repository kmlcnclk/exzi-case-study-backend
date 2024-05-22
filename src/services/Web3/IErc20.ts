export interface IErc20 {
  balanceOf(address: string): Promise<object>;
  owner(): Promise<string>;
  totalSupply(): Promise<number>;
  approve(spender: string, amount: number): Promise<any>;
  mint(to: string, amount: number): Promise<any>;
  transfer(to: string, amount: number): Promise<any>;
  transferFrom(from: string, to: string, amount: number): Promise<any>;
  transferOwnership(newOwner: string): Promise<any>;
}
