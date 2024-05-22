import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "../types/User";

const saltWorkFactor = process.env.SALT_WORK_FACTOR as unknown as number | 10;

export interface UserDocument extends IUser, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<Boolean>;
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    ethereumWallet: { type: mongoose.Schema.Types.ObjectId, ref: "Wallet" },
    bitcoinWallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  let user = this as UserDocument;

  if (!user.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(saltWorkFactor);
  const hash = await bcrypt.hashSync(user.password, salt);
  user.password = hash;
  return next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as UserDocument;

  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

const UserModel =
  mongoose.models.User || mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
