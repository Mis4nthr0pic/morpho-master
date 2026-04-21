
# 🧠 Morpho Training Tool

A focused, AI-powered training environment designed to master DeFi concepts and prepare for technical and integration roles, built with a strong emphasis on speed, retention, and real-world protocol understanding.

---

## Overview

This tool was built as a personal system to deeply learn and internalize how Morpho works, from Morpho Blue mechanics to Vault V2 architecture, incentives, and partner integrations.

Instead of passive reading, it enforces active recall, repetition, and applied thinking.

---

## Goals

- Reach 100% mastery on complex DeFi topics
- Simulate real partner, BD, and integration conversations
- Build intuition for:
  - lending markets
  - interest rate models
  - vault allocation strategies
  - incentive layers such as Merkl
- Train under time pressure, like real interviews or partner calls

---

## Features

### AI-Powered Quiz Engine

- Dynamic question generation using LLMs through OpenRouter
- Covers:
  - Morpho Blue markets
  - Vault V2 architecture
  - IRM behavior
  - risk models and liquidation flows
- Adapts difficulty based on performance

### Quick Learning Mode

- Time-boxed training sessions
- Goal: reach 100% correctness
- Streak-based progression system
- Forces rapid iteration:
  - wrong answers lead to immediate retry
  - no passive skipping

### Topic-Based Training

Structured modules for:

- Morpho Blue
- Vault V2
- incentives and APR composition
- protocol comparisons such as Aave, Pendle, and Notional

### SQLite Logging

Tracks:

- questions answered
- error patterns
- mastery progression

Enables:

- reviewing weak areas
- iterating on prompts
- improving training loops

### Dark Mode UI

- Built for long sessions
- Minimal and distraction-free
- Fast interaction loop

---

## Tech Stack

- **Frontend:** Next.js / React
- **AI:** OpenRouter
- **Storage:** SQLite
- **Design:** custom dark-first UI

---

## Example Training Flow

1. Select a topic such as `Morpho Vault V2`
2. Enter Quick Learning Mode
3. The AI generates questions like:
   - What are the five immutable parameters in a Morpho Blue market?
   - How does Relative Cap affect vault allocation?
4. Answer under time pressure
5. Get immediate feedback and retry
6. Repeat until perfect mastery

---

## Why This Exists

Reading docs is not enough.

Understanding a protocol like Morpho requires repetition, simulation, pressure, and application.

This tool compresses all of that into a tight feedback loop.

---

## Use Cases

- Preparing for:
  - technical interviews
  - DevRel roles
  - solutions engineering roles
  - BD and integration calls
- Learning complex DeFi systems faster
- Building protocol intuition beyond surface-level docs

---

## Future Improvements

- Real-time mock partner call mode
- GraphQL query builder training
- On-chain scenario simulations
- Multi-protocol expansion
- Shared training sets and community mode

---

## Contributing

This started as a personal tool, but contributions are welcome.

Ideas, improvements, and new training modules are encouraged.

---

## License

MIT
```
