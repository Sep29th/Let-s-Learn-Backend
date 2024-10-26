import { Message, MulticastMessage } from 'firebase-admin/messaging';

export declare namespace GoogleEventMessage {
  enum Pattern {
    Send = 'google.fcm.send',
    SendEach = 'google.fcm.send-each',
    SendEachForMulticast = 'google.fcm.send-each-for-multicast',
  }

  interface IPatternSendPayload {
    data: Message;
  }

  interface IPatternSendEachPayload {
    data: Message[];
  }

  interface IPatternSendEachForMulticastPayload {
    data: MulticastMessage;
  }
}
