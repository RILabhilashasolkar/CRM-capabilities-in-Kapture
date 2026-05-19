# Kapture CRM Capability Prototype

> **CRM capabilities for Contact Centre Agents** — built on top of existing Kapture, without modifying any existing functionality.

## What's New (CRM Layer — Service Orders section)

| Feature | Description | PRD Story |
|---|---|---|
| **Search by Phone** | Customer profile, purchases, objects, service history by mobile number | Story 1 |
| **Service Order List** | List of service orders against phone number *(recently launched)* | Story 5 |
| **Create Service Request** | 4-step guided flow — Installation / Warranty / Out-of-Warranty / Support | Story 2, 3 |
| **Duplicate Prevention** | Reuses existing Customer Code and Object ID | Story 3 |
| **Track Service Order** | Multi-key search (SO ID, Ref ID, phone, serial, ticket ID) + timeline | Story 5 |
| **Raise Complaint** | Digital complaint against a service order | Story 7 |
| **Track Complaint** | Complaint lifecycle with status history | Story 8 |
| **Appointment Scheduling** | Slot selection from WFM-stub availability | Story 6 |
| **IRIS Symptom Selection** | Controlled symptom list for repair flows | Story 12 |

## Run

```bash
npm install
npm run dev
# open http://localhost:5173
```

## Navigation

- **Tickets** (existing) → ticket icon in icon rail
- **Service Orders** (new CRM) → 🔧 wrench icon in icon rail

### Demo data
| Flow | Input |
|---|---|
| Phone search | `9689808472`, `7791015502`, `8800123456` |
| Track SO | `SO-2026-0044`, `SO-2026-0071`, `SO-2026-0088` |
| Track Complaint | `COMP-2026-0031` |

## Branches

| Branch | Purpose |
|---|---|
| `main` | Stable prototype |
| `dev` | Active development |

## Tech
React 19 · Vite 8 · Tailwind CSS v4 · Lucide React · Dummy data (no backend)

*PRD v6 — Abhilash Asolkar / Prerna Tiwari — JioMart Digital*
