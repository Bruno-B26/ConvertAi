import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  create(data: {
    accountId: Types.ObjectId;
    name: string;
    email: string;
    passwordHash: string;
    role?: string;
  }): Promise<UserDocument> {
    return this.userModel.create(data);
  }

  findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  updateLastLogin(id: string): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(id, { $set: { lastLoginAt: new Date() } }, { new: true })
      .exec();
  }

  setPasswordResetToken(
    id: string,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(
        id,
        { $set: { passwordResetToken: tokenHash, passwordResetExpiresAt: expiresAt } },
        { new: true },
      )
      .exec();
  }

  findByValidResetToken(tokenHash: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        passwordResetToken: tokenHash,
        passwordResetExpiresAt: { $gt: new Date() },
      })
      .exec();
  }

  resetPassword(id: string, passwordHash: string): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            passwordHash,
            passwordResetToken: null,
            passwordResetExpiresAt: null,
          },
        },
        { new: true },
      )
      .exec();
  }
}
