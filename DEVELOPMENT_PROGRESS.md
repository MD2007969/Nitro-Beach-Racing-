# NITRO BUGGY 2 — DEVELOPMENT PROGRESS
Updated: 2026-10-17

## Critical user report
User installed a recent APK and reports the game **did not run**. This is an **unresolved release blocker** until an APK successfully starts on Android. Root cause has not yet been confirmed by device logs.

## Changes committed to default playable-game branch
- `701f02b`: sequential lap checkpoints.
- `0967ba8`: source smoke-test script.
- `796d13a`: startup error panel for missing 3D engine or game script.
- `8e45d1b`: signal successful game initialization.
- `5def613`: log WebView JavaScript errors and console messages to Android logcat.
- `0851762`: Android build, emulator startup and log artifact workflow.

## Verification
- Source script parsed successfully using JavaScript syntax validation: PASS.
- Repository changes saved: PASS.
- Android build: NOT VERIFIED.
- Emulator launch: NOT VERIFIED.
- User phone: FAIL (reported game would not run; APK version and log unknown).
- Graphics/controls/racing: NOT VERIFIED.
- FPS: NOT MEASURED.

## Risks and investigation
1. Babylon.js is loaded from a remote CDN and may fail in Android WebView with no internet, network restrictions or other WebView errors. This is a **hypothesis**, not a proven root cause.
2. CI workflow may require Gradle/environment adjustments after first run.
3. The earlier 4.3 graphics update was rolled back to baseline 4.2; avoid unrelated rendering changes until startup passes.
4. Existing checkpoint changes need device regression validation.

## Next priority
1. Examine CI workflow logs and the actual startup error from the user's APK.
2. Fix confirmed root cause; bundle the Babylon.js engine locally for offline reliability.
3. Rebuild and test in emulator, then have user validate on physical Android.
4. Resume vehicle physics and race features only after launch stability.

## Recovery
Do not modify branch `checkpoint-before-next-prompt-2026-10-17`; it points to baseline commit `27b5f1c80d23fc6f29773d261d799cd22b21b8bf`. User's explicit **UNDO** instruction authorizes restoration of active game code to that snapshot without deleting git history or user save data.

## Screenshot diagnosis — 2026-10-17
User screenshot displays `JavaScript error: Script error. at game:0`. This is an opaque browser/WebView script error, not a useful JavaScript stack trace. Root cause remains unconfirmed. Commit `9222624` ignores only this opaque event while retaining logging and surfacing script-load or initialization failures. The code still requires Android build and device regression tests before declaring the startup defect resolved.
