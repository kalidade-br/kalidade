# Deployment Guide

This guide covers deploying freej2me-web to various hosting platforms.

## Cloudflare Pages (Recommended) ⭐

### Why Cloudflare Pages?
- ✅ **HTTP Range header support** (required for CheerpJ)
- ✅ **Free unlimited bandwidth** on free tier
- ✅ **Global CDN** with 300+ edge locations
- ✅ **Automatic HTTPS** (required for Service Worker)
- ✅ **Automatic deployments** from Git
- ✅ **Zero configuration** needed

### Deployment Steps

#### Method 1: Git-based Deploy (Recommended)

**1. Push to Git repository:**
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Push to GitHub/GitLab/Bitbucket
git remote add origin <your-repo-url>
git push -u origin main
```

**2. Connect to Cloudflare Pages:**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** → **Create a project**
3. Click **Connect to Git**
4. Select your repository
5. Configure build settings:
   - **Project name**: `freej2me-web` (or your choice)
   - **Production branch**: `main`
   - **Framework preset**: None
   - **Build command**: (leave empty)
   - **Build output directory**: `web`
6. Click **Save and Deploy**

**3. Wait for deployment:**
- First deployment takes ~2 minutes
- You'll get a URL like: `https://freej2me-web.pages.dev`

**4. Test your deployment:**
- Visit the URL
- Upload a JAR file
- Verify CheerpJ loads correctly
- Check browser console for Service Worker registration

#### Method 2: Direct Upload

**1. Prepare files:**
```bash
cd web
zip -r ../freej2me-web.zip .
```

**2. Upload to Cloudflare Pages:**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** → **Upload assets**
3. Drag and drop the `web` folder (or zip file)
4. Click **Deploy**

**3. Done!**
- You'll get a URL like: `https://abc123.pages.dev`

### Custom Domain (Optional)

**Add your own domain:**
1. Cloudflare Pages → Your project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `j2me.yourdomain.com`)
4. Follow DNS instructions
5. Wait for SSL certificate (~10 minutes)

---

## GitHub Pages

### ⚠️ Not Recommended
GitHub Pages **does NOT support** HTTP Range headers properly, which CheerpJ requires.

**Alternative:** Use Cloudflare Pages with GitHub repository instead.

---

## Netlify

### ⚠️ Limited Support
Netlify supports Range headers, but has bandwidth limits on free tier.

**Deployment:**
1. Connect Git repository
2. Build settings:
   - **Base directory**: (leave empty)
   - **Build command**: (leave empty)
   - **Publish directory**: `web`
3. Deploy

