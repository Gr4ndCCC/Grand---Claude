export type SessionStatus =
  | 'idle'
  | 'connecting'
  | 'listening'
  | 'responding'
  | 'error';

export interface TranscriptEntry {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  final: boolean;
}

export interface ServerMessage {
  type: string;
  text?: string;
  is_final?: boolean;
  message?: string;
}
