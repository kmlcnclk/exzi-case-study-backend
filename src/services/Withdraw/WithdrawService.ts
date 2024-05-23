import WithdrawDAO from "../../data/WithdrawDAO";

class WithdrawService {
  createWithdraw = async (userID: string, walletID: string, tx: string) => {
    await WithdrawDAO.create({
      tx,
      user: userID,
      wallet: walletID,
    });
  };
}

export default WithdrawService;
