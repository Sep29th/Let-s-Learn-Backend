import { Message, MulticastMessage } from 'firebase-admin/messaging';

export enum Topic {
  Send = 'google_fcm_send',
  SendEach = 'google_fcm_send_each',
  SendEachForMulticast = 'google_fcm_send_each_for_multicast',
}

export interface IPatternSendPayload {
  data: Message;
}

export interface IPatternSendEachPayload {
  data: Message[];
}

export interface IPatternSendEachForMulticastPayload {
  data: MulticastMessage;
}
