export type SessionStatus =
  | 'idle'
  | 'connecting'
  | 'listening'
  | 'responding'
  | 'error';

export type OraError =
  | { kind: 'ws_connect'; msg: string }
  | { kind: 'mic'; msg: string }
  | { kind: 'server'; msg: string }
  | { kind: 'unknown'; msg: string };

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
