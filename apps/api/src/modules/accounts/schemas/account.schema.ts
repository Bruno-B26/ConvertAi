import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AccountDocument = HydratedDocument<Account>;

@Schema({ timestamps: true })
export class Account {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ enum: ['free', 'starter', 'pro'], default: 'free' })
  plan: string;

  @Prop({ enum: ['active', 'suspended'], default: 'active' })
  status: string;

  @Prop({
    type: {
      whatsappConnected: { type: Boolean, default: false },
      whatsappPhone: { type: String, default: null },
      whatsappQrCode: { type: String, default: null },
    },
    default: () => ({ whatsappConnected: false, whatsappPhone: null, whatsappQrCode: null }),
  })
  settings: {
    whatsappConnected: boolean;
    whatsappPhone: string | null;
    whatsappQrCode: string | null;
  };

  createdAt: Date;
  updatedAt: Date;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
