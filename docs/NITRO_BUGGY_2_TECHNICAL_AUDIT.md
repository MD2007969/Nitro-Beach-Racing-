# Nitro Buggy 2 — Baseline technical audit (initial pass)
Date: 2026-10-17
Repository: MD2007969/Nitro-Beach-Racing-
Baseline: 27b5f1c80d23fc6f29773d261d799cd22b21b8bf
Recovery branch: checkpoint-before-next-prompt-2026-10-17
Development branch: development-nitro-buggy-2

## Confirmed architecture
- Engine: Babylon.js running inside Android WebView; NOT Unity/C#. JavaScript/HTML/CSS and Java Android wrapper; Gradle Android project.
- Primary assets inspected: android-studio/app/src/main/assets/main.js and index.html; AndroidManifest.xml, app/build.gradle, MainActivity.java and README.md.
- Android: compile/target SDK 35; minimum SDK 24; WebView file:///android_asset/index.html; JavaScript and DOM storage enabled.
- The HTML loads Babylon.js from https://cdn.babylonjs.com/babylon.js, so **the current game cannot be guaranteed to work fully offline on a fresh install**. Vendor a compatible pinned engine bundle locally before claiming offline support.
- README currently contains only repository title; detailed build, architecture and testing documentation are missing.

## Existing working features (previously confirmed by device testing)
- Arcade 3D track driving with braking, drifting, Nitro, power-ups, 3 AI rivals, racing HUD, minimap, countdown, results and pause.
- Quick race and four-stage career championships, coins, upgrades, persistent save state via localStorage.
- Four purchasable/selectable vehicles with distinctive lightweight cosmetic body kits, custom paint, rim finishes and spoiler options.
- Five procedurally shaped circuits/themes: Tropical Paradise, Neon City, Desert Rush, Mountain Fury, Coastal Highway.
- Synthesized audio effects; APK distribution via GitHub Actions has been used successfully by tester.
- Last known user-confirmed playable version is 4.2. No automated device test has been run in this audit.

## Gaps relative to requested specification
- No confirmed jump/suspension simulation, detailed collision physics, surface-specific traction, deterministic fixed timestep, vehicle class config, or animated wheel/suspension systems.
- No confirmed character roster/special abilities, projectile/shield combat, proper checkpoint enforcement, AI shortcut route graph, obstacle avoidance or destructible track props.
- Six new original requested environments do not yet exist; existing five are simpler prototypes.
- No confirmed time trial, challenge, dedicated combat race, player profile, or multiplayer backend/matchmaking.
- No confirmed asset pipeline for high-detail vehicle models, PBR/baked lighting, LOD, quality profiles or performance instrumentation.
- Core game logic remains largely in one ~47 KB main.js; refactoring should be incremental to avoid startup regressions.
- Android INTERNET permission is present; no backend observed in inspected files. Network security and online cheating become significant concerns when multiplayer is introduced.
- Original assets and branding must avoid copying proprietary maps, art, characters, sounds or code from reference games.

## Risk register and verification
- **Critical risk:** Babylon.js CDN dependency can prevent game initialization offline or with poor connectivity.
- **High risk:** Earlier geometry changes caused Android startup failure despite JavaScript syntax passing. A syntax check is NOT a runtime or APK test.
- **High risk:** Rendering more meshes on a low-end Android device can reduce FPS. Benchmark changes on actual hardware.
- **High risk:** WebView game loop currently uses frame delta (clamped to .04), not a proven fixed-timestep physics system.
- **Medium risk:** localStorage can be lost if app data is cleared; save versioning and migration need explicit testing.
- **Unknown:** full repository tree, all GitHub issues, build workflow configuration, current CI result, build logs, all assets and runtime exceptions were not exhaustively inspected in this initial pass.
- **Not verified:** fresh Gradle build, APK install, offline launch, sustained FPS/memory, Windows/iOS/Web compatibility, multiplayer.

## Proposed delivery gates
1. Baseline branch and documented regression checklist (this audit).
2. Offline reliability and automated build/static smoke checks; confirm on Android before gameplay modifications.
3. Extract data-driven vehicle definitions and preserve existing gameplay.
4. Add one feature at a time: handling/collision -> combat/characters -> original environments -> modes -> polish.
5. Only after stable offline gameplay, prototype secure server-backed multiplayer; do not claim it is complete without multi-client tests.
6. Keep checkpoint branch untouched. On user instruction "UNDO", restore active default branch files to checkpoint state without deleting Git history or user data.

## Immediate acceptance checklist
- App launches; garage/main menu responds.
- Quick race starts, finishes and returns to menu.
- Career race advances and persists.
- Four cars render and paint/rim/spoiler preferences persist after relaunch.
- All five existing maps remain selectable subject to unlock rules.
- Controls, Nitro, power-ups, pause, AI and results still work.
- APK install, offline launch and frame-rate measurements tested on actual Android device.

**Audit status: partial repository inspection completed; no claim of full build, performance, or exhaustive issue inspection.**
