import { object, string } from "zod";

export const withdrawWalletSchema = object({
  body: object({
    amount: string({
      required_error: "Amount is required",
    }),
    to: string({
      required_error: "To is required",
    }),
    network: string({
      required_error: "Network is required",
    }),
    token: string({
      required_error: "Token is required",
    }),
  }),
});
