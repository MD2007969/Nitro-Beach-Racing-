# NITRO BUGGY 2 — DEVELOPMENT ROADMAP

**Source:** existing Babylon.js / Android WebView prototype. **Protected recovery:** `checkpoint-before-next-prompt-2026-10-17` at `27b5f1c`. All work on `nitro-buggy-2-development-v2`; main branch remains unchanged until verified and explicitly approved.

| ID | Phase / feature | Depends on | Priority | Acceptance criteria | Implementation | Verification |
|---|---|---|---|---|---|---|
| P01 | Baseline stabilization | None | P0 | Reproducible debug APK, emulator startup without JS errors, log artifact | CI build configured | Not verified |
| P02 | Arcade physics and controls | P01 | P0 | Acceleration/braking/steering stable at 30/60 FPS; handling tests | Partial baseline | Not verified |
| P03 | Camera, drift, jump, collisions | P02 | P0 | Predictable jump/landing, no camera clipping or physics explosions | Partial baseline | Not verified |
| P04 | Race checkpoints and laps | P03 | P0 | No skipped laps, clean race restart, valid finish order | Partial baseline | Not verified |
| P05 | AI racing | P04 | P1 | AI finishes all maps and recovers from obstacles | Partial baseline | Not verified |
| P06 | Combat and defenses | P05 | P1 | Collect/activate/cooldown/counterplay tested | Partial baseline | Not verified |
| P07 | Driver abilities | P06 | P1 | Unique balanced abilities and cooldowns | Not started | Not verified |
| P08 | Vehicles and garage | P02 | P1 | Six classes, selections, upgrades and saves persist | Partial baseline | Not verified |
| P09 | Career/championship | P04,P08 | P1 | Rewards, unlocks and progression persist | Partial baseline | Not verified |
| P10 | Six original maps | P04,P05 | P1 | Original layouts, checkpoints, AI routes, shortcuts and collision | 5 prototype tracks | Not verified |
| P11 | Online multiplayer | P04,P06,P09 | P2 | 2–8 connected racers, authoritative results, latency tests | Not started | Not verified |
| P12 | UI, sound, graphics | P01,P02 | P2 | Functional accessible UI, scalable effects, licensed assets | Partial baseline | Not verified |
| P13 | Android optimization | P10,P12 | P1 | Measured ≥30 FPS on defined minimum device; stable memory | Not started | Not measured |
| P14 | Release QA | P01–P13 | P0 | Full device regression, no known release-blockers, signed APK | Not started | Not verified |

## Execution queue
1. **P01-01:** Check CI build and Node smoke-test result.
2. **P01-02:** Add emulator launch and Android log collection; verify startup.
3. **P01-03:** Bundle version-pinned Babylon.js with license and verify offline launch.
4. **P01-04:** Validate original quick race, garage, career and save/load.
5. **P02-01:** Introduce deterministic simulation step and unit-tested vehicle configurations.

## Definition of done
Do not mark a phase complete based on code review alone. Record build, emulator/device, gameplay and performance evidence; mark unavailable tests explicitly.
