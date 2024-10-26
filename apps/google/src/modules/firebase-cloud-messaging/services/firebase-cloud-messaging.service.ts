import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { app, credential, initializeApp } from 'firebase-admin';
import { Message, MulticastMessage } from 'firebase-admin/messaging';

@Injectable()
export class FirebaseCloudMessagingService {
  private firebaseApp: app.App;

  constructor(private readonly configService: ConfigService) {
    this.firebaseApp = initializeApp({
      credential: credential.cert({
        clientEmail: this.configService.get<string>('FCM_CLIENT_EMAIL'),
        privateKey: this.configService.get<string>('FCM_PRIVATE_KEY'),
        projectId: this.configService.get<string>('FCM_PROJECT_ID'),
      }),
    });
  }

  /**
   * Gửi một thông báo đến một thiết bị hoặc một topic
   * @param message
   */
  async sendNotification(message: Message): Promise<void> {
    await this.firebaseApp.messaging().send(message);
  }

  /**
   * Gửi nhiều thông báo khác nhau cho nhiều thiết bị
   * @param messages - Một mảng không trống chứa tối đa 500 tin nhắn.
   */
  async sendEachNotification(messages: Message[]): Promise<void> {
    await this.firebaseApp.messaging().sendEach(messages);
  }

  /**
   * Gửi một thông báo duy nhất đến nhiều thiết bị
   * @param message - Một mảng không trống chứa tối đa 500 token.
   */
  async sendEachForMulticastNotification(message: MulticastMessage): Promise<void> {
    await this.firebaseApp.messaging().sendEachForMulticast(message);
  }
}
