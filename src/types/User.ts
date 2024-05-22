import { WalletDocument } from "../models/walletModel";

export interface IUser {
  email: string;
  name: string;
  password: string;
  ethereumWallet?: WalletDocument["_id"];
  bitcoinWallet?: WalletDocument["_id"];
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
}

export type SignUpType = Omit<
  Omit<
    Omit<Omit<IUser, "ethereumWallet">, "bitcoinWallet">,
    "resetPasswordToken"
  >,
  "resetPasswordExpire"
> & {
  passwordConfirmation: string;
};


export type SignInType = {
  email: string;
  password: string;
};

export type SignUpTypeWithGoogle = { email: string; name: string };
export type SignInTypeWithGoogle = { email: string };

export type ReturnedUserType = Omit<IUser, "password"> & {
  createdAt: string;
  updatedAt: string;
  _id: string;
  __v: number;
};
