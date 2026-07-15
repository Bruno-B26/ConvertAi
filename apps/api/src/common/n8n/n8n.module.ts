import { Module } from '@nestjs/common';
import { N8nWebhookService } from './n8n-webhook.service';

@Module({
  providers: [N8nWebhookService],
  exports: [N8nWebhookService],
})
export class N8nModule {}
