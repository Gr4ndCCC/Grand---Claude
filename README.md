# Ora — Real-Time AI Voice Assistant

Ora is a real-time AI voice assistant with optional screen sharing.  Speak to it, it listens, thinks (via Claude), and speaks back (via ElevenLabs) — all streaming, end-to-end.

```
Browser mic → Deepgram STT → Claude LLM → ElevenLabs TTS → Browser speaker
                                   ↑
                    (optional) screen frame
```

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Backend | Node.js + Express + `ws` |
| STT | Deepgram Nova-2 (WebSocket streaming) |
| LLM | Anthropic Claude (streaming messages) |
| TTS | ElevenLabs Turbo v2 (WebSocket streaming input) |
| Audio | Web Audio API (`MediaRecorder` → mic, `AudioContext` → playback) |

## Repo structure

```
.
├── client/          Vite React app
│   └── src/
│       ├── App.tsx
│       ├── hooks/
│       │   ├── useOraSession.ts   WebSocket + mic + screen capture
│       │   └── useAudioPlayer.ts  Audio decode & playback
│       └── components/
│           ├── WaveformVisualizer.tsx
│           ├── TranscriptPanel.tsx
│           └── Controls.tsx
├── server/          Node.js Express + WebSocket
│   └── src/
│       ├── index.ts               HTTP server + WS upgrade
│       └── session.ts             Deepgram → Claude → ElevenLabs pipeline
├── .env.example
└── README.md
```

## Prerequisites

- Node.js 20+
- API keys for **Deepgram**, **Anthropic**, and **ElevenLabs**

## Setup

### 1. Clone & install

```bash
git clone <repo-url>
cd Grand---Claude

# Install server deps
cd server && npm install && cd ..

# Install client deps
cd client && npm install && cd ..
```

### 2. Configure environment

```bash
cp .env.example server/.env
# Edit server/.env and fill in all four API keys
```

Key variables:

| Variable | Where to get it |
|---|---|
| `DEEPGRAM_API_KEY` | [console.deepgram.com](https://console.deepgram.com) |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) |
| `ELEVENLABS_API_KEY` | [elevenlabs.io](https://elevenlabs.io) |
| `ELEVENLABS_VOICE_ID` | Your ElevenLabs voice library (e.g. `21m00Tcm4TlvDq8ikWAM` for Rachel) |

### 3. Run in development

Open two terminals:

```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev
```

Then open **http://localhost:5173** in your browser.

### 4. Production build

```bash
cd server && npm run build
cd client && npm run build
# Serve client/dist as static files behind the same Express server, or a CDN
```

## How it works

### Voice loop

1. Click **Start Session** → browser requests mic permission (and optional screen share).
2. `MediaRecorder` streams 100 ms audio chunks over WebSocket to the server.
3. Server pipes audio to **Deepgram**'s live transcription WebSocket.
4. On each final transcript, the server opens an **ElevenLabs** streaming TTS WebSocket, then begins streaming **Claude** text tokens.
5. Claude tokens are forwarded to ElevenLabs in real-time as they arrive.
6. ElevenLabs returns base64-encoded MP3 audio fragments; the server prefixes each with a `0x01` byte and forwards them as binary WebSocket frames to the browser.
7. The browser accumulates MP3 chunks and, on `response_end`, decodes and plays the full clip via `AudioContext.decodeAudioData`.

### Screen capture

Every 2 seconds a `<canvas>` draws a frame from the `getDisplayMedia` video track, encodes it as JPEG (quality 0.7, max 1280 px wide), and sends it to the server as a JSON `screen_frame` message.  The server holds the **latest** frame and bundles it with the next transcript sent to Claude (as a `image/jpeg` base64 content block).

### Interruption

An `requestAnimationFrame` loop monitors the microphone's RMS level via an `AnalyserNode`.  If the user's voice exceeds a threshold while Ora's audio is playing, the frontend:
1. Stops audio playback immediately.
2. Sends an `interrupt` message to the server.

The server aborts the current Claude stream and ElevenLabs WebSocket connection.

## WebSocket message protocol

### Client → Server

| Frame | Meaning |
|---|---|
| Binary blob | Raw mic audio (WebM/Opus) for Deepgram |
| `{ type: "start_session" }` | Open Deepgram connection |
| `{ type: "screen_frame", data: "<base64 JPEG>" }` | Latest screen frame |
| `{ type: "interrupt" }` | User spoke over Ora |
| `{ type: "end_session" }` | Clean shutdown |

### Server → Client

| Frame | Meaning |
|---|---|
| Binary: `0x01 + <MP3 bytes>` | TTS audio chunk |
| `{ type: "ready" }` | Deepgram connected; begin recording |
| `{ type: "transcript", text, is_final }` | STT result |
| `{ type: "response_start" }` | Claude is generating |
| `{ type: "response_text", text }` | Claude text token |
| `{ type: "response_end" }` | All TTS audio sent; play it |
| `{ type: "interrupt" }` | Server cancelled (echoed) |
| `{ type: "error", message }` | Something went wrong |

## Environment variable reference

```
DEEPGRAM_API_KEY      Required  Deepgram API key
ANTHROPIC_API_KEY     Required  Anthropic API key
ELEVENLABS_API_KEY    Required  ElevenLabs API key
ELEVENLABS_VOICE_ID   Required  ElevenLabs voice ID
CLAUDE_MODEL          Optional  Default: claude-sonnet-4-6
PORT                  Optional  Default: 3001
VITE_WS_URL           Optional  Client-side WS URL (default: ws://localhost:3001)
```

## Troubleshooting

| Symptom | Fix |
|---|---|
| "Speech recognition error" in console | Check `DEEPGRAM_API_KEY` |
| No audio playback | Browser requires a user gesture before `AudioContext` can resume; click Start Session first |
| Screen share frame not sent | Browser may block `getDisplayMedia` on non-HTTPS origins; run behind HTTPS in production |
| ElevenLabs 401 | Check `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID` |
| Very high latency | Try a different `CLAUDE_MODEL` or reduce `max_tokens` in `session.ts` |

## Extending Ora

- **Lower TTS latency**: Switch to streaming audio playback via the [MediaSource API](https://developer.mozilla.org/en-US/docs/Web/API/MediaSource) so audio starts before all chunks arrive.
- **LiveKit**: Replace raw WebSockets with LiveKit for multi-participant rooms, SFU audio routing, and better mobile support.
- **Tool use**: Add Claude tool calls (web search, code execution) and surface results in the transcript panel.
- **Persistent history**: Store conversation turns in a database and restore them on reconnect.
