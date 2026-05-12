import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { EmailService } from 'src/email/email.service';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class NotificationService {

  constructor(private readonly emailService: EmailService) { }

  @OnEvent('user.register')
  async handleUserRegisterEvent(payload: any) {
    console.log('Received user.register event with payload:', payload);
    await this.emailService.sendEmail(
      payload.email,
      'Welcome to our service',
      `<p>Dear ${payload.username}, welcome to our service!</p>`,
    );
  }



  create(createNotificationDto: CreateNotificationDto) {
    return 'This action adds a new notification';
  }

  findAll() {
    return `This action returns all notification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
