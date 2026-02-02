# Capacitor File Transfer: iOS 403 Response Resolves as Success

Minimal Ionic/Angular + Capacitor demo app that reproduces a bug in `@capacitor/file-transfer` on iOS where HTTP 403 responses resolve successfully instead of rejecting with an error.

## Summary

When downloading a file from a URL that returns HTTP 403 (Forbidden), the `FileTransfer.downloadFile()` Promise should reject with an error (e.g., `OS-PLUG-FLTR-0010`). However, on iOS the Promise **resolves successfully** and no error is logged. On Android, the Promise correctly rejects as expected.

## Expected vs Actual Behavior

| Platform | Expected Behavior | Actual Behavior |
|----------|-------------------|-----------------|
| **iOS** | Promise rejects with error | ❌ Promise resolves successfully |
| **Android** | Promise rejects with error | ✅ Promise rejects with error |

## Steps to Reproduce

### Prerequisites

```bash
npm install
```

### iOS (Primary)

1. Build and open the project in Xcode:
   ```bash
   npm run build:dev:ios:sync:open
   ```

2. Run the app from Xcode on a simulator or device.

3. Tap the **"Emulate error 'OS-PLUG-FLTR-0010'"** button.

4. Observe the Xcode console output:
   - **Expected:** Error log with `OS-PLUG-FLTR-0010` or similar
   - **Actual:** `File downloaded to: ...` (success message, no error)

### Android (Optional - for comparison)

1. Build and run on Android:
   ```bash
   npm run build:dev:android:sync:open
   ```

2. Tap the same button.

3. Observe the logs — the Promise correctly rejects with an error.


## Relevant Code Snippet

```typescript
import { Directory, Filesystem } from '@capacitor/filesystem';
import { FileTransfer } from '@nichecar/capacitor-file-transfer';

async downloadWith403() {
  try {
    const { uri } = await Filesystem.getUri({
      directory: Directory.Documents,
      path: `test-${Date.now()}.bin`,
    });

    const result = await FileTransfer.downloadFile({
      path: uri,
      url: 'https://httpbin.org/status/403',
    });

    console.log('File downloaded to:', result.path);
  } catch (err) {
    console.error('Error during file transfer:', err);
  }
}
```

## Notes / Troubleshooting

### Where to look for logs

- **Xcode Console:** Native logs from the Capacitor plugin appear here. Look for `File downloaded to:` or `Error during file transfer:`.
- **Safari Web Inspector:** For JavaScript/WebView logs, connect via Safari → Develop → [Device/Simulator] → [App].

### Alternative test endpoint

If `https://httpbin.org/status/403` is unavailable, you can use:
```
https://httpstat.us/403
```

Update the URL in the code accordingly.
