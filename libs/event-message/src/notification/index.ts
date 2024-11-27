export enum Topic {
  Mail = 'notification_mail',
}

export enum MailType {
  VERIFYCATION_EMAIL = 'VERIFYCATION_EMAIL',
}

interface IPatternMailPayloadBase {
  targetEmail: string[] | string;
}

export interface IPatternMailVerificationEmailPayload extends IPatternMailPayloadBase {
  mailType: MailType.VERIFYCATION_EMAIL;
  targetEmail: string;
  data: { code: string; expires: number };
}

export type IPatternMailPayload = IPatternMailVerificationEmailPayload;
