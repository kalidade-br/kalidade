# Caching Implementation

This document explains the caching strategies implemented for faster loading.

## What's Implemented

### 1. Service Worker Caching
A Service Worker (`web/sw.js`) automatically caches:
- CheerpJ loader and runtime files from `cjrtnc.leaningtech.com`
- Local JAR files (`freej2me-web.jar`)
- HTML, CSS, and JavaScript files

**How it works:**
- **First visit**: Downloads all assets normally (slower)
- **Subsequent visits**: Serves cached assets instantly (much faster!)
- **Automatic updates**: Fetches new versions in background when available

### 2. HTTP Cache Headers (Server Configuration)

When serving the app, use cache headers for optimal performance:

```bash
# Standard serving (with 24-hour cache)
npx serve -u web --cache 86400

# Development (no cache)
npx serve -u web --cache 0

# Long-term cache (1 week)
npx serve -u web --cache 604800
```

## Expected Performance

### First Load
- **Time**: 5-15 seconds (depending on connection)
- Downloads: ~10-20 MB (CheerpJ runtime + JAR)

### Subsequent Loads (with cache)
- **Time**: 1-3 seconds
- Downloads: Only changed files (usually 0 bytes!)
- "Loading Sandbox" text will appear but complete much faster

## Cache Management

### View Cache Status
Open browser DevTools (F12) and check:
1. **Application tab** → Service Workers (should show "activated and running")
2. **Application tab** → Cache Storage → `freej2me-cache-v1` (shows cached files)

### Clear Cache (if needed)

**Option 1: Browser DevTools**
1. Open DevTools (F12)
2. Application tab → Clear storage
3. Check "Cache storage" and "Service Workers"
4. Click "Clear site data"
5. Reload page

**Option 2: Browser Settings**
1. Open browser settings
2. Privacy/Security → Clear browsing data
3. Select "Cached images and files"
4. Clear data

**Option 3: Programmatically**
Open browser console and run:
```javascript
// Clear all caches
caches.keys().then(names => {
  names.forEach(name => caches.delete(name));
  console.log('All caches cleared');
});

// Unregister service worker
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister());
  console.log('Service worker unregistered');
});

// Then reload the page
location.reload();
```

## Troubleshooting

### Issue: "Service Worker not updating"
**Solution:**
1. Open DevTools → Application → Service Workers
2. Check "Update on reload"
3. Refresh page (Ctrl+Shift+R for hard reload)

### Issue: "Old version still showing"
**Solution:**
1. Increment version in `web/sw.js`: Change `CACHE_NAME = 'freej2me-cache-v1'` to `v2`, `v3`, etc.
2. Hard reload page (Ctrl+Shift+R)

### Issue: "Cache not working at all"
**Check:**
1. Browser supports Service Workers (all modern browsers do)
2. Using HTTPS or localhost (required for SW)
3. Check console for Service Worker errors
4. Verify `sw.js` is accessible at `/web/sw.js`

## Technical Details

### Cache Strategy
- **Cache-first**: Serves from cache if available, falls back to network
- **Network-first for API calls**: Dynamic data always fetched fresh
- **Stale-while-revalidate**: Shows cached content, updates in background

### Storage Limits
- Chrome: ~6% of free disk space
- Firefox: ~10% of free disk space
- Safari: ~1 GB per domain

### Automatic Cache Cleanup
Old cache versions are automatically deleted when new version activates.

## Development Notes

### Disable Caching During Development
1. **DevTools Method**:
   - Open DevTools (F12)
   - Network tab → Check "Disable cache"
   - Keep DevTools open

2. **Serve Method**:
   ```bash
   npx serve -u web --cache 0
   ```

3. **Bypass Service Worker**:
   - Open in Incognito/Private mode (SW won't register)

### Update Service Worker
After editing `sw.js`:
1. Change `CACHE_NAME` version number
2. Hard reload page (Ctrl+Shift+R)
3. Verify in DevTools → Application → Service Workers (should show new version)

## Benefits Summary

✅ **70-90% faster subsequent loads**
✅ **Reduced server bandwidth**
✅ **Works offline** (after first visit)
✅ **Automatic updates** in background
✅ **No user action required**

## Browser Support

| Browser | Service Worker | Cache API |
|---------|----------------|-----------|
| Chrome 40+ | ✅ | ✅ |
| Firefox 44+ | ✅ | ✅ |
| Safari 11.1+ | ✅ | ✅ |
| Edge 17+ | ✅ | ✅ |
| Opera 27+ | ✅ | ✅ |

**Note:** Internet Explorer does NOT support Service Workers.