**Configuration** (`netlify.toml`):
```toml
[build]
  publish = "web"

[[headers]]
  for = "/*"
  [headers.values]
    Accept-Ranges = "bytes"

[[headers]]
  for = "/*.jar"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    Accept-Ranges = "bytes"

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

---

## Vercel

### ⚠️ Limited Support
Similar to Netlify - supports Range headers but has bandwidth limits.

**Deployment:**
```bash
npx vercel --prod
```

**Configuration** (`vercel.json`):
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Accept-Ranges",
          "value": "bytes"
        }
      ]
    },
    {
      "source": "/(.*).jar",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## Self-Hosted (VPS/Dedicated Server)

### Requirements
- Web server with Range header support (nginx, Apache, Caddy)
- HTTPS certificate (for Service Worker)

### Nginx Configuration

**1. Install nginx:**
```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx
```

**2. Configure site** (`/etc/nginx/sites-available/freej2me`):
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    # SSL certificates (managed by certbot)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    root /var/www/freej2me-web/web;
    index index.html;

    # Enable Range requests
    add_header Accept-Ranges bytes;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Cache JAR files for 1 year
    location ~* \.jar$ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header Accept-Ranges bytes;
    }

    # Cache JS/CSS for 1 week
    location ~* \.(js|css)$ {
        add_header Cache-Control "public, max-age=604800";
    }

    # Don't cache HTML
    location ~* \.html$ {
        add_header Cache-Control "public, max-age=3600";
    }

    # Service Worker always fresh
    location = /sw.js {
        add_header Cache-Control "public, max-age=0, must-revalidate";
    }

    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;
    add_header Referrer-Policy strict-origin-when-cross-origin;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

**3. Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/freej2me /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**4. Get SSL certificate:**
```bash
sudo certbot --nginx -d yourdomain.com
```

**5. Deploy files:**
```bash
sudo mkdir -p /var/www/freej2me-web
sudo cp -r web/* /var/www/freej2me-web/web/
sudo chown -R www-data:www-data /var/www/freej2me-web
```

### Apache Configuration

**Enable required modules:**
```bash
sudo a2enmod headers
sudo a2enmod rewrite
sudo a2enmod ssl
```

**Site configuration** (`/etc/apache2/sites-available/freej2me.conf`):
```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    Redirect permanent / https://yourdomain.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName yourdomain.com

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/yourdomain.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/yourdomain.com/privkey.pem

    DocumentRoot /var/www/freej2me-web/web

    # Enable Range requests
    Header set Accept-Ranges bytes

    # Cache JAR files
    <FilesMatch "\\.jar$">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>

    # Cache JS/CSS
    <FilesMatch "\\.(js|css)$">
        Header set Cache-Control "public, max-age=604800"
    </FilesMatch>

    # Don't cache Service Worker
    <Files "sw.js">
        Header set Cache-Control "public, max-age=0, must-revalidate"
    </Files>

    # Security headers
    Header set X-Content-Type-Options nosniff
    Header set X-Frame-Options SAMEORIGIN
</VirtualHost>
```

---

## Testing Deployment

### 1. Verify Range Header Support

**Browser DevTools:**
1. Open DevTools (F12) → Network tab
2. Load a JAR file
3. Check Response Headers for: `Accept-Ranges: bytes`
4. Check Request Headers for: `Range: bytes=0-1023` (or similar)

**Command line:**
```bash
curl -I https://your-deployment-url/web/freej2me-web.jar
# Should show: Accept-Ranges: bytes
```

### 2. Verify Service Worker

**Browser DevTools:**
1. Open DevTools (F12) → Application tab
2. Service Workers → Should show "activated and running"
3. Cache Storage → Should show `freej2me-cache-v1`

**Console:**
```javascript
navigator.serviceWorker.getRegistrations().then(r => console.log(r));
// Should show registration
```

### 3. Verify HTTPS

Service Worker requires HTTPS (or localhost). Verify:
```bash
# Should show valid SSL certificate
openssl s_client -connect your-deployment-url:443
```

### 4. Test CheerpJ Loading

1. Open your deployment URL
2. Watch browser console for:
   - `[App] Service Worker registered`
   - `Loading Sandbox` → should complete in ~2-3 seconds on reload
3. Upload a JAR file
4. Verify game runs correctly

---

## Performance Optimization

### 1. Enable Compression
Most platforms enable gzip/brotli automatically. Verify:
```bash
curl -I -H "Accept-Encoding: gzip" https://your-url/web/freej2me-web.jar
# Should show: Content-Encoding: gzip
```

### 2. Use HTTP/2
Cloudflare Pages enables HTTP/2 by default. For self-hosted, ensure:
```nginx
listen 443 ssl http2;  # nginx
```

### 3. Optimize Cache Headers
Already configured in `web/_headers` for Cloudflare Pages.

---

## Troubleshooting

### Issue: "CheerpJ cannot run - Range header not supported"

**Common on Cloudflare Pages after first deploy.**

**Solutions:**

1. **Verify `_headers` file exists:**
   ```bash
   ls web/_headers
   # Should show the file
   ```

2. **Redeploy the project:**
   - Go to Cloudflare Dashboard → Pages → Your Project
   - Click **Deployments** tab
   - Click **Retry deployment** on latest deployment
   - OR trigger new deployment:
     ```bash
     git commit --allow-empty -m "Trigger redeploy"
     git push
     ```

3. **Clear Cloudflare cache:**
   - Go to Cloudflare Dashboard → Pages → Your Project
   - Click **Custom domains** tab
   - Click **Purge cache**

4. **Verify headers are working:**
   ```bash
   # Test your JAR file URL
   curl -I https://your-site.pages.dev/freej2me-web.jar
   # Must show: Accept-Ranges: bytes
   ```

5. **Hard refresh browser:**
   - Chrome/Edge: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Firefox: `Ctrl+F5`
   - Or clear browser cache completely

6. **Check file structure:**
   ```
   project-root/
   ├── functions/              ← Cloudflare Pages Functions
   │   └── _middleware.js      ← Range request handler (CRITICAL!)
   ├── web/                    ← Build output directory
   │   ├── _headers           ← Headers configuration
   │   ├── index.html
   │   ├── run.html
   │   ├── freej2me-web.jar   ← File to test
   │   └── ...
   └── ...
   ```

   **IMPORTANT:** The `functions/_middleware.js` file is CRITICAL for proper Range support!

**Why this happens:**
- Cloudflare Pages doesn't return HTTP 206 for Range requests by default
- CheerpJ requires proper HTTP 206 (Partial Content) responses
- The `functions/_middleware.js` handles this automatically

**The Solution:**
The project includes a Cloudflare Pages Function (`functions/_middleware.js`) that intercepts Range requests and returns proper HTTP 206 responses. This file MUST be deployed with your project.

**After fixing:**
- Commit and push both `web/_headers` and `functions/_middleware.js`
- Wait 1-2 minutes for CDN propagation
- Test with `curl -I -H "Range: bytes=0-1023"` command
- Should return HTTP/2 206 (not HTTP/2 200)
- Hard refresh browser

### Issue: Service Worker not registering
**Check:**
1. HTTPS enabled (required for SW)
2. `sw.js` accessible at correct path
3. No console errors

### Issue: Slow loading even after caching
**Check:**
1. Service Worker activated (DevTools → Application)
2. Cache populated (DevTools → Cache Storage)
3. Network tab shows "from ServiceWorker"

---

## Recommended Platform Comparison

| Platform | Range Support | Free Bandwidth | SSL | Build Time | Recommendation |
|----------|---------------|----------------|-----|------------|----------------|
| **Cloudflare Pages** | ✅ | Unlimited | ✅ | ~2 min | ⭐ **Best** |
| **Netlify** | ✅ | 100GB/month | ✅ | ~1 min | ✅ Good |
| **Vercel** | ✅ | 100GB/month | ✅ | ~1 min | ✅ Good |
| **GitHub Pages** | ❌ | Unlimited | ✅ | ~5 min | ❌ Not compatible |
| **Self-hosted** | ✅ | Unlimited | ✅ (manual) | Instant | ✅ Advanced users |

**Winner:** Cloudflare Pages 🏆
- Best performance (global CDN)
- Unlimited bandwidth (free)
- Zero configuration
- Automatic deployments
