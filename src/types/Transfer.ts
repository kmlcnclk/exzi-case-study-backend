export interface ITransfer {
  userWallet: string;
  currentToken: string;
  currentNetwork: string;
  amountOfPay: string;
  amountOfReceive: string;
  tokenPrice: string;
  stage: string;
  isTransferred: boolean;
  hash: string;
}

export type CreateType = Omit<ITransfer, "isTransferred">;

export type TransferReturnType = ITransfer & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};
