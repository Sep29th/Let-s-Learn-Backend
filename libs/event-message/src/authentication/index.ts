export enum Topic {
  FailedSendVerificationEmail = 'authentication_failed_send_verification_email',
}

export interface IPatternFailedSendVerificationEmailPayload {
  data: { email: string };
}
