
export enum Sender {
    USER = 'user',
    MODEL = 'model',
  }
  
  export interface TextPart {
    type: 'text';
    text: string;
  }
  
  export interface ImagePart {
    type: 'image';
    url: string; // data URL for display
  }
  
  export type MessagePart = TextPart | ImagePart;
  
  export interface Message {
    id: string;
    sender: Sender;
    parts: MessagePart[];
  }
  
  export interface ChatHistoryItem {
    id: string;
    title: string;
  }
