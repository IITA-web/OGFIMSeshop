import { Injectable } from '@nestjs/common';
import paystack from 'paystack';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
  private paystackInstance: paystack.Object;

  constructor() {
    this.paystackInstance = paystack(process.env.PAYSTACK_SECRET_KEY);
  }

  async verifyPayment(reference: string) {
    return this.paystackInstance.transaction
      .verify(reference)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  verifyHookSender(eventData: any, signature: string): boolean {
    const hmac = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY);
    const expectedSignature = hmac
      .update(JSON.stringify(eventData))
      .digest('hex');

    return !!(expectedSignature === signature);
  }
}
