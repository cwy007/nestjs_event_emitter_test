import { Injectable } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';

@Injectable()
export class EmailService {

  transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      host: 'smtp.qq.com',
      port: 587,
      secure: false,
      auth: {
        user: '1561931060@qq.com',
        pass: 'cnwobnqyvsrbgjfa',
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    const mailOptions = {
      from: {
        name: '系统邮件',
        address: '1561931060@qq.com',
      },
      to,
      subject,
      html,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
