import { Injectable } from '@nestjs/common';
import { TwilioService } from 'nestjs-twilio';
import SendGrid from '@sendgrid/mail';
import Util from './util';

@Injectable()
export class NotificationsService {
  constructor(private readonly twilioService: TwilioService) {
    SendGrid.setApiKey(process.env.SEND_GRID_KEY);
  }

  async sendSMSOnly(phone: string, message: string): Promise<any> {
    if (process.env.ENABLE_SMS === 'true') {
      return this.twilioService.client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: Util.numberUtil(phone),
      });
    }
  }

  async sendSMSVerification(phone: string): Promise<any> {
    try {
      if (process.env.ENABLE_SMS === 'true') {
        const params = {
          to: Util.numberUtil(phone),
          channel: 'sms',
        };

        return this.twilioService.client.verify.v2
          .services(process.env.TWILIO_VERIFY_SID)
          .verifications.create(params);
      }

      return true;
    } catch (e) {
      return false;
    }
  }

  async verifySMS(code: string, phone: string): Promise<any> {
    try {
      if (process.env.ENABLE_SMS === 'true') {
        return this.twilioService.client.verify.v2
          .services(process.env.TWILIO_VERIFY_SID)
          .verificationChecks.create({
            to: Util.numberUtil(phone),
            code,
          });
      }

      return true;
    } catch (e) {
      return false;
    }
  }

  async sendWelcomeEmail(to: string, vendor: Record<string, any>) {
    if (process.env.ENABLE_EMAIL === 'true') {
      try {
        const payload: any = {
          to,
          from: process.env.SENDGRID_SENDER,
          subject: '[ACTION REQUIRED] Callback Requested',
          templateId: process.env.SEND_GRID_WELCOME_TEMPLATE_ID,
          dynamicTemplateData: {
            url: '',
            name: vendor.firstName,
          },
        };
        const transport = await SendGrid.send(payload);

        return transport;
      } catch (e) {
        console.error(e);
      }
    }
  }

  async sendCallbackEmail(to: string, data: Record<string, any>) {
    if (process.env.ENABLE_EMAIL === 'true') {
      try {
        const payload: any = {
          to,
          from: process.env.SENDGRID_SENDER,
          templateId: process.env.SEND_GRID_CALLBACK_TEMPLATE_ID,
          dynamicTemplateData: {
            name: data.vendor,
            customer: data.name,
            phone: Util.numberUtil(data.phone),
            product: data.product,
          },
        };
        const transport = await SendGrid.send(payload, false);

        return transport;
      } catch (e) {
        console.error(e.response.body);
      }
    }
  }

  async sendSecurityEmail(to: string, vendor: Record<string, any>) {
    if (process.env.ENABLE_EMAIL === 'true') {
      try {
        const payload: any = {
          to,
          from: process.env.SENDGRID_SENDER,
          subject: '[ACTION REQUIRED] Callback Requested',
          templateId: process.env.SEND_GRID_SECURITY_TEMPLATE_ID,
          dynamicTemplateData: {
            url: 'ogfimsweb@gmail.com',
            name: vendor.name,
          },
        };
        const transport = await SendGrid.send(payload);

        return transport;
      } catch (e) {
        console.error(e.response.body);
      }
    }
  }

  async sendPromotionEmail(to: string, data: Record<string, any>) {
    if (process.env.ENABLE_EMAIL === 'true') {
      try {
        const payload: any = {
          to,
          from: process.env.SENDGRID_SENDER,
          templateId: process.env.SEND_GRID_PROMOTION_TEMPLATE_ID,
          dynamicTemplateData: data,
        };
        const transport = await SendGrid.send(payload);

        return transport;
      } catch (e) {
        console.error(e.response.body);
      }
    }
  }

  async sendExpirationEmail(to: string, data: Record<string, any>) {
    if (process.env.ENABLE_EMAIL === 'true') {
      try {
        const payload: any = {
          to,
          from: process.env.SENDGRID_SENDER,
          templateId: process.env.SEND_GRID_EXPIRATION_TEMPLATE_ID,
          dynamicTemplateData: data,
        };
        const transport = await SendGrid.send(payload);

        return transport;
      } catch (e) {
        console.error(e.response.body);
      }
    }
  }

  async sendExpiredEmail(to: string, data: Record<string, any>) {
    if (process.env.ENABLE_EMAIL === 'true') {
      try {
        const payload: any = {
          to,
          from: process.env.SENDGRID_SENDER,
          templateId: process.env.SEND_GRID_EXPIRED_TEMPLATE_ID,
          dynamicTemplateData: data,
        };
        const transport = await SendGrid.send(payload);

        return transport;
      } catch (e) {
        console.error(e.response.body);
      }
    }
  }
}
