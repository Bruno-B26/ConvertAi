import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from './schemas/account.schema';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsRepository {
  constructor(
    @InjectModel(Account.name) private readonly accountModel: Model<AccountDocument>,
  ) {}

  create(data: { name: string; slug: string }): Promise<AccountDocument> {
    return this.accountModel.create(data);
  }

  findById(id: string): Promise<AccountDocument | null> {
    return this.accountModel.findById(id).exec();
  }

  findBySlug(slug: string): Promise<AccountDocument | null> {
    return this.accountModel.findOne({ slug }).exec();
  }

  updateById(id: string, data: UpdateAccountDto): Promise<AccountDocument | null> {
    const { settings, ...rest } = data;
    const $set: Record<string, unknown> = { ...rest };

    if (settings) {
      for (const [key, value] of Object.entries(settings)) {
        if (value !== undefined) {
          $set[`settings.${key}`] = value;
        }
      }
    }

    return this.accountModel.findByIdAndUpdate(id, { $set }, { new: true }).exec();
  }
}
