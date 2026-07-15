import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class N8nWebhookService {
  private readonly logger = new Logger(N8nWebhookService.name);

  async dispatch(url: string | undefined, payload: Record<string, unknown>): Promise<void> {
    if (!url) {
      this.logger.warn('Webhook do n8n não configurado — disparo ignorado');
      return;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        this.logger.error(`Webhook n8n respondeu ${response.status} (${url})`);
      }
    } catch (error) {
      this.logger.error(`Falha ao chamar webhook n8n (${url}): ${(error as Error).message}`);
    }
  }
}
