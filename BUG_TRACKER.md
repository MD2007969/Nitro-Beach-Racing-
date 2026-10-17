# NITRO BUGGY 2 — BUG TRACKER

| ID | Severity | System | Description | Root cause | Corrective action | Verification | Status |
|---|---|---|---|---|---|---|---|
| BUG-001 | Critical (historical) | Android startup | User observed stuck loading screen and `JavaScript error: Script error. at game:0` in experimental APK | **Unknown.** Generic WebView error does not provide a JS stack. Remote CDN is one plausible contributing factor, not proven. | Earlier experimental diagnostic changes were reverted on user UNDO; isolate emulator repro and capture logcat before patching. | Baseline not retested on physical device | Open / unconfirmed on baseline |
| BUG-002 | High risk | Offline loading | HTML loads Babylon.js from CDN, so cold offline launch may fail | Runtime dependency on network | Package a version-pinned licensed Babylon.js locally; test in offline emulator | Not executed | Open |
| BUG-003 | High risk | Racing | Prototype lap counting can potentially award laps without full course traversal | Single wrap-around proximity check | Add sequential track-sector gates after startup stabilization | Not executed | Open |
| BUG-004 | High risk | Physics | Frame-delta driving behavior may vary at different frame rates | No fixed simulation timestep | Introduce accumulator and deterministic physics updates with regression tests | Not executed | Open |

**Evidence rule:** Do not mark an error fixed until the failed test is reproduced, repaired and rerun successfully. Prior user screenshot is evidence of failure, not proof of root cause.
