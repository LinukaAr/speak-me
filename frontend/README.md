# 🎙 SilentStage — Give People Back Their Voice

**Cursor Colombo Buildathon 2026 · Audio & Voice AI Track by ElevenLabs**

---

## What Is This

SilentStage is a real-time voice restoration platform for people living with ALS, throat cancer, laryngectomy, or any condition causing progressive or sudden voice loss.

Built in 24 hours. Powered by ElevenLabs voice cloning.

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Then fill in your API keys in `.env`:
- `VITE_ELEVENLABS_API_KEY` — from https://elevenlabs.io/app/settings/api-keys
- `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` — from https://supabase.com

### 3. Start development server
```bash
npm run dev
```
Opens at http://localhost:5173

### 4. Build for production (Netlify)
```bash
npm run build
```

---

## Project Structure

```
src/
├── App.jsx              # Root component, routing, global context
├── main.jsx             # Entry point
├── index.css            # Global styles + design tokens
├── components/
│   ├── Layout.jsx       # Navigation wrapper
│   └── UI.jsx           # Reusable components (Btn, Card, Waveform, etc.)
├── pages/
│   ├── LoginPage.jsx    # Auth: email, Google, Apple SSO
│   ├── SpeakPage.jsx    # Main speaking interface + quick phrases
│   ├── PhrasesPage.jsx  # Full quick phrases management
│   ├── VoiceBankingPage.jsx  # Record sentences, clone voice
│   ├── ArchaeologyPage.jsx   # Voice Archaeology™ — recover from old audio
│   ├── FamilyPage.jsx   # Family access management + emergency settings
│   ├── SignLanguagePage.jsx  # Future plan mockup
│   ├── SettingsPage.jsx # Voice settings, language, privacy
│   └── OtherPages.jsx   # Family, Sign, Settings implementations
└── lib/
    ├── data.js          # All mock data (phrases, languages, family members)
    └── elevenlabs.js    # ElevenLabs API integration helpers
```

---

## ElevenLabs API Used

| Endpoint | When | Purpose |
|---|---|---|
| `POST /v1/voices/add` | Voice Banking | Upload recordings → get Voice ID |
| `POST /v1/text-to-speech/{voice_id}` | Every speak action | Synthesise text in cloned voice |
| `POST /v1/audio-isolation` | Voice Archaeology | Remove background noise from old recordings |

**Model:** `eleven_turbo_v2` — fastest, optimised for <1s latency

---

## Supabase Schema

Run these SQL statements in your Supabase SQL editor:

```sql
-- User profiles
create table profiles (
  id uuid references auth.users primary key,
  display_name text,
  elevenlabs_voice_id text,
  preferred_language text default 'en',
  created_at timestamptz default now()
);

-- Family access
create table family_access (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id),
  member_email text,
  role text check (role in ('carer','family','emergency','viewer')),
  accepted_at timestamptz,
  created_at timestamptz default now()
);

-- Quick phrases
create table quick_phrases (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id),
  phrase_text text,
  category text,
  use_count int default 0,
  created_at timestamptz default now()
);

-- Speech history
create table speech_history (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id),
  text_spoken text,
  voice_id text,
  spoken_at timestamptz default now()
);

-- Audio sources (Voice Archaeology)
create table audio_sources (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id),
  source_type text,
  file_url text,
  duration_sec int,
  quality_score int,
  status text default 'pending',
  created_at timestamptz default now()
);

-- Emergency contacts
create table emergency_contacts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id),
  contact_name text,
  contact_phone text,
  contact_email text,
  alert_on_inactivity bool default true,
  created_at timestamptz default now()
);
```

---

## Demo Mode

The app runs in **demo mode** without a real ElevenLabs API key — it uses the browser's built-in `SpeechSynthesis` as a fallback. Set `VITE_ELEVENLABS_API_KEY` to enable real voice cloning.

---

## Future Plans (Post-Hackathon)

- **Android & iOS native apps** — biometric login, offline phrases, smartwatch integration
- **Sign Language input** — MediaPipe Holistic + LSTM classifier (pending dataset)
- **Multilingual output** — Sinhala, Tamil, Hindi + 70 more ElevenLabs languages
- **Clinical partnerships** — hospice integration, hospital AAC programmes

---

## Tech Stack

- React 18 + Vite 5
- React Router v6
- ElevenLabs API (voice cloning + TTS)
- Supabase (auth + database)
- Netlify (deployment)

---

## Team

Built at **Cursor Colombo Buildathon 2026**  
Organised by TechTalk360 · Royal Mass Arena · 16–17 May 2026
