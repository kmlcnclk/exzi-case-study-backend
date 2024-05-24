import { array, object, string } from "zod";

export const buyAndSellTradeSchema = object({
  body: object({
    tokens: array(
      string({
        required_error: "Token is required",
      })
    ),
    amount: string({
      required_error: "Amount is required",
    }),
    network: string({
      required_error: "Network is required",
    }),
  }),
});
