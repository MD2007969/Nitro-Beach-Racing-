# GitHub build from Android phone
1. Create a private repository named Nitro-Beach-Racing, without adding a README.
2. Extract this ZIP and upload all files and folders to repository root, including hidden `.github` folder. GitHub web uploads can have limitations with folder upload on mobile; use desktop-site mode or a Git client if needed.
3. Open Actions > Build Android APK > Run workflow (or wait for push trigger).
4. When run completes successfully, open run > Artifacts > Nitro-Beach-Racing-debug-apk.
5. Download ZIP, extract APK and install on Android. The debug APK is for testing, not Play Store release.

NOTE: The game loads Babylon.js from a CDN, so internet is required. This package has not been verified by a successful GitHub Actions build or physical-device test.
