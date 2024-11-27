export const QueueName = 'MAIL';

export enum MessageType {
  SEND_VERIFYCATION_EMAIL = 'send-verification-email',
}

export interface ISendVerificationEmailData {
  email: string;
  expires: number;
  code: string;
}

export type MessageData = ISendVerificationEmailData;
