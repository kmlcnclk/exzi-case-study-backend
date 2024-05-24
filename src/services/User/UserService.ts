import { omit } from "lodash";

import UserModel, { UserDocument } from "../../models/userModel";
import CustomError from "../../helpers/errors/CustomError";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import sha256 from "crypto-js/sha256";
import JwtService from "../Jwt/JwtService";
import { IGeneratedJwtTokens } from "../../types/Jwt";
import UserDAO from "../../data/UserDAO";
import { SignInType, SignUpType } from "../../types/User";

class UserService {
  saltWorkFactor: number;
  jwtService: JwtService;

  constructor() {
    this.saltWorkFactor = process.env.SALT_WORK_FACTOR as unknown as
      | number
      | 10;
    this.jwtService = new JwtService();
  }

  async hashingPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltWorkFactor);
    const hash = await bcrypt.hashSync(password, salt);
    return hash;
  }

  async getUserWallet(userID: string): Promise<string> {
    const user = await UserModel.findById(userID);
    if (!user) throw new CustomError("Not Found", "User is not exist", 404);
    return user.userWallet;
  }

  async checkUserExistWithEmail(email: string): Promise<UserDocument> {
    const user = await UserModel.findOne({ email });
    if (!user) throw new CustomError("Not Found", "Email is not exist", 404);
    return user;
  }

  async checkUserExistWithID(userID: string): Promise<UserDocument> {
    const user = await UserModel.findById(userID);
    if (!user) throw new CustomError("Not Found", "User is not exist", 404);
    return user;
  }

  async findUserByID(userID: string): Promise<UserDocument> {
    const user = await UserModel.findById(userID);
    if (!user) throw new CustomError("Not Found", "User is not found", 404);
    return user;
  }

  async findUserByIDWithSelect(userID: string): Promise<UserDocument> {
    const user = await UserModel.findById(userID).select("-password");
    if (!user) throw new CustomError("Not Found", "User is not found", 404);
    return user;
  }

  async validatePasswordWithEmail({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<UserDocument> {
    const user = await this.checkUserExistWithEmail(email);

    const isValid = await user.comparePassword(password);
    if (!isValid)
      throw new CustomError(
        "Unauthorized Error",
        "Password is not correct",
        401
      );

    return omit(user.toJSON(), "password") as UserDocument;
  }

  async validatePasswordWithID({
    userID,
    password,
  }: {
    userID: string;
    password: string;
  }): Promise<UserDocument> {
    const user = await this.checkUserExistWithID(userID);

    const isValid = await user.comparePassword(password);
    if (!isValid)
      throw new CustomError("Bad Request", "Password is not correct", 400);

    return omit(user.toJSON(), "password") as UserDocument;
  }

  generateRandomString(length: number) {
    return uuidv4().replace(/-/g, "").substr(0, length);
  }

  hashStringWithSHA256(inputString: string) {
    return sha256(inputString).toString();
  }

  async getResetPasswordHash() {
    const randomString = await this.generateRandomString(15);

    const hashedString = await this.hashStringWithSHA256(randomString);

    return hashedString;
  }

  generateJwtToken = async (
    user: UserDocument
  ): Promise<IGeneratedJwtTokens> => {
    const { accessToken, refreshToken }: IGeneratedJwtTokens =
      await this.jwtService.generateJwtToken(user);

    return { accessToken, refreshToken };
  };

  createJWTToken = async (
    userId: string,
    accessToken: string,
    refreshToken: string
  ) => {
    this.jwtService.createJWTToken(userId, accessToken, refreshToken);
  };

  createUser = async (
    data: Omit<SignUpType, "passwordConfirmation">
  ): Promise<UserDocument> => {
    const user = await UserDAO.create(data);
    return user;
  };

  saveWalletToUser = async (userId: string, walletId: string) => {
    const user = await this.findUserByID(userId);

    user.ethereumWallet = walletId;

    await user.save();
  };

  isValidatePassword = async (data: SignInType): Promise<UserDocument> => {
    const resData: UserDocument = await this.validatePasswordWithEmail(data);
    return resData;
  };

  updateJwtValidWithFalseOnDb = async (userId: string) => {
    await this.jwtService.updateJwtValidWithFalseOnDb(userId);
  };

  generateWithIdAndSaveDbJwtToken = async (
    user: UserDocument
  ): Promise<object> => {
    const generatedTokensData =
      await this.jwtService.generateWithIdAndSaveDbJwtToken<UserDocument>(user);
    return generatedTokensData;
  };
}

export default UserService;
