import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  async sendOrderConfirmation(email: string, orderId: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Order Confirmation',
      text: `Your order ${orderId} has been successfully placed.`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Confirmation email sent to ${email} for order ${orderId}`);
    } catch (error) {
      this.logger.error(`Failed to send confirmation email to ${email}`, error.stack);
    }
  }
}
