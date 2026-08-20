/**
 * ╔══════════════════════════════════════════════════════════════════════════════════════════╗
 * ║                          🚀 ELVIS-DEV.JS v4.0.0 - ULTIMATE EDITION 🚀                    ║
 * ║                                                                                          ║
 * ║  The Most Advanced Mobile Developer Tools Ever Created                                   ║
 * ║  Combines: DevTools + Eruda + Burp Suite + TamperMonkey + Custom Magic                  ║
 * ║                                                                                          ║
 * ║  Author: Elvis Dev Tools Team                                                            ║
 * ║  License: MIT                                                                            ║
 * ╚══════════════════════════════════════════════════════════════════════════════════════════╝
 */

(function() {
  'use strict';

  // Prevent multiple loads
  if (window.__ELVIS_DEV_LOADED__) {
    if (window.__elvisUI__) window.__elvisUI__.toggleMinimize();
    return;
  }
  window.__ELVIS_DEV_LOADED__ = true;

  // ╔════════════════════════════════════════════════════════════════════════════════════════╗
  // ║                                    CONFIGURATION                                       ║
  // ╚════════════════════════════════════════════════════════════════════════════════════════╝
  
  const STORAGE_KEY = 'elvis_dev_config';
  const SNIPPETS_KEY = 'elvis_dev_snippets';
  const HISTORY_KEY = 'elvis_dev_history';
  
  const DEFAULT_CONFIG = {
    theme: 'cyber',
    opacity: 0.98,
    fontSize: 12,
    position: { x: 10, y: 10 },
    size: { width: 380, height: 600 },
    interceptRequests: false,
    interceptResponses: false,
    corsBypass: false,
    logLimit: 500,
    autoCapture: true,
    soundEnabled: true,
    vibrationEnabled: true,
    compactMode: false,
  };

  const THEMES = {
    cyber: {
      name: 'Cyber Neon',
      primary: '#00ffd5',
      secondary: '#ff00ff',
      bg: '#0a0e14',
      bgDark: '#060a0f',
      bgLight: '#121820',
      text: '#e0f7fa',
      textMuted: '#6b8a94',
      accent: '#00bcd4',
      success: '#00e676',
      warning: '#ffab00',
      error: '#ff5252',
      border: '#1a3a4a',
      gradient: 'linear-gradient(135deg, #00ffd5 0%, #ff00ff 100%)',
    },
    matrix: {
      name: 'Matrix',
      primary: '#00ff00',
      secondary: '#00aa00',
      bg: '#000000',
      bgDark: '#000000',
      bgLight: '#0a1a0a',
      text: '#00ff00',
      textMuted: '#006600',
      accent: '#00dd00',
      success: '#00ff00',
      warning: '#aaff00',
      error: '#ff0000',
      border: '#003300',
      gradient: 'linear-gradient(135deg, #00ff00 0%, #00aa00 100%)',
    },
    midnight: {
      name: 'Midnight Blue',
      primary: '#60a5fa',
      secondary: '#a78bfa',
      bg: '#0f172a',
      bgDark: '#0a0f1a',
      bgLight: '#1e293b',
      text: '#f1f5f9',
      textMuted: '#64748b',
      accent: '#38bdf8',
      success: '#4ade80',
      warning: '#fbbf24',
      error: '#f87171',
      border: '#334155',
      gradient: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
    },
    sunset: {
      name: 'Sunset Fire',
      primary: '#f97316',
      secondary: '#ec4899',
      bg: '#1a0a0a',
      bgDark: '#0f0505',
      bgLight: '#2a1515',
      text: '#fef3c7',
      textMuted: '#92400e',
      accent: '#fbbf24',
      success: '#84cc16',
      warning: '#f59e0b',
      error: '#dc2626',
      border: '#7c2d12',
      gradient: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
    },
    hacker: {
      name: 'Hacker Mode',
      primary: '#39ff14',
      secondary: '#00ffff',
      bg: '#000000',
      bgDark: '#000000',
      bgLight: '#0a0a0a',
      text: '#39ff14',
      textMuted: '#1a5c0a',
      accent: '#00ffff',
      success: '#39ff14',
      warning: '#ffff00',
      error: '#ff073a',
      border: '#1a3a1a',
      gradient: 'linear-gradient(135deg, #39ff14 0%, #00ffff 100%)',
    },
    gold: {
      name: 'Gold Edition',
      primary: '#ffd700',
      secondary: '#ff8c00',
      bg: '#1a1a1a',
      bgDark: '#0f0f0f',
      bgLight: '#252525',
      text: '#f5f5f5',
      textMuted: '#888888',
      accent: '#daa520',
      success: '#32cd32',
      warning: '#ffa500',
      error: '#dc143c',
      border: '#8b7500',
      gradient: 'linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)',
    },
  };

  // ╔════════════════════════════════════════════════════════════════════════════════════════╗
  // ║                                   STORAGE MANAGER                                      ║
  // ╚════════════════════════════════════════════════════════════════════════════════════════╝

  const Storage = {
    get: (key, defaultValue = null) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (e) {
        return defaultValue;
      }
    },
    set: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        return false;
      }
    },
    remove: (key) => {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        return false;
      }
    },
  };

  // Load saved config
  let CONFIG = { ...DEFAULT_CONFIG, ...Storage.get(STORAGE_KEY, {}) };
  
  const saveConfig = () => Storage.set(STORAGE_KEY, CONFIG);

  // ╔════════════════════════════════════════════════════════════════════════════════════════╗
  // ║                                   HTTP PARSER                                          ║
  // ╚════════════════════════════════════════════════════════════════════════════════════════╝

  const HttpParser = {
    requestToRaw: (method, url, headers, body) => {
      let path = url;
      let host = '';
      try {
        const u = new URL(url);
        path = u.pathname + u.search;
        host = u.host;
      } catch(e) {}

      const headerMap = {...headers};
      if (!Object.keys(headerMap).find(k => k.toLowerCase() === 'host') && host) {
        headerMap['Host'] = host;
      }

      let raw = `${method} ${path} HTTP/1.1\n`;
      for(let key in headerMap) {
        raw += `${key}: ${headerMap[key]}\n`;
      }
      raw += `\n${body || ''}`;
      return raw;
    },

    responseToRaw: (status, statusText, headers, body) => {
      let raw = `HTTP/1.1 ${status} ${statusText || 'OK'}\n`;
      for(let key in headers) {
        raw += `${key}: ${headers[key]}\n`;
      }
      raw += `\n${body || ''}`;
      return raw;
    },

    parseRaw: (rawString) => {
      const normalized = rawString.replace(/\r\n/g, '\n');
      const parts = normalized.split('\n\n');
      const headerPart = parts[0];
      const bodyPart = parts.slice(1).join('\n\n');
      
      const lines = headerPart.split('\n');
      const firstLine = lines[0].trim().split(' ');
      
      const headers = {};
      for(let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if(!line) continue;
        const separator = line.indexOf(':');
        if(separator > -1) {
          const key = line.substring(0, separator).trim();
          const val = line.substring(separator + 1).trim();
          headers[key] = val;
        }
      }

      return { firstLine, headers, body: bodyPart };
    }
  };

  // ╔════════════════════════════════════════════════════════════════════════════════════════╗
  // ║                                INTERCEPTOR ENGINE                                      ║
  // ╚════════════════════════════════════════════════════════════════════════════════════════╝

  class InterceptorEngine {
    constructor() {
      this.originalFetch = window.fetch.bind(window);
      this.originalXhrOpen = XMLHttpRequest.prototype.open;
      this.originalXhrSend = XMLHttpRequest.prototype.send;
      this.originalXhrSetHeader = XMLHttpRequest.prototype.setRequestHeader;
      this.listeners = {};
      this.networkLogs = [];
      this.consoleLogs = [];
      this.resourceLogs = [];
      this.init();
    }

    init() {
      this.patchFetch();
      this.patchXhr();
      this.patchConsole();
      this.patchErrors();
      this.monitorResources();
    }

    on(event, cb) {
      if (!this.listeners[event]) this.listeners[event] = [];
      this.listeners[event].push(cb);
    }

    emit(event, data) {
      if (this.listeners[event]) {
        this.listeners[event].forEach(cb => cb(data));
      }
    }

    generateId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    addNetworkLog(data) {
      this.networkLogs.unshift({ ...data, timestamp: Date.now() });
      if (this.networkLogs.length > CONFIG.logLimit) this.networkLogs.pop();
      this.emit('network', data);
    }

    addConsoleLog(data) {
      this.consoleLogs.unshift({ ...data, timestamp: Date.now() });
      if (this.consoleLogs.length > CONFIG.logLimit) this.consoleLogs.pop();
      this.emit('console', data);
    }

    patchFetch() {
      const self = this;

      window.fetch = async function(input, init = {}) {
        const id = self.generateId();
        let url = typeof input === 'string' ? input : input.url;
        let method = init.method || 'GET';
        let headers = init.headers || {};
        
        if (headers instanceof Headers) {
          const h = {};
          headers.forEach((v, k) => h[k] = v);
          headers = h;
        }
        let body = init.body;

        // Request Interception
        if (CONFIG.interceptRequests) {
          try {
            let bodyStr = body;
            if (body && typeof body !== 'string') bodyStr = '[Binary/Stream]';
            const modified = await self.askUserForRequest({ id, url, method, headers, body: bodyStr });
            url = modified.url;
            method = modified.method;
            headers = modified.headers;
            body = modified.body;
          } catch (e) {
            self.addNetworkLog({ id, type: 'Blocked', method, url, status: 0, duration: 0, size: 0 });
            throw new Error('Request blocked by Elvis-Dev');
          }
        }

        // CORS Bypass
        let finalUrl = url;
        if (CONFIG.corsBypass && url.startsWith('http') && !url.includes('corsproxy.io')) {
          finalUrl = 'https://corsproxy.io/?' + encodeURIComponent(url);
        }

        const start = performance.now();
        let response;

        try {
          response = await self.originalFetch(finalUrl, { ...init, method, headers, body });
        } catch(err) {
          self.addNetworkLog({
            id, type: 'Fetch', method, url, status: 0,
            duration: Math.round(performance.now() - start),
            size: 0, error: err.message
          });
          throw err;
        }

        // Response Interception
        if (CONFIG.interceptResponses) {
          const clone = response.clone();
          let resBody = '';
          try { resBody = await clone.text(); } catch(e) { resBody = '[Binary]'; }
          
          const resHeaders = {};
          clone.headers.forEach((v, k) => resHeaders[k] = v);

          try {
            const modifiedRes = await self.askUserForResponse({
              id, url, status: response.status, statusText: response.statusText,
              headers: resHeaders, body: resBody
            });

            response = new Response(modifiedRes.body, {
              status: parseInt(modifiedRes.status),
              statusText: modifiedRes.statusText,
              headers: modifiedRes.headers
            });
          } catch(e) {
            throw new Error('Response blocked by Elvis-Dev');
          }
        }

        // Log result
        const logClone = response.clone();
        logClone.text().then(text => {
          const contentType = response.headers.get('content-type') || '';
          self.addNetworkLog({
            id, type: 'Fetch', method, url,
            status: response.status,
            statusText: response.statusText,
            duration: Math.round(performance.now() - start),
            size: text.length,
            contentType,
            requestHeaders: headers,
            responseHeaders: Object.fromEntries([...response.headers.entries()]),
            requestBody: typeof body === 'string' ? body : '[Binary]',
            responseBody: text.slice(0, 5000)
          });
        }).catch(() => {
          self.addNetworkLog({
            id, type: 'Fetch', method, url,
            status: response.status,
            duration: Math.round(performance.now() - start),
            size: 0, responseBody: '[Binary]'
          });
        });

        return response;
      };
    }

    patchXhr() {
      const self = this;
      
      XMLHttpRequest.prototype.open = function(method, url) {
        this._elvis = {
          id: self.generateId(),
          method,
          url,
          headers: {},
          start: performance.now()
        };
        return self.originalXhrOpen.apply(this, arguments);
      };

      XMLHttpRequest.prototype.setRequestHeader = function(name, value) {
        if (this._elvis) {
          this._elvis.headers[name] = value;
        }
        return self.originalXhrSetHeader.apply(this, arguments);
      };

      XMLHttpRequest.prototype.send = function(body) {
        const xhr = this;
        if (this._elvis) {
          this._elvis.requestBody = body;
        }

        this.addEventListener('loadend', () => {
          if (xhr._elvis) {
            const responseHeaders = {};
            const rawHeaders = xhr.getAllResponseHeaders();
            rawHeaders.split('\r\n').forEach(line => {
              const idx = line.indexOf(':');
              if (idx > -1) {
                responseHeaders[line.substring(0, idx).trim()] = line.substring(idx + 1).trim();
              }
            });

            self.addNetworkLog({
              id: xhr._elvis.id,
              type: 'XHR',
              method: xhr._elvis.method,
              url: xhr._elvis.url,
              status: xhr.status,
              statusText: xhr.statusText,
              duration: Math.round(performance.now() - xhr._elvis.start),
              size: xhr.response?.length || 0,
              contentType: xhr.getResponseHeader('content-type') || '',
              requestHeaders: xhr._elvis.headers,
              responseHeaders,
              requestBody: xhr._elvis.requestBody || '',
              responseBody: typeof xhr.response === 'string' ? xhr.response.slice(0, 5000) : '[Binary]'
            });
          }
        });

        return self.originalXhrSend.apply(this, arguments);
      };
    }

    patchConsole() {
      const self = this;
      const methods = ['log', 'info', 'warn', 'error', 'debug', 'table', 'trace', 'dir'];
      
      methods.forEach(method => {
        const original = console[method];
        console[method] = function(...args) {
          self.addConsoleLog({
            id: self.generateId(),
            type: method,
            args: args.map(arg => {
              try {
                if (typeof arg === 'object') {
                  return JSON.stringify(arg, null, 2);
                }
                return String(arg);
              } catch (e) {
                return '[Circular/Complex Object]';
              }
            }),
            stack: new Error().stack
          });
          return original.apply(console, args);
        };
      });

      // Capture console.clear
      const originalClear = console.clear;
      console.clear = function() {
        self.addConsoleLog({
          id: self.generateId(),
          type: 'clear',
          args: ['Console was cleared'],
          stack: ''
        });
        return originalClear.apply(console);
      };
    }

    patchErrors() {
      const self = this;

      window.addEventListener('error', (e) => {
        self.addConsoleLog({
          id: self.generateId(),
          type: 'error',
          args: [`${e.message} at ${e.filename}:${e.lineno}:${e.colno}`],
          stack: e.error?.stack || ''
        });
      });

      window.addEventListener('unhandledrejection', (e) => {
        self.addConsoleLog({
          id: self.generateId(),
          type: 'error',
          args: ['Unhandled Promise Rejection: ' + (e.reason?.message || String(e.reason))],
          stack: e.reason?.stack || ''
        });
      });
    }

    monitorResources() {
      const self = this;
      
      if (window.PerformanceObserver) {
        try {
          const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
              if (entry.entryType === 'resource') {
                self.resourceLogs.unshift({
                  id: self.generateId(),
                  name: entry.name,
                  type: entry.initiatorType,
                  duration: Math.round(entry.duration),
                  size: entry.transferSize || 0,
                  timestamp: Date.now()
                });
                if (self.resourceLogs.length > 200) self.resourceLogs.pop();
              }
            });
          });
          observer.observe({ entryTypes: ['resource'] });
        } catch (e) {}
      }
    }

    askUserForRequest(reqData) {
      return new Promise((resolve, reject) => {
        this.emit('intercept-req', { data: reqData, resolve, reject });
      });
    }

    askUserForResponse(resData) {
      return new Promise((resolve, reject) => {
        this.emit('intercept-res', { data: resData, resolve, reject });
      });
    }

    getPerformanceData() {
      const perf = performance.getEntriesByType('navigation')[0] || {};
      const memory = performance.memory || {};
      
      return {
        timing: {
          dns: Math.round(perf.domainLookupEnd - perf.domainLookupStart) || 0,
          tcp: Math.round(perf.connectEnd - perf.connectStart) || 0,
          ttfb: Math.round(perf.responseStart - perf.requestStart) || 0,
          download: Math.round(perf.responseEnd - perf.responseStart) || 0,
          domReady: Math.round(perf.domContentLoadedEventEnd - perf.fetchStart) || 0,
          load: Math.round(perf.loadEventEnd - perf.fetchStart) || 0,
        },
        memory: {
          used: Math.round((memory.usedJSHeapSize || 0) / 1048576),
          total: Math.round((memory.totalJSHeapSize || 0) / 1048576),
          limit: Math.round((memory.jsHeapSizeLimit || 0) / 1048576),
        }
      };
    }
  }

  // ╔════════════════════════════════════════════════════════════════════════════════════════╗
  // ║                              STORAGE INSPECTOR                                         ║
  // ╚════════════════════════════════════════════════════════════════════════════════════════╝

  const StorageInspector = {
    getLocalStorage: () => {
      const items = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        items.push({
          key,
          value,
          size: new Blob([value]).size
        });
      }
      return items;
    },

    getSessionStorage: () => {
      const items = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        const value = sessionStorage.getItem(key);
        items.push({
          key,
          value,
          size: new Blob([value]).size
        });
      }
      return items;
    },

    getCookies: () => {
      return document.cookie.split(';').filter(c => c.trim()).map(cookie => {
        const [key, ...valueParts] = cookie.split('=');
        return {
          key: key.trim(),
          value: valueParts.join('='),
          size: new Blob([cookie]).size
        };
      });
    },

    setLocalStorage: (key, value) => {
      localStorage.setItem(key, value);
    },

    setSessionStorage: (key, value) => {
      sessionStorage.setItem(key, value);
    },

    setCookie: (key, value, days = 7) => {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      document.cookie = `${key}=${value};expires=${date.toUTCString()};path=/`;
    },

    deleteLocalStorage: (key) => {
      localStorage.removeItem(key);
    },

    deleteSessionStorage: (key) => {
      sessionStorage.removeItem(key);
    },

    deleteCookie: (key) => {
      document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    },

    clearLocalStorage: () => {
      localStorage.clear();
    },

    clearSessionStorage: () => {
      sessionStorage.clear();
    },

    clearCookies: () => {
      document.cookie.split(';').forEach(cookie => {
        const key = cookie.split('=')[0].trim();
        document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });
    },

    async getIndexedDBDatabases() {
      try {
        if (indexedDB.databases) {
          return await indexedDB.databases();
        }
        return [];
      } catch (e) {
        return [];
      }
    }
  };

  // ╔════════════════════════════════════════════════════════════════════════════════════════╗
  // ║                              DEVICE INFO                                               ║
  // ╚════════════════════════════════════════════════════════════════════════════════════════╝

  const DeviceInfo = {
    get: () => {
      const ua = navigator.userAgent;
      const screen = window.screen;
      
      return {
        userAgent: ua,
        platform: navigator.platform,
        language: navigator.language,
        languages: navigator.languages?.join(', ') || navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        online: navigator.onLine,
        
        screen: {
          width: screen.width,
          height: screen.height,
          availWidth: screen.availWidth,
          availHeight: screen.availHeight,
          colorDepth: screen.colorDepth,
          pixelDepth: screen.pixelDepth,
          orientation: screen.orientation?.type || 'unknown',
        },
        
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
          devicePixelRatio: window.devicePixelRatio,
        },
        
        connection: navigator.connection ? {
          type: navigator.connection.effectiveType,
          downlink: navigator.connection.downlink,
          rtt: navigator.connection.rtt,
          saveData: navigator.connection.saveData,
        } : null,
        
        memory: navigator.deviceMemory ? {
          deviceMemory: navigator.deviceMemory + ' GB',
          hardwareConcurrency: navigator.hardwareConcurrency + ' cores',
        } : null,
        
        battery: null, // Will be populated async
        
        gpu: (() => {
          try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
              const ext = gl.getExtension('WEBGL_debug_renderer_info');
              if (ext) {
                return {
                  vendor: gl.getParameter(ext.UNMASKED_VENDOR_WEBGL),
                  renderer: gl.getParameter(ext.UNMASKED_RENDERER_WEBGL),
                };
              }
            }
            return null;
          } catch (e) {
            return null;
          }
        })(),

        permissions: [],
        
        location: {
          href: location.href,
          origin: location.origin,
          protocol: location.protocol,
          host: location.host,
          pathname: location.pathname,
          search: location.search,
          hash: location.hash,
        },
        
        referrer: document.referrer,
        title: document.title,
        characterSet: document.characterSet,
        contentType: document.contentType,
      };
    }
  };

  // ╔════════════════════════════════════════════════════════════════════════════════════════╗
  // ║                              SECURITY SCANNER                                          ║
  // ╚════════════════════════════════════════════════════════════════════════════════════════╝

  const SecurityScanner = {
    scan: () => {
      const issues = [];
      
      // Check for insecure protocol
      if (location.protocol === 'http:' && location.hostname !== 'localhost') {
        issues.push({
          severity: 'high',
          title: 'Insecure Protocol',
          description: 'Page is served over HTTP. Data may be intercepted.',
          recommendation: 'Use HTTPS for all pages.'
        });
      }

      // Check for missing security headers (simulated)
      const securityHeaders = [
        'Content-Security-Policy',
        'X-Frame-Options',
        'X-Content-Type-Options',
        'Strict-Transport-Security',
        'X-XSS-Protection'
      ];

      // Check for inline scripts
      const inlineScripts = document.querySelectorAll('script:not([src])');
      if (inlineScripts.length > 0) {
        issues.push({
          severity: 'medium',
          title: 'Inline Scripts Detected',
          description: `Found ${inlineScripts.length} inline script(s). May be vulnerable to XSS.`,
          recommendation: 'Move scripts to external files and implement CSP.'
        });
      }

      // Check for forms without HTTPS action
      const forms = document.querySelectorAll('form[action^="http:"]');
      if (forms.length > 0) {
        issues.push({
          severity: 'high',
          title: 'Insecure Form Action',
          description: `Found ${forms.length} form(s) submitting to HTTP URLs.`,
          recommendation: 'Change form actions to use HTTPS.'
        });
      }

      // Check for password fields without autocomplete=off
      const passwordFields = document.querySelectorAll('input[type="password"]:not([autocomplete="off"])');
      if (passwordFields.length > 0) {
        issues.push({
          severity: 'low',
          title: 'Password Autocomplete Enabled',
          description: `Found ${passwordFields.length} password field(s) with autocomplete.`,
          recommendation: 'Consider adding autocomplete="off" for sensitive fields.'
        });
      }

      // Check for localStorage with sensitive keywords
      const sensitiveKeys = ['token', 'password', 'secret', 'key', 'auth', 'session'];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i).toLowerCase();
        if (sensitiveKeys.some(s => key.includes(s))) {
          issues.push({
            severity: 'medium',
            title: 'Sensitive Data in localStorage',
            description: `Key "${localStorage.key(i)}" may contain sensitive data.`,
            recommendation: 'Avoid storing sensitive data in localStorage. Use secure cookies instead.'
          });
        }
      }

      // Check for external scripts
      const externalScripts = document.querySelectorAll('script[src^="http"]');
      if (externalScripts.length > 0) {
        issues.push({
          severity: 'info',
          title: 'External Scripts Loaded',
          description: `Loading ${externalScripts.length} external script(s).`,
          recommendation: 'Ensure all external scripts are from trusted sources and use SRI.'
        });
      }

      // Check for mixed content
      const mixedImages = document.querySelectorAll('img[src^="http:"]:not([src*="localhost"])');
      if (mixedImages.length > 0 && location.protocol === 'https:') {
        issues.push({
          severity: 'medium',
          title: 'Mixed Content Detected',
          description: `Found ${mixedImages.length} image(s) loaded over HTTP on HTTPS page.`,
          recommendation: 'Load all resources over HTTPS.'
        });
      }

      // Check for target="_blank" without rel="noopener"
      const unsafeLinks = document.querySelectorAll('a[target="_blank"]:not([rel*="noopener"])');
      if (unsafeLinks.length > 0) {
        issues.push({
          severity: 'low',
          title: 'Unsafe External Links',
          description: `Found ${unsafeLinks.length} link(s) with target="_blank" missing rel="noopener".`,
          recommendation: 'Add rel="noopener noreferrer" to external links.'
        });
      }

      return issues;
    }
  };

  // ╔════════════════════════════════════════════════════════════════════════════════════════╗
  // ║                              SNIPPETS MANAGER                                          ║
  // ╚════════════════════════════════════════════════════════════════════════════════════════╝

  const DEFAULT_SNIPPETS = [
    {
      id: 'get-cookies',
      name: 'Get All Cookies',
      code: 'console.table(document.cookie.split(";").map(c => {\n  const [k, v] = c.split("=");\n  return { key: k?.trim(), value: v };\n}));',
      category: 'cookies'
    },
    {
      id: 'get-localstorage',
      name: 'Get All LocalStorage',
      code: 'console.table(Object.entries(localStorage).map(([k, v]) => ({ key: k, value: v, size: v.length })));',
      category: 'storage'
    },
    {
      id: 'clear-console',
      name: 'Clear Console',
      code: 'console.clear();',
      category: 'utility'
    },
    {
      id: 'get-page-links',
      name: 'Get All Links',
      code: 'console.table([...document.querySelectorAll("a")].map(a => ({ text: a.textContent?.slice(0, 50), href: a.href })));',
      category: 'dom'
    },
    {
      id: 'get-images',
      name: 'Get All Images',
      code: 'console.table([...document.querySelectorAll("img")].map(img => ({ src: img.src, alt: img.alt, size: img.naturalWidth + "x" + img.naturalHeight })));',
      category: 'dom'
    },
    {
      id: 'get-forms',
      name: 'Get All Forms',
      code: 'console.table([...document.querySelectorAll("form")].map(f => ({ action: f.action, method: f.method, inputs: f.querySelectorAll("input").length })));',
      category: 'dom'
    },
    {
      id: 'measure-performance',
      name: 'Measure Performance',
      code: 'const t = performance.timing;\nconsole.table({\n  "DNS Lookup": t.domainLookupEnd - t.domainLookupStart + "ms",\n  "Connection": t.connectEnd - t.connectStart + "ms",\n  "TTFB": t.responseStart - t.requestStart + "ms",\n  "DOM Ready": t.domContentLoadedEventEnd - t.navigationStart + "ms",\n  "Load": t.loadEventEnd - t.navigationStart + "ms"\n});',
      category: 'performance'
    },
    {
      id: 'copy-text',
      name: 'Copy to Clipboard',
      code: 'navigator.clipboard.writeText("YOUR_TEXT_HERE").then(() => console.log("Copied!"));',
      category: 'utility'
    },
    {
      id: 'screenshot-element',
      name: 'Log Element Styles',
      code: 'const el = document.querySelector("YOUR_SELECTOR");\nif (el) console.log(getComputedStyle(el));',
      category: 'css'
    },
    {
      id: 'inject-jquery',
      name: 'Inject jQuery',
      code: 'if (!window.jQuery) {\n  const s = document.createElement("script");\n  s.src = "https://code.jquery.com/jquery-3.7.1.min.js";\n  s.onload = () => console.log("jQuery loaded:", jQuery.fn.jquery);\n  document.head.appendChild(s);\n} else console.log("jQuery already loaded:", jQuery.fn.jquery);',
      category: 'library'
    },
    {
      id: 'dark-mode',
      name: 'Toggle Dark Mode',
      code: 'document.body.style.filter = document.body.style.filter ? "" : "invert(1) hue-rotate(180deg)";',
      category: 'utility'
    },
    {
      id: 'disable-links',
      name: 'Disable All Links',
      code: 'document.querySelectorAll("a").forEach(a => a.onclick = e => e.preventDefault());\nconsole.log("All links disabled");',
      category: 'dom'
    },
    {
      id: 'show-passwords',
      name: 'Show Password Fields',
      code: 'document.querySelectorAll("input[type=password]").forEach(i => { i.type = "text"; i.style.border = "2px solid red"; });',
      category: 'security'
    },
    {
      id: 'get-meta-tags',
      name: 'Get Meta Tags',
      code: 'console.table([...document.querySelectorAll("meta")].map(m => ({\n  name: m.name || m.httpEquiv || m.property,\n  content: m.content\n})));',
      category: 'seo'
    },
    {
      id: 'highlight-headings',
      name: 'Highlight Headings',
      code: 'const colors = ["#ff0000", "#ff7700", "#ffff00", "#00ff00", "#0000ff", "#8800ff"];\n["h1","h2","h3","h4","h5","h6"].forEach((h, i) => {\n  document.querySelectorAll(h).forEach(el => {\n    el.style.outline = "3px solid " + colors[i];\n    el.style.outlineOffset = "2px";\n  });\n});',
      category: 'accessibility'
    }
  ];

  const SnippetsManager = {
    get: () => {
      const saved = Storage.get(SNIPPETS_KEY, []);
      return [...DEFAULT_SNIPPETS, ...saved];
    },
    
    add: (snippet) => {
      const saved = Storage.get(SNIPPETS_KEY, []);
      saved.push({ ...snippet, id: Date.now().toString() });
      Storage.set(SNIPPETS_KEY, saved);
    },
    
    update: (id, snippet) => {
      const saved = Storage.get(SNIPPETS_KEY, []);
      const index = saved.findIndex(s => s.id === id);
      if (index > -1) {
        saved[index] = { ...saved[index], ...snippet };
        Storage.set(SNIPPETS_KEY, saved);
      }
    },
    
    remove: (id) => {
      const saved = Storage.get(SNIPPETS_KEY, []);
      Storage.set(SNIPPETS_KEY, saved.filter(s => s.id !== id));
    },

    execute: (code) => {
      try {
        const result = (1, eval)(code);
        return { success: true, result };
      } catch (e) {
        return { success: false, error: e.message };
      }
    }
  };

  // ╔════════════════════════════════════════════════════════════════════════════════════════╗
  // ║                              DOM INSPECTOR                                             ║
  // ╚════════════════════════════════════════════════════════════════════════════════════════╝

  const DOMInspector = {
    selectedElement: null,
    highlightOverlay: null,

    init: () => {
      DOMInspector.highlightOverlay = document.createElement('div');
      DOMInspector.highlightOverlay.id = 'elvis-highlight-overlay';
      DOMInspector.highlightOverlay.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 999998;
        border: 2px solid #00ffd5;
        background: rgba(0, 255, 213, 0.1);
        display: none;
      `;
      document.body.appendChild(DOMInspector.highlightOverlay);
    },

    startInspecting: (onSelect) => {
      const overlay = DOMInspector.highlightOverlay;
      
      const handleMouseMove = (e) => {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        if (el && el.id !== 'elvis-dev-root' && !el.closest('#elvis-dev-root')) {
          const rect = el.getBoundingClientRect();
          overlay.style.display = 'block';
          overlay.style.top = rect.top + 'px';
          overlay.style.left = rect.left + 'px';
          overlay.style.width = rect.width + 'px';
          overlay.style.height = rect.height + 'px';
        }
      };

      const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const el = document.elementFromPoint(e.clientX, e.clientY);
        if (el && el.id !== 'elvis-dev-root' && !el.closest('#elvis-dev-root')) {
          DOMInspector.selectedElement = el;
          overlay.style.display = 'none';
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('click', handleClick, true);
          if (onSelect) onSelect(el);
        }
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('click', handleClick, true);
    },

    getElementInfo: (el) => {
      if (!el) return null;
      
      const rect = el.getBoundingClientRect();
      const styles = getComputedStyle(el);
      
      return {
        tagName: el.tagName.toLowerCase(),
        id: el.id,
        className: el.className,
        attributes: [...el.attributes].map(a => ({ name: a.name, value: a.value })),
        innerText: el.innerText?.slice(0, 200),
        innerHTML: el.innerHTML?.slice(0, 500),
        position: {
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        },
        styles: {
          display: styles.display,
          position: styles.position,
          color: styles.color,
          backgroundColor: styles.backgroundColor,
          fontSize: styles.fontSize,
          fontFamily: styles.fontFamily,
          margin: styles.margin,
          padding: styles.padding,
          border: styles.border,
          zIndex: styles.zIndex,
        },
        path: DOMInspector.getElementPath(el),
      };
    },

    getElementPath: (el) => {
      const path = [];
      while (el && el !== document.body && el !== document.documentElement) {
        let selector = el.tagName.toLowerCase();
        if (el.id) {
          selector += '#' + el.id;
        } else if (el.className && typeof el.className === 'string') {
          selector += '.' + el.className.split(' ').join('.');
        }
        path.unshift(selector);
        el = el.parentElement;
      }
      return path.join(' > ');
    },

    highlightElement: (el) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const overlay = DOMInspector.highlightOverlay;
      overlay.style.display = 'block';
      overlay.style.top = rect.top + 'px';
      overlay.style.left = rect.left + 'px';
      overlay.style.width = rect.width + 'px';
      overlay.style.height = rect.height + 'px';
    },

    hideHighlight: () => {
      if (DOMInspector.highlightOverlay) {
        DOMInspector.highlightOverlay.style.display = 'none';
      }
    }
  };

  // ╔════════════════════════════════════════════════════════════════════════════════════════╗
  // ║                              CSS EDITOR                                                ║
  // ╚════════════════════════════════════════════════════════════════════════════════════════╝

  const CSSEditor = {
    customStyleEl: null,

    init: () => {
      CSSEditor.customStyleEl = document.createElement('style');
      CSSEditor.customStyleEl.id = 'elvis-custom-styles';
      document.head.appendChild(CSSEditor.customStyleEl);
      
      // Load saved CSS
      const savedCSS = Storage.get('elvis_custom_css', '');
      if (savedCSS) {
        CSSEditor.customStyleEl.textContent = savedCSS;
      }
    },

    apply: (css) => {
      if (CSSEditor.customStyleEl) {
        CSSEditor.customStyleEl.textContent = css;
        Storage.set('elvis_custom_css', css);
      }
    },

    get: () => {
      return Storage.get('elvis_custom_css', '');
    },

    clear: () => {
      if (CSSEditor.customStyleEl) {
        CSSEditor.customStyleEl.textContent = '';
        Storage.remove('elvis_custom_css');
      }
    },

    getPageStyles: () => {
      const styles = [];
      for (const sheet of document.styleSheets) {
        try {
          styles.push({
            href: sheet.href || 'inline',
            rules: sheet.cssRules?.length || 0
          });
        } catch (e) {
          styles.push({
            href: sheet.href || 'inline',
            rules: 'Access denied (CORS)'
          });
        }
      }
      return styles;
    }
  };

  // ╔════════════════════════════════════════════════════════════════════════════════════════╗
  // ║                                   MAIN UI                                              ║
  // ╚════════════════════════════════════════════════════════════════════════════════════════╝

  class ElvisUI {
    constructor(engine) {
      this.engine = engine;
      this.container = null;
      this.activeTab = 'console';
      this.isMinimized = true;
      this.isMaximized = false;
      this.interceptQueue = [];
      this.currentIntercept = null;
      this.selectedNetworkLog = null;
      this.consoleFilter = 'all';
      this.consoleSearch = '';
      this.networkSearch = '';
      this.storageTab = 'local';
      this.jsHistory = Storage.get(HISTORY_KEY, []);
      this.currentJS = '';
      this.repeaterRequest = 'GET / HTTP/1.1\nHost: example.com\nAccept: */*\n\n';
      this.repeaterResponse = '';
      this.customCSS = CSSEditor.get();
      this.inspectorActive = false;
      this.inspectedElement = null;
      
      this.init();
    }

    init() {
      DOMInspector.init();
      CSSEditor.init();
      this.injectStyles();
      this.createDOM();
      this.bindEvents();
      this.setupDraggable();
      this.setupResize();
      
      this.engine.on('network', () => this.refreshNetwork());
      this.engine.on('console', () => this.refreshConsole());
      
      this.engine.on('intercept-req', (obj) => {
        this.interceptQueue.push({ type: 'req', ...obj });
        this.processQueue();
      });
      
      this.engine.on('intercept-res', (obj) => {
        this.interceptQueue.push({ type: 'res', ...obj });
        this.processQueue();
      });

      this.render();
    }

    processQueue() {
      if (this.currentIntercept) return;
      if (this.interceptQueue.length === 0) {
        if (this.activeTab === 'intercept') this.render();
        return;
      }

      this.currentIntercept = this.interceptQueue.shift();
      this.activeTab = 'intercept';
      this.isMinimized = false;
      this.render();
    }

    toggleMinimize() {
      this.isMinimized = !this.isMinimized;
      if (this.isMinimized) this.isMaximized = false;
      this.render();
    }

    toggleMaximize() {
      this.isMaximized = !this.isMaximized;
      this.render();
    }

    getTheme() {
      return THEMES[CONFIG.theme] || THEMES.cyber;
    }

    feedback(type = 'click') {
      if (CONFIG.vibrationEnabled && navigator.vibrate) {
        navigator.vibrate(type === 'click' ? 10 : 30);
      }
    }

    injectStyles() {
      const css = `
        #elvis-dev-root {
          position: fixed;
          background: var(--elvis-bg);
          color: var(--elvis-text);
          font-family: 'SF Mono', 'Fira Code', 'JetBrains Mono', 'Consolas', monospace;
          z-index: 999999;
          box-shadow: 0 25px 80px rgba(0,0,0,0.9), 0 0 40px var(--elvis-primary-30);
          border: 1px solid var(--elvis-border);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(20px);
        }

        #elvis-dev-root.minimized {
          width: 56px !important;
          height: 56px !important;
          min-width: unset !important;
          min-height: unset !important;
          border-radius: 50%;
          cursor: pointer;
          animation: elvis-pulse 2s infinite;
        }

        #elvis-dev-root.maximized {
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100% !important;
          height: 100% !important;
          border-radius: 0;
          border: none;
        }

        @keyframes elvis-pulse {
          0%, 100% { 
            box-shadow: 0 0 10px var(--elvis-primary-50), 0 0 30px var(--elvis-primary-30);
          }
          50% { 
            box-shadow: 0 0 20px var(--elvis-primary-70), 0 0 50px var(--elvis-primary-50);
          }
        }

        .elvis-header {
          background: var(--elvis-bgDark);
          padding: 8px 12px;
          border-bottom: 1px solid var(--elvis-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: move;
          user-select: none;
          flex-shrink: 0;
        }

        .elvis-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 13px;
          background: var(--elvis-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .elvis-badge {
          font-size: 9px;
          padding: 2px 6px;
          border-radius: 10px;
          background: var(--elvis-primary-20);
          color: var(--elvis-primary);
          border: 1px solid var(--elvis-primary-30);
          -webkit-text-fill-color: var(--elvis-primary);
        }

        .elvis-controls {
          display: flex;
          gap: 6px;
        }

        .elvis-control-btn {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          border: 1px solid var(--elvis-border);
          background: var(--elvis-bgLight);
          color: var(--elvis-text);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          transition: all 0.2s;
        }

        .elvis-control-btn:hover {
          background: var(--elvis-primary-20);
          border-color: var(--elvis-primary);
        }

        .elvis-tabs {
          display: flex;
          background: var(--elvis-bgDark);
          border-bottom: 1px solid var(--elvis-border);
          overflow-x: auto;
          flex-shrink: 0;
          scrollbar-width: none;
        }

        .elvis-tabs::-webkit-scrollbar {
          display: none;
        }

        .elvis-tab {
          padding: 10px 14px;
          cursor: pointer;
          opacity: 0.6;
          border-bottom: 2px solid transparent;
          white-space: nowrap;
          font-weight: 600;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.2s;
          position: relative;
        }

        .elvis-tab:hover {
          opacity: 0.8;
          background: var(--elvis-bgLight);
        }

        .elvis-tab.active {
          opacity: 1;
          border-color: var(--elvis-primary);
          color: var(--elvis-primary);
          background: var(--elvis-primary-10);
        }

        .elvis-tab-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          min-width: 16px;
          height: 16px;
          border-radius: 8px;
          background: var(--elvis-error);
          color: white;
          font-size: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
        }

        .elvis-content {
          flex: 1;
          display: none;
          overflow: hidden;
          flex-direction: column;
        }

        .elvis-content.active {
          display: flex;
        }

        .elvis-toolbar {
          padding: 8px;
          border-bottom: 1px solid var(--elvis-border);
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
          background: var(--elvis-bgDark);
          flex-shrink: 0;
        }

        .elvis-btn {
          background: var(--elvis-bgLight);
          border: 1px solid var(--elvis-border);
          color: var(--elvis-text);
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 600;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: inherit;
        }

        .elvis-btn:hover {
          background: var(--elvis-primary-20);
          border-color: var(--elvis-primary);
        }

        .elvis-btn.primary {
          background: var(--elvis-gradient);
          color: var(--elvis-bgDark);
          border: none;
          font-weight: 700;
        }

        .elvis-btn.primary:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .elvis-btn.danger {
          background: var(--elvis-error);
          color: white;
          border: none;
        }

        .elvis-btn.success {
          background: var(--elvis-success);
          color: white;
          border: none;
        }

        .elvis-btn.small {
          padding: 4px 8px;
          font-size: 10px;
        }

        .elvis-input {
          background: var(--elvis-bgDark);
          border: 1px solid var(--elvis-border);
          color: var(--elvis-text);
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-family: inherit;
          outline: none;
          transition: all 0.2s;
        }

        .elvis-input:focus {
          border-color: var(--elvis-primary);
          box-shadow: 0 0 0 3px var(--elvis-primary-20);
        }

        .elvis-input::placeholder {
          color: var(--elvis-textMuted);
        }

        .elvis-select {
          background: var(--elvis-bgDark);
          border: 1px solid var(--elvis-border);
          color: var(--elvis-text);
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-family: inherit;
          outline: none;
          cursor: pointer;
        }

        .elvis-editor {
          width: 100%;
          height: 100%;
          background: var(--elvis-bg);
          color: var(--elvis-primary);
          border: none;
          padding: 12px;
          resize: none;
          outline: none;
          font-family: inherit;
          font-size: 12px;
          line-height: 1.5;
        }

        .elvis-scrollable {
          flex: 1;
          overflow: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--elvis-primary-30) transparent;
        }

        .elvis-scrollable::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .elvis-scrollable::-webkit-scrollbar-track {
          background: transparent;
        }

        .elvis-scrollable::-webkit-scrollbar-thumb {
          background: var(--elvis-primary-30);
          border-radius: 3px;
        }

        .elvis-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
        }

        .elvis-table th {
          text-align: left;
          padding: 8px;
          background: var(--elvis-bgDark);
          position: sticky;
          top: 0;
          border-bottom: 1px solid var(--elvis-border);
          color: var(--elvis-primary);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 10px;
        }

        .elvis-table td {
          padding: 6px 8px;
          border-bottom: 1px solid var(--elvis-border);
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .elvis-table tr:hover {
          background: var(--elvis-primary-10);
          cursor: pointer;
        }

        .elvis-table tr.selected {
          background: var(--elvis-primary-20);
        }

        .elvis-log-item {
          padding: 8px 12px;
          border-bottom: 1px solid var(--elvis-border);
          font-size: 11px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
          transition: background 0.2s;
        }

        .elvis-log-item:hover {
          background: var(--elvis-primary-10);
        }

        .elvis-log-type {
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          flex-shrink: 0;
        }

        .elvis-log-type.log { background: var(--elvis-primary-20); color: var(--elvis-primary); }
        .elvis-log-type.info { background: #0066cc20; color: #60a5fa; }
        .elvis-log-type.warn { background: #cc660020; color: var(--elvis-warning); }
        .elvis-log-type.error { background: #cc000020; color: var(--elvis-error); }
        .elvis-log-type.debug { background: #66006620; color: #a78bfa; }

        .elvis-log-content {
          flex: 1;
          word-break: break-word;
          white-space: pre-wrap;
          font-family: inherit;
        }

        .elvis-log-time {
          color: var(--elvis-textMuted);
          font-size: 9px;
          flex-shrink: 0;
        }

        .elvis-card {
          background: var(--elvis-bgLight);
          border: 1px solid var(--elvis-border);
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 8px;
        }

        .elvis-card-title {
          font-weight: 700;
          margin-bottom: 8px;
          color: var(--elvis-primary);
          font-size: 12px;
        }

        .elvis-status {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 600;
        }

        .elvis-status.success { background: var(--elvis-success); color: white; }
        .elvis-status.warning { background: var(--elvis-warning); color: black; }
        .elvis-status.error { background: var(--elvis-error); color: white; }
        .elvis-status.info { background: var(--elvis-accent); color: white; }

        .elvis-chip {
          display: inline-flex;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 10px;
          background: var(--elvis-primary-20);
          color: var(--elvis-primary);
          margin: 2px;
        }

        .elvis-method {
          font-weight: 700;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .elvis-method.GET { background: #00ff0020; color: #00ff00; }
        .elvis-method.POST { background: #ff990020; color: #ff9900; }
        .elvis-method.PUT { background: #0099ff20; color: #0099ff; }
        .elvis-method.DELETE { background: #ff000020; color: #ff0000; }
        .elvis-method.PATCH { background: #aa00ff20; color: #aa00ff; }

        .elvis-http-status {
          font-weight: 700;
          font-size: 11px;
        }

        .elvis-http-status.ok { color: var(--elvis-success); }
        .elvis-http-status.redirect { color: var(--elvis-accent); }
        .elvis-http-status.error { color: var(--elvis-error); }

        .elvis-section {
          padding: 12px;
        }

        .elvis-section-title {
          font-weight: 700;
          font-size: 13px;
          margin-bottom: 12px;
          color: var(--elvis-primary);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .elvis-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 8px;
        }

        .elvis-stat {
          background: var(--elvis-bgLight);
          border: 1px solid var(--elvis-border);
          border-radius: 8px;
          padding: 12px;
          text-align: center;
        }

        .elvis-stat-value {
          font-size: 24px;
          font-weight: 700;
          color: var(--elvis-primary);
        }

        .elvis-stat-label {
          font-size: 10px;
          color: var(--elvis-textMuted);
          text-transform: uppercase;
          margin-top: 4px;
        }

        .elvis-progress {
          height: 6px;
          background: var(--elvis-bgDark);
          border-radius: 3px;
          overflow: hidden;
        }

        .elvis-progress-bar {
          height: 100%;
          background: var(--elvis-gradient);
          transition: width 0.3s;
        }

        .elvis-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          opacity: 0.5;
          text-align: center;
        }

        .elvis-empty-icon {
          font-size: 48px;
          margin-bottom: 12px;
        }

        .elvis-resize-handle {
          position: absolute;
          width: 20px;
          height: 20px;
          right: 0;
          bottom: 0;
          cursor: nwse-resize;
          opacity: 0.5;
        }

        .elvis-resize-handle::after {
          content: '';
          position: absolute;
          right: 4px;
          bottom: 4px;
          width: 10px;
          height: 10px;
          border-right: 2px solid var(--elvis-primary);
          border-bottom: 2px solid var(--elvis-primary);
        }

        .elvis-detail-panel {
          background: var(--elvis-bgDark);
          border-top: 1px solid var(--elvis-border);
          max-height: 40%;
          overflow: auto;
        }

        .elvis-detail-section {
          padding: 8px 12px;
          border-bottom: 1px solid var(--elvis-border);
        }

        .elvis-detail-title {
          font-weight: 700;
          font-size: 11px;
          color: var(--elvis-primary);
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .elvis-kv {
          display: flex;
          font-size: 11px;
          padding: 2px 0;
        }

        .elvis-kv-key {
          color: var(--elvis-textMuted);
          min-width: 120px;
          flex-shrink: 0;
        }

        .elvis-kv-value {
          color: var(--elvis-text);
          word-break: break-all;
        }

        .elvis-tabs-mini {
          display: flex;
          gap: 4px;
          margin-bottom: 8px;
        }

        .elvis-tab-mini {
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 10px;
          cursor: pointer;
          background: var(--elvis-bgLight);
          border: 1px solid var(--elvis-border);
          transition: all 0.2s;
        }

        .elvis-tab-mini.active {
          background: var(--elvis-primary-20);
          border-color: var(--elvis-primary);
          color: var(--elvis-primary);
        }

        .elvis-issue {
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 8px;
          border-left: 4px solid;
        }

        .elvis-issue.high {
          background: #ff000015;
          border-color: #ff0000;
        }

        .elvis-issue.medium {
          background: #ff990015;
          border-color: #ff9900;
        }

        .elvis-issue.low {
          background: #ffff0015;
          border-color: #ffff00;
        }

        .elvis-issue.info {
          background: #0099ff15;
          border-color: #0099ff;
        }

        .elvis-issue-title {
          font-weight: 700;
          font-size: 12px;
          margin-bottom: 4px;
        }

        .elvis-issue-desc {
          font-size: 11px;
          opacity: 0.8;
          margin-bottom: 4px;
        }

        .elvis-issue-rec {
          font-size: 10px;
          color: var(--elvis-accent);
        }

        .elvis-snippet {
          background: var(--elvis-bgLight);
          border: 1px solid var(--elvis-border);
          border-radius: 8px;
          padding: 10px;
          margin-bottom: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .elvis-snippet:hover {
          border-color: var(--elvis-primary);
          background: var(--elvis-primary-10);
        }

        .elvis-snippet-name {
          font-weight: 700;
          font-size: 12px;
          margin-bottom: 4px;
        }

        .elvis-snippet-category {
          font-size: 9px;
          padding: 2px 6px;
          border-radius: 10px;
          background: var(--elvis-primary-20);
          color: var(--elvis-primary);
        }

        .elvis-snippet-code {
          font-size: 10px;
          color: var(--elvis-textMuted);
          margin-top: 6px;
          max-height: 40px;
          overflow: hidden;
          font-family: inherit;
        }

        @media (max-width: 500px) {
          #elvis-dev-root:not(.minimized) {
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            top: auto !important;
            width: 100% !important;
            height: 70vh !important;
            border-radius: 16px 16px 0 0;
            border-bottom: none;
          }

          #elvis-dev-root.maximized {
            height: 100% !important;
            border-radius: 0;
            top: 0 !important;
          }

          .elvis-tab {
            padding: 8px 10px;
            font-size: 10px;
          }
        }
      `;
      
      const style = document.createElement('style');
      style.id = 'elvis-dev-styles';
      style.textContent = css;
      document.head.appendChild(style);
    }

    updateThemeVars() {
      const t = this.getTheme();
      const root = this.container.style;
      root.setProperty('--elvis-primary', t.primary);
      root.setProperty('--elvis-primary-10', t.primary + '1a');
      root.setProperty('--elvis-primary-20', t.primary + '33');
      root.setProperty('--elvis-primary-30', t.primary + '4d');
      root.setProperty('--elvis-primary-50', t.primary + '80');
      root.setProperty('--elvis-primary-70', t.primary + 'b3');
      root.setProperty('--elvis-secondary', t.secondary);
      root.setProperty('--elvis-bg', t.bg);
      root.setProperty('--elvis-bgDark', t.bgDark);
      root.setProperty('--elvis-bgLight', t.bgLight);
      root.setProperty('--elvis-text', t.text);
      root.setProperty('--elvis-textMuted', t.textMuted);
      root.setProperty('--elvis-accent', t.accent);
      root.setProperty('--elvis-success', t.success);
      root.setProperty('--elvis-warning', t.warning);
      root.setProperty('--elvis-error', t.error);
      root.setProperty('--elvis-border', t.border);
      root.setProperty('--elvis-gradient', t.gradient);
      root.setProperty('opacity', CONFIG.opacity);
      root.setProperty('font-size', CONFIG.fontSize + 'px');
    }

    createDOM() {
      this.container = document.createElement('div');
      this.container.id = 'elvis-dev-root';
      document.body.appendChild(this.container);
      
      // Apply saved position and size
      this.container.style.left = CONFIG.position.x + 'px';
      this.container.style.top = CONFIG.position.y + 'px';
      this.container.style.width = CONFIG.size.width + 'px';
      this.container.style.height = CONFIG.size.height + 'px';
    }

    formatTime(timestamp) {
      const d = new Date(timestamp);
      return d.toLocaleTimeString('en-US', { hour12: false }) + '.' + String(d.getMilliseconds()).padStart(3, '0');
    }

    formatBytes(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / 1048576).toFixed(2) + ' MB';
    }

    render() {
      this.updateThemeVars();
      
      if (this.isMinimized) {
        this.container.className = 'minimized';
        this.container.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:24px;">
            🚀
          </div>
        `;
        return;
      }

      this.container.className = this.isMaximized ? 'maximized' : '';
      
      const pendingCount = this.interceptQueue.length + (this.currentIntercept ? 1 : 0);
      const errorCount = this.engine.consoleLogs.filter(l => l.type === 'error').length;

      this.container.innerHTML = `
        <div class="elvis-header">
          <div class="elvis-title">
            🚀 ELVIS-DEV
            <span class="elvis-badge">v4.0</span>
          </div>
          <div class="elvis-controls">
            <button class="elvis-control-btn" id="elvis-maximize" title="Maximize">⬜</button>
            <button class="elvis-control-btn" id="elvis-minimize" title="Minimize">➖</button>
          </div>
        </div>
        
        <div class="elvis-tabs">
          <div class="elvis-tab ${this.activeTab === 'console' ? 'active' : ''}" data-tab="console">
            Console
            ${errorCount > 0 ? `<span class="elvis-tab-badge">${errorCount}</span>` : ''}
          </div>
          <div class="elvis-tab ${this.activeTab === 'network' ? 'active' : ''}" data-tab="network">
            Network
          </div>
          <div class="elvis-tab ${this.activeTab === 'intercept' ? 'active' : ''}" data-tab="intercept">
            Intercept
            ${pendingCount > 0 ? `<span class="elvis-tab-badge">${pendingCount}</span>` : ''}
          </div>
          <div class="elvis-tab ${this.activeTab === 'storage' ? 'active' : ''}" data-tab="storage">Storage</div>
          <div class="elvis-tab ${this.activeTab === 'elements' ? 'active' : ''}" data-tab="elements">Elements</div>
          <div class="elvis-tab ${this.activeTab === 'css' ? 'active' : ''}" data-tab="css">CSS</div>
          <div class="elvis-tab ${this.activeTab === 'js' ? 'active' : ''}" data-tab="js">JS</div>
          <div class="elvis-tab ${this.activeTab === 'snippets' ? 'active' : ''}" data-tab="snippets">Snippets</div>
          <div class="elvis-tab ${this.activeTab === 'repeater' ? 'active' : ''}" data-tab="repeater">Repeater</div>
          <div class="elvis-tab ${this.activeTab === 'security' ? 'active' : ''}" data-tab="security">Security</div>
          <div class="elvis-tab ${this.activeTab === 'device' ? 'active' : ''}" data-tab="device">Device</div>
          <div class="elvis-tab ${this.activeTab === 'perf' ? 'active' : ''}" data-tab="perf">Perf</div>
          <div class="elvis-tab ${this.activeTab === 'settings' ? 'active' : ''}" data-tab="settings">⚙️</div>
        </div>

        ${this.renderActiveTab()}
        
        <div class="elvis-resize-handle" id="elvis-resize"></div>
      `;

      this.postRender();
    }

    renderActiveTab() {
      switch(this.activeTab) {
        case 'console': return this.renderConsoleTab();
        case 'network': return this.renderNetworkTab();
        case 'intercept': return this.renderInterceptTab();
        case 'storage': return this.renderStorageTab();
        case 'elements': return this.renderElementsTab();
        case 'css': return this.renderCSSTab();
        case 'js': return this.renderJSTab();
        case 'snippets': return this.renderSnippetsTab();
        case 'repeater': return this.renderRepeaterTab();
        case 'security': return this.renderSecurityTab();
        case 'device': return this.renderDeviceTab();
        case 'perf': return this.renderPerfTab();
        case 'settings': return this.renderSettingsTab();
        default: return '<div class="elvis-content active"></div>';
      }
    }

    renderConsoleTab() {
      const filters = ['all', 'log', 'info', 'warn', 'error', 'debug'];
      let logs = this.engine.consoleLogs;
      
      if (this.consoleFilter !== 'all') {
        logs = logs.filter(l => l.type === this.consoleFilter);
      }
      
      if (this.consoleSearch) {
        const search = this.consoleSearch.toLowerCase();
        logs = logs.filter(l => l.args.some(a => a.toLowerCase().includes(search)));
      }

      return `
        <div class="elvis-content active">
          <div class="elvis-toolbar">
            <input type="text" class="elvis-input" id="elvis-console-search" 
              placeholder="🔍 Filter logs..." value="${this.consoleSearch}" style="flex:1;min-width:100px;">
            <select class="elvis-select" id="elvis-console-filter">
              ${filters.map(f => `<option value="${f}" ${this.consoleFilter === f ? 'selected' : ''}>${f.toUpperCase()}</option>`).join('')}
            </select>
            <button class="elvis-btn small" id="elvis-console-clear">Clear</button>
          </div>
          <div class="elvis-scrollable" id="elvis-console-list">
            ${logs.length === 0 ? `
              <div class="elvis-empty">
                <div class="elvis-empty-icon">📋</div>
                <div>Console is empty</div>
              </div>
            ` : logs.map(log => `
              <div class="elvis-log-item">
                <span class="elvis-log-type ${log.type}">${log.type}</span>
                <div class="elvis-log-content">${log.args.join(' ')}</div>
                <span class="elvis-log-time">${this.formatTime(log.timestamp)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    renderNetworkTab() {
      let logs = this.engine.networkLogs;
      
      if (this.networkSearch) {
        const search = this.networkSearch.toLowerCase();
        logs = logs.filter(l => l.url.toLowerCase().includes(search));
      }

      return `
        <div class="elvis-content active">
          <div class="elvis-toolbar">
            <input type="text" class="elvis-input" id="elvis-network-search" 
              placeholder="🔍 Filter URLs..." value="${this.networkSearch}" style="flex:1;min-width:100px;">
            <button class="elvis-btn small" id="elvis-network-clear">Clear</button>
          </div>
          <div class="elvis-scrollable" id="elvis-network-list">
            <table class="elvis-table">
              <thead>
                <tr>
                  <th>Method</th>
                  <th>URL</th>
                  <th>Status</th>
                  <th>Size</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                ${logs.length === 0 ? `
                  <tr><td colspan="5" style="text-align:center;padding:40px;opacity:0.5;">No requests yet</td></tr>
                ` : logs.map((log, i) => `
                  <tr data-index="${i}" class="${this.selectedNetworkLog === i ? 'selected' : ''}">
                    <td><span class="elvis-method ${log.method}">${log.method || '-'}</span></td>
                    <td title="${log.url}">${log.url.length > 40 ? log.url.slice(0, 40) + '...' : log.url}</td>
                    <td><span class="elvis-http-status ${log.status >= 200 && log.status < 300 ? 'ok' : log.status >= 300 && log.status < 400 ? 'redirect' : 'error'}">${log.status || '...'}</span></td>
                    <td>${this.formatBytes(log.size || 0)}</td>
                    <td>${log.duration}ms</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ${this.selectedNetworkLog !== null && this.engine.networkLogs[this.selectedNetworkLog] ? this.renderNetworkDetail(this.engine.networkLogs[this.selectedNetworkLog]) : ''}
        </div>
      `;
    }

    renderNetworkDetail(log) {
      return `
        <div class="elvis-detail-panel elvis-scrollable">
          <div class="elvis-detail-section">
            <div class="elvis-detail-title">General</div>
            <div class="elvis-kv"><span class="elvis-kv-key">URL:</span><span class="elvis-kv-value">${log.url}</span></div>
            <div class="elvis-kv"><span class="elvis-kv-key">Method:</span><span class="elvis-kv-value">${log.method}</span></div>
            <div class="elvis-kv"><span class="elvis-kv-key">Status:</span><span class="elvis-kv-value">${log.status} ${log.statusText || ''}</span></div>
            <div class="elvis-kv"><span class="elvis-kv-key">Content-Type:</span><span class="elvis-kv-value">${log.contentType || '-'}</span></div>
          </div>
          ${log.requestHeaders ? `
            <div class="elvis-detail-section">
              <div class="elvis-detail-title">Request Headers</div>
              ${Object.entries(log.requestHeaders).map(([k, v]) => `
                <div class="elvis-kv"><span class="elvis-kv-key">${k}:</span><span class="elvis-kv-value">${v}</span></div>
              `).join('')}
            </div>
          ` : ''}
          ${log.responseHeaders ? `
            <div class="elvis-detail-section">
              <div class="elvis-detail-title">Response Headers</div>
              ${Object.entries(log.responseHeaders).map(([k, v]) => `
                <div class="elvis-kv"><span class="elvis-kv-key">${k}:</span><span class="elvis-kv-value">${v}</span></div>
              `).join('')}
            </div>
          ` : ''}
          ${log.requestBody ? `
            <div class="elvis-detail-section">
              <div class="elvis-detail-title">Request Body</div>
              <pre style="font-size:11px;white-space:pre-wrap;word-break:break-all;margin:0;">${log.requestBody}</pre>
            </div>
          ` : ''}
          ${log.responseBody ? `
            <div class="elvis-detail-section">
              <div class="elvis-detail-title">Response Body</div>
              <pre style="font-size:11px;white-space:pre-wrap;word-break:break-all;margin:0;max-height:200px;overflow:auto;">${log.responseBody}</pre>
            </div>
          ` : ''}
          <div class="elvis-toolbar" style="border-top:1px solid var(--elvis-border);border-bottom:none;">
            <button class="elvis-btn small" id="elvis-send-to-repeater">Send to Repeater</button>
            <button class="elvis-btn small" id="elvis-copy-curl">Copy as cURL</button>
          </div>
        </div>
      `;
    }

    renderInterceptTab() {
      return `
        <div class="elvis-content active">
          <div class="elvis-toolbar">
            <button class="elvis-btn ${CONFIG.interceptRequests ? 'danger' : ''}" id="elvis-toggle-req-intercept">
              Req: ${CONFIG.interceptRequests ? '🔴 ON' : '⚪ OFF'}
            </button>
            <button class="elvis-btn ${CONFIG.interceptResponses ? 'danger' : ''}" id="elvis-toggle-res-intercept">
              Res: ${CONFIG.interceptResponses ? '🔴 ON' : '⚪ OFF'}
            </button>
            <button class="elvis-btn ${CONFIG.corsBypass ? 'success' : ''}" id="elvis-toggle-cors">
              CORS: ${CONFIG.corsBypass ? '✅' : '❌'}
            </button>
            <div style="flex:1"></div>
            ${this.currentIntercept ? `
              <button class="elvis-btn primary" id="elvis-forward">▶️ FORWARD</button>
              <button class="elvis-btn danger" id="elvis-drop">🚫 DROP</button>
            ` : ''}
          </div>
          <div style="flex:1;display:flex;flex-direction:column;">
            ${this.currentIntercept ? `
              <div style="padding:6px 12px;background:var(--elvis-primary-20);font-size:11px;font-weight:700;">
                ${this.currentIntercept.type === 'req' ? '📤 REQUEST' : '📥 RESPONSE'} INTERCEPTED (ID: ${this.currentIntercept.data.id})
              </div>
              <textarea id="elvis-intercept-editor" class="elvis-editor" spellcheck="false"></textarea>
            ` : `
              <div class="elvis-empty">
                <div class="elvis-empty-icon">🛑</div>
                <div style="font-size:14px;font-weight:700;">No Intercepted Traffic</div>
                <div style="font-size:11px;opacity:0.7;margin-top:8px;">Enable interception to capture and modify requests</div>
              </div>
            `}
          </div>
        </div>
      `;
    }

    renderStorageTab() {
      const local = StorageInspector.getLocalStorage();
      const session = StorageInspector.getSessionStorage();
      const cookies = StorageInspector.getCookies();

      return `
        <div class="elvis-content active">
          <div class="elvis-toolbar">
            <div class="elvis-tabs-mini">
              <div class="elvis-tab-mini ${this.storageTab === 'local' ? 'active' : ''}" data-storage-tab="local">
                LocalStorage (${local.length})
              </div>
              <div class="elvis-tab-mini ${this.storageTab === 'session' ? 'active' : ''}" data-storage-tab="session">
                Session (${session.length})
              </div>
              <div class="elvis-tab-mini ${this.storageTab === 'cookies' ? 'active' : ''}" data-storage-tab="cookies">
                Cookies (${cookies.length})
              </div>
            </div>
            <div style="flex:1"></div>
            <button class="elvis-btn small" id="elvis-storage-add">+ Add</button>
            <button class="elvis-btn small danger" id="elvis-storage-clear">Clear All</button>
          </div>
          <div class="elvis-scrollable">
            <table class="elvis-table">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                  <th>Size</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                ${(this.storageTab === 'local' ? local : this.storageTab === 'session' ? session : cookies).map(item => `
                  <tr>
                    <td>${item.key}</td>
                    <td title="${item.value}">${item.value.length > 50 ? item.value.slice(0, 50) + '...' : item.value}</td>
                    <td>${this.formatBytes(item.size)}</td>
                    <td>
                      <button class="elvis-btn small" data-storage-edit="${item.key}">✏️</button>
                      <button class="elvis-btn small danger" data-storage-delete="${item.key}">🗑️</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    renderElementsTab() {
      const info = this.inspectedElement ? DOMInspector.getElementInfo(this.inspectedElement) : null;

      return `
        <div class="elvis-content active">
          <div class="elvis-toolbar">
            <button class="elvis-btn ${this.inspectorActive ? 'primary' : ''}" id="elvis-start-inspect">
              ${this.inspectorActive ? '🎯 Inspecting...' : '🔍 Inspect Element'}
            </button>
            <div style="flex:1"></div>
            ${info ? '<button class="elvis-btn small" id="elvis-copy-selector">Copy Selector</button>' : ''}
          </div>
          <div class="elvis-scrollable elvis-section">
            ${!info ? `
              <div class="elvis-empty">
                <div class="elvis-empty-icon">🔍</div>
                <div>Click "Inspect Element" and tap on any element</div>
              </div>
            ` : `
              <div class="elvis-card">
                <div class="elvis-card-title">${info.path}</div>
                <div class="elvis-kv"><span class="elvis-kv-key">Tag:</span><span class="elvis-kv-value">&lt;${info.tagName}&gt;</span></div>
                ${info.id ? `<div class="elvis-kv"><span class="elvis-kv-key">ID:</span><span class="elvis-kv-value">#${info.id}</span></div>` : ''}
                ${info.className ? `<div class="elvis-kv"><span class="elvis-kv-key">Class:</span><span class="elvis-kv-value">.${info.className.split(' ').join('.')}</span></div>` : ''}
                <div class="elvis-kv"><span class="elvis-kv-key">Size:</span><span class="elvis-kv-value">${info.position.width}x${info.position.height}px</span></div>
                <div class="elvis-kv"><span class="elvis-kv-key">Position:</span><span class="elvis-kv-value">(${info.position.x}, ${info.position.y})</span></div>
              </div>
              
              <div class="elvis-card">
                <div class="elvis-card-title">Computed Styles</div>
                ${Object.entries(info.styles).map(([k, v]) => `
                  <div class="elvis-kv"><span class="elvis-kv-key">${k}:</span><span class="elvis-kv-value">${v}</span></div>
                `).join('')}
              </div>
              
              ${info.attributes.length > 0 ? `
                <div class="elvis-card">
                  <div class="elvis-card-title">Attributes</div>
                  ${info.attributes.map(a => `
                    <div class="elvis-kv"><span class="elvis-kv-key">${a.name}:</span><span class="elvis-kv-value">${a.value}</span></div>
                  `).join('')}
                </div>
              ` : ''}
              
              ${info.innerText ? `
                <div class="elvis-card">
                  <div class="elvis-card-title">Text Content</div>
                  <div style="font-size:11px;white-space:pre-wrap;word-break:break-word;">${info.innerText}</div>
                </div>
              ` : ''}
            `}
          </div>
        </div>
      `;
    }

    renderCSSTab() {
      return `
        <div class="elvis-content active">
          <div class="elvis-toolbar">
            <button class="elvis-btn primary" id="elvis-css-apply">Apply CSS</button>
            <button class="elvis-btn" id="elvis-css-clear">Clear</button>
            <div style="flex:1"></div>
            <button class="elvis-btn small" id="elvis-css-beautify">Beautify</button>
          </div>
          <div style="flex:1;display:flex;flex-direction:column;">
            <textarea id="elvis-css-editor" class="elvis-editor" 
              placeholder="/* Add custom CSS here */\n\nbody {\n  background: #000;\n}">${this.customCSS}</textarea>
          </div>
          <div class="elvis-section" style="border-top:1px solid var(--elvis-border);max-height:150px;overflow:auto;">
            <div class="elvis-detail-title">Page Stylesheets</div>
            ${CSSEditor.getPageStyles().map(s => `
              <div class="elvis-kv">
                <span class="elvis-kv-value">${s.href.length > 50 ? '...' + s.href.slice(-50) : s.href}</span>
                <span class="elvis-kv-key" style="margin-left:auto;">(${s.rules} rules)</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    renderJSTab() {
      return `
        <div class="elvis-content active">
          <div class="elvis-toolbar">
            <button class="elvis-btn primary" id="elvis-js-run">▶️ Run</button>
            <button class="elvis-btn" id="elvis-js-clear">Clear</button>
            <button class="elvis-btn" id="elvis-js-debug">🐛 debugger;</button>
            <div style="flex:1"></div>
            <button class="elvis-btn small" id="elvis-js-save-snippet">💾 Save Snippet</button>
          </div>
          <div style="flex:1;display:flex;flex-direction:column;">
            <textarea id="elvis-js-editor" class="elvis-editor" 
              placeholder="// Enter JavaScript to execute...\n// Example: console.log(document.title);">${this.currentJS}</textarea>
          </div>
          ${this.jsHistory.length > 0 ? `
            <div class="elvis-section" style="border-top:1px solid var(--elvis-border);max-height:100px;overflow:auto;">
              <div class="elvis-detail-title">History</div>
              ${this.jsHistory.slice(0, 5).map((h, i) => `
                <div class="elvis-kv" style="cursor:pointer;" data-history-index="${i}">
                  <span class="elvis-kv-value" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${h.slice(0, 60)}${h.length > 60 ? '...' : ''}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `;
    }

    renderSnippetsTab() {
      const snippets = SnippetsManager.get();
      const categories = [...new Set(snippets.map(s => s.category))];

      return `
        <div class="elvis-content active">
          <div class="elvis-toolbar">
            <input type="text" class="elvis-input" id="elvis-snippet-search" 
              placeholder="🔍 Search snippets..." style="flex:1;">
          </div>
          <div class="elvis-scrollable elvis-section">
            <div style="margin-bottom:12px;">
              ${categories.map(c => `<span class="elvis-chip">${c}</span>`).join('')}
            </div>
            ${snippets.map(s => `
              <div class="elvis-snippet" data-snippet-id="${s.id}">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <span class="elvis-snippet-name">${s.name}</span>
                  <span class="elvis-snippet-category">${s.category}</span>
                </div>
                <pre class="elvis-snippet-code">${s.code.slice(0, 100)}</pre>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    renderRepeaterTab() {
      return `
        <div class="elvis-content active">
          <div class="elvis-toolbar">
            <button class="elvis-btn primary" id="elvis-repeater-send">📤 SEND</button>
            <button class="elvis-btn" id="elvis-repeater-clear">Clear</button>
            <div style="flex:1"></div>
            <label style="display:flex;align-items:center;gap:6px;font-size:11px;">
              <input type="checkbox" id="elvis-repeater-cors" ${CONFIG.corsBypass ? 'checked' : ''}>
              CORS Bypass
            </label>
          </div>
          <div style="flex:1;display:flex;flex-direction:column;">
            <div style="flex:1;border-bottom:1px solid var(--elvis-border);">
              <textarea id="elvis-repeater-request" class="elvis-editor" 
                placeholder="GET / HTTP/1.1\nHost: example.com\nAccept: */*">${this.repeaterRequest}</textarea>
            </div>
            <div style="flex:1;background:var(--elvis-bgDark);">
              <textarea id="elvis-repeater-response" class="elvis-editor" readonly 
                placeholder="Response will appear here...">${this.repeaterResponse}</textarea>
            </div>
          </div>
        </div>
      `;
    }

    renderSecurityTab() {
      const issues = SecurityScanner.scan();

      return `
        <div class="elvis-content active">
          <div class="elvis-toolbar">
            <button class="elvis-btn primary" id="elvis-security-scan">🔍 Scan Page</button>
            <div style="flex:1"></div>
            <span style="font-size:11px;">
              Found: 
              <span style="color:var(--elvis-error);">${issues.filter(i => i.severity === 'high').length} High</span>,
              <span style="color:var(--elvis-warning);">${issues.filter(i => i.severity === 'medium').length} Med</span>,
              <span style="color:var(--elvis-accent);">${issues.filter(i => i.severity === 'low').length} Low</span>
            </span>
          </div>
          <div class="elvis-scrollable elvis-section">
            ${issues.length === 0 ? `
              <div class="elvis-empty">
                <div class="elvis-empty-icon">🛡️</div>
                <div style="font-size:14px;font-weight:700;color:var(--elvis-success);">No Issues Found!</div>
              </div>
            ` : issues.map(issue => `
              <div class="elvis-issue ${issue.severity}">
                <div class="elvis-issue-title">${issue.title}</div>
                <div class="elvis-issue-desc">${issue.description}</div>
                <div class="elvis-issue-rec">💡 ${issue.recommendation}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    renderDeviceTab() {
      const info = DeviceInfo.get();

      return `
        <div class="elvis-content active">
          <div class="elvis-scrollable elvis-section">
            <div class="elvis-section-title">📱 Device Info</div>
            
            <div class="elvis-grid">
              <div class="elvis-stat">
                <div class="elvis-stat-value">${info.viewport.width}x${info.viewport.height}</div>
                <div class="elvis-stat-label">Viewport</div>
              </div>
              <div class="elvis-stat">
                <div class="elvis-stat-value">${info.viewport.devicePixelRatio}x</div>
                <div class="elvis-stat-label">Pixel Ratio</div>
              </div>
              <div class="elvis-stat">
                <div class="elvis-stat-value">${info.online ? '🟢' : '🔴'}</div>
                <div class="elvis-stat-label">Online</div>
              </div>
            </div>

            <div class="elvis-card" style="margin-top:16px;">
              <div class="elvis-card-title">Screen</div>
              <div class="elvis-kv"><span class="elvis-kv-key">Resolution:</span><span class="elvis-kv-value">${info.screen.width}x${info.screen.height}</span></div>
              <div class="elvis-kv"><span class="elvis-kv-key">Color Depth:</span><span class="elvis-kv-value">${info.screen.colorDepth}-bit</span></div>
              <div class="elvis-kv"><span class="elvis-kv-key">Orientation:</span><span class="elvis-kv-value">${info.screen.orientation}</span></div>
            </div>

            <div class="elvis-card">
              <div class="elvis-card-title">Browser</div>
              <div class="elvis-kv"><span class="elvis-kv-key">Platform:</span><span class="elvis-kv-value">${info.platform}</span></div>
              <div class="elvis-kv"><span class="elvis-kv-key">Language:</span><span class="elvis-kv-value">${info.language}</span></div>
              <div class="elvis-kv"><span class="elvis-kv-key">Cookies:</span><span class="elvis-kv-value">${info.cookieEnabled ? '✅ Enabled' : '❌ Disabled'}</span></div>
              <div class="elvis-kv"><span class="elvis-kv-key">Do Not Track:</span><span class="elvis-kv-value">${info.doNotTrack || 'Not set'}</span></div>
            </div>

            ${info.connection ? `
              <div class="elvis-card">
                <div class="elvis-card-title">Connection</div>
                <div class="elvis-kv"><span class="elvis-kv-key">Type:</span><span class="elvis-kv-value">${info.connection.type}</span></div>
                <div class="elvis-kv"><span class="elvis-kv-key">Downlink:</span><span class="elvis-kv-value">${info.connection.downlink} Mbps</span></div>
                <div class="elvis-kv"><span class="elvis-kv-key">RTT:</span><span class="elvis-kv-value">${info.connection.rtt}ms</span></div>
                <div class="elvis-kv"><span class="elvis-kv-key">Save Data:</span><span class="elvis-kv-value">${info.connection.saveData ? '✅' : '❌'}</span></div>
              </div>
            ` : ''}

            ${info.gpu ? `
              <div class="elvis-card">
                <div class="elvis-card-title">GPU</div>
                <div class="elvis-kv"><span class="elvis-kv-key">Vendor:</span><span class="elvis-kv-value">${info.gpu.vendor}</span></div>
                <div class="elvis-kv"><span class="elvis-kv-key">Renderer:</span><span class="elvis-kv-value">${info.gpu.renderer}</span></div>
              </div>
            ` : ''}

            <div class="elvis-card">
              <div class="elvis-card-title">User Agent</div>
              <div style="font-size:10px;word-break:break-all;">${info.userAgent}</div>
            </div>

            <div class="elvis-card">
              <div class="elvis-card-title">Location</div>
              <div class="elvis-kv"><span class="elvis-kv-key">URL:</span><span class="elvis-kv-value" style="word-break:break-all;">${info.location.href}</span></div>
              <div class="elvis-kv"><span class="elvis-kv-key">Origin:</span><span class="elvis-kv-value">${info.location.origin}</span></div>
              <div class="elvis-kv"><span class="elvis-kv-key">Protocol:</span><span class="elvis-kv-value">${info.location.protocol}</span></div>
              ${info.referrer ? `<div class="elvis-kv"><span class="elvis-kv-key">Referrer:</span><span class="elvis-kv-value">${info.referrer}</span></div>` : ''}
            </div>
          </div>
        </div>
      `;
    }

    renderPerfTab() {
      const perf = this.engine.getPerformanceData();

      return `
        <div class="elvis-content active">
          <div class="elvis-scrollable elvis-section">
            <div class="elvis-section-title">⚡ Performance Metrics</div>

            <div class="elvis-grid">
              <div class="elvis-stat">
                <div class="elvis-stat-value">${perf.timing.load}ms</div>
                <div class="elvis-stat-label">Page Load</div>
              </div>
              <div class="elvis-stat">
                <div class="elvis-stat-value">${perf.timing.domReady}ms</div>
                <div class="elvis-stat-label">DOM Ready</div>
              </div>
              <div class="elvis-stat">
                <div class="elvis-stat-value">${perf.timing.ttfb}ms</div>
                <div class="elvis-stat-label">TTFB</div>
              </div>
            </div>

            <div class="elvis-card" style="margin-top:16px;">
              <div class="elvis-card-title">Timing Breakdown</div>
              <div class="elvis-kv"><span class="elvis-kv-key">DNS Lookup:</span><span class="elvis-kv-value">${perf.timing.dns}ms</span></div>
              <div class="elvis-kv"><span class="elvis-kv-key">TCP Connection:</span><span class="elvis-kv-value">${perf.timing.tcp}ms</span></div>
              <div class="elvis-kv"><span class="elvis-kv-key">TTFB:</span><span class="elvis-kv-value">${perf.timing.ttfb}ms</span></div>
              <div class="elvis-kv"><span class="elvis-kv-key">Download:</span><span class="elvis-kv-value">${perf.timing.download}ms</span></div>
            </div>

            <div class="elvis-card">
              <div class="elvis-card-title">Memory Usage</div>
              <div style="margin-bottom:8px;">
                <div class="elvis-progress">
                  <div class="elvis-progress-bar" style="width:${perf.memory.limit > 0 ? (perf.memory.used / perf.memory.limit * 100) : 0}%"></div>
                </div>
              </div>
              <div class="elvis-kv"><span class="elvis-kv-key">Used:</span><span class="elvis-kv-value">${perf.memory.used} MB</span></div>
              <div class="elvis-kv"><span class="elvis-kv-key">Total:</span><span class="elvis-kv-value">${perf.memory.total} MB</span></div>
              <div class="elvis-kv"><span class="elvis-kv-key">Limit:</span><span class="elvis-kv-value">${perf.memory.limit} MB</span></div>
            </div>

            <div class="elvis-card">
              <div class="elvis-card-title">Resources Loaded</div>
              <div class="elvis-kv"><span class="elvis-kv-key">Total:</span><span class="elvis-kv-value">${this.engine.resourceLogs.length}</span></div>
              <div class="elvis-kv"><span class="elvis-kv-key">Scripts:</span><span class="elvis-kv-value">${this.engine.resourceLogs.filter(r => r.type === 'script').length}</span></div>
              <div class="elvis-kv"><span class="elvis-kv-key">Styles:</span><span class="elvis-kv-value">${this.engine.resourceLogs.filter(r => r.type === 'css' || r.type === 'link').length}</span></div>
              <div class="elvis-kv"><span class="elvis-kv-key">Images:</span><span class="elvis-kv-value">${this.engine.resourceLogs.filter(r => r.type === 'img').length}</span></div>
              <div class="elvis-kv"><span class="elvis-kv-key">Fonts:</span><span class="elvis-kv-value">${this.engine.resourceLogs.filter(r => r.type === 'font').length}</span></div>
            </div>
          </div>
        </div>
      `;
    }

    renderSettingsTab() {
      const themeOptions = Object.entries(THEMES).map(([key, theme]) => 
        `<option value="${key}" ${CONFIG.theme === key ? 'selected' : ''}>${theme.name}</option>`
      ).join('');

      return `
        <div class="elvis-content active">
          <div class="elvis-scrollable elvis-section">
            <div class="elvis-section-title">⚙️ Settings</div>

            <div class="elvis-card">
              <div class="elvis-card-title">Appearance</div>
              
              <div style="margin-bottom:12px;">
                <label style="display:block;font-size:11px;margin-bottom:4px;">Theme</label>
                <select class="elvis-select" id="elvis-setting-theme" style="width:100%;">
                  ${themeOptions}
                </select>
              </div>

              <div style="margin-bottom:12px;">
                <label style="display:block;font-size:11px;margin-bottom:4px;">Opacity: ${CONFIG.opacity}</label>
                <input type="range" id="elvis-setting-opacity" min="0.5" max="1" step="0.05" value="${CONFIG.opacity}" style="width:100%;">
              </div>

              <div style="margin-bottom:12px;">
                <label style="display:block;font-size:11px;margin-bottom:4px;">Font Size: ${CONFIG.fontSize}px</label>
                <input type="range" id="elvis-setting-fontsize" min="10" max="16" step="1" value="${CONFIG.fontSize}" style="width:100%;">
              </div>
            </div>

            <div class="elvis-card">
              <div class="elvis-card-title">Behavior</div>
              
              <label style="display:flex;align-items:center;gap:8px;font-size:11px;margin-bottom:8px;cursor:pointer;">
                <input type="checkbox" id="elvis-setting-vibration" ${CONFIG.vibrationEnabled ? 'checked' : ''}>
                Enable Vibration Feedback
              </label>

              <label style="display:flex;align-items:center;gap:8px;font-size:11px;margin-bottom:8px;cursor:pointer;">
                <input type="checkbox" id="elvis-setting-autocapture" ${CONFIG.autoCapture ? 'checked' : ''}>
                Auto-capture Console/Network
              </label>
            </div>

            <div class="elvis-card">
              <div class="elvis-card-title">Data</div>
              <button class="elvis-btn" id="elvis-export-data" style="margin-right:8px;">📥 Export All Data</button>
              <button class="elvis-btn danger" id="elvis-clear-data">🗑️ Clear All Data</button>
            </div>

            <div class="elvis-card">
              <div class="elvis-card-title">About</div>
              <div style="font-size:11px;line-height:1.6;">
                <strong>Elvis-Dev.js v4.0.0</strong><br>
                The Ultimate Mobile Developer Tools<br><br>
                Features: Console, Network, Intercept, Storage,<br>
                Elements, CSS, JS, Snippets, Repeater,<br>
                Security Scanner, Device Info, Performance<br><br>
                Made with ❤️ for developers
              </div>
            </div>
          </div>
        </div>
      `;
    }

    postRender() {
      // Fill intercept editor if needed
      if (this.currentIntercept) {
        const el = document.getElementById('elvis-intercept-editor');
        if (el) {
          const { type, data } = this.currentIntercept;
          let raw = '';
          if (type === 'req') {
            raw = HttpParser.requestToRaw(data.method, data.url, data.headers, data.body);
          } else {
            raw = HttpParser.responseToRaw(data.status, data.statusText, data.headers, data.body);
          }
          el.value = raw;
        }
      }
    }

    refreshConsole() {
      if (this.activeTab === 'console') {
        this.render();
      }
    }

    refreshNetwork() {
      if (this.activeTab === 'network') {
        this.render();
      }
    }

    bindEvents() {
      const self = this;

      this.container.addEventListener('click', (e) => {
        const target = e.target;
        const id = target.id;
        const tab = target.dataset.tab;
        const storageTab = target.dataset.storageTab;
        const snippetId = target.closest('[data-snippet-id]')?.dataset.snippetId;
        const historyIndex = target.closest('[data-history-index]')?.dataset.historyIndex;
        const networkIndex = target.closest('[data-index]')?.dataset.index;

        self.feedback();

        // Tab switching
        if (tab) {
          self.activeTab = tab;
          self.render();
          return;
        }

        // Storage tab switching
        if (storageTab) {
          self.storageTab = storageTab;
          self.render();
          return;
        }

        // Minimize/Maximize
        if (id === 'elvis-minimize' || target.closest('.minimized')) {
          self.toggleMinimize();
          return;
        }
        if (id === 'elvis-maximize') {
          self.toggleMaximize();
          return;
        }

        // Console actions
        if (id === 'elvis-console-clear') {
          self.engine.consoleLogs = [];
          self.render();
          return;
        }

        // Network actions
        if (id === 'elvis-network-clear') {
          self.engine.networkLogs = [];
          self.selectedNetworkLog = null;
          self.render();
          return;
        }
        if (networkIndex !== undefined) {
          self.selectedNetworkLog = parseInt(networkIndex);
          self.render();
          return;
        }
        if (id === 'elvis-send-to-repeater') {
          const log = self.engine.networkLogs[self.selectedNetworkLog];
          if (log) {
            self.repeaterRequest = HttpParser.requestToRaw(log.method, log.url, log.requestHeaders || {}, log.requestBody || '');
            self.activeTab = 'repeater';
            self.render();
          }
          return;
        }
        if (id === 'elvis-copy-curl') {
          const log = self.engine.networkLogs[self.selectedNetworkLog];
          if (log) {
            let curl = `curl '${log.url}'`;
            if (log.requestHeaders) {
              Object.entries(log.requestHeaders).forEach(([k, v]) => {
                curl += ` -H '${k}: ${v}'`;
              });
            }
            if (log.method !== 'GET') {
              curl += ` -X ${log.method}`;
            }
            if (log.requestBody) {
              curl += ` -d '${log.requestBody}'`;
            }
            navigator.clipboard.writeText(curl);
            alert('Copied cURL command!');
          }
          return;
        }

        // Intercept actions
        if (id === 'elvis-toggle-req-intercept') {
          CONFIG.interceptRequests = !CONFIG.interceptRequests;
          saveConfig();
          self.render();
          return;
        }
        if (id === 'elvis-toggle-res-intercept') {
          CONFIG.interceptResponses = !CONFIG.interceptResponses;
          saveConfig();
          self.render();
          return;
        }
        if (id === 'elvis-toggle-cors') {
          CONFIG.corsBypass = !CONFIG.corsBypass;
          saveConfig();
          self.render();
          return;
        }
        if (id === 'elvis-forward') {
          self.handleInterceptAction('resolve');
          return;
        }
        if (id === 'elvis-drop') {
          self.handleInterceptAction('reject');
          return;
        }

        // Storage actions
        if (target.dataset.storageDelete) {
          const key = target.dataset.storageDelete;
          if (self.storageTab === 'local') StorageInspector.deleteLocalStorage(key);
          else if (self.storageTab === 'session') StorageInspector.deleteSessionStorage(key);
          else StorageInspector.deleteCookie(key);
          self.render();
          return;
        }
        if (target.dataset.storageEdit) {
          const key = target.dataset.storageEdit;
          const currentValue = self.storageTab === 'local' 
            ? localStorage.getItem(key) 
            : self.storageTab === 'session' 
              ? sessionStorage.getItem(key) 
              : '';
          const newValue = prompt('Edit value for "' + key + '":', currentValue);
          if (newValue !== null) {
            if (self.storageTab === 'local') StorageInspector.setLocalStorage(key, newValue);
            else if (self.storageTab === 'session') StorageInspector.setSessionStorage(key, newValue);
            self.render();
          }
          return;
        }
        if (id === 'elvis-storage-add') {
          const key = prompt('Enter key:');
          if (key) {
            const value = prompt('Enter value:');
            if (value !== null) {
              if (self.storageTab === 'local') StorageInspector.setLocalStorage(key, value);
              else if (self.storageTab === 'session') StorageInspector.setSessionStorage(key, value);
              else StorageInspector.setCookie(key, value);
              self.render();
            }
          }
          return;
        }
        if (id === 'elvis-storage-clear') {
          if (confirm('Clear all ' + self.storageTab + ' storage?')) {
            if (self.storageTab === 'local') StorageInspector.clearLocalStorage();
            else if (self.storageTab === 'session') StorageInspector.clearSessionStorage();
            else StorageInspector.clearCookies();
            self.render();
          }
          return;
        }

        // Elements actions
        if (id === 'elvis-start-inspect') {
          self.inspectorActive = true;
          self.render();
          DOMInspector.startInspecting((el) => {
            self.inspectorActive = false;
            self.inspectedElement = el;
            self.render();
          });
          return;
        }
        if (id === 'elvis-copy-selector') {
          const info = DOMInspector.getElementInfo(self.inspectedElement);
          if (info) {
            navigator.clipboard.writeText(info.path);
            alert('Copied selector!');
          }
          return;
        }

        // CSS actions
        if (id === 'elvis-css-apply') {
          const css = document.getElementById('elvis-css-editor').value;
          self.customCSS = css;
          CSSEditor.apply(css);
          alert('CSS Applied!');
          return;
        }
        if (id === 'elvis-css-clear') {
          self.customCSS = '';
          CSSEditor.clear();
          self.render();
          return;
        }

        // JS actions
        if (id === 'elvis-js-run') {
          const code = document.getElementById('elvis-js-editor').value;
          self.currentJS = code;
          if (code.trim()) {
            self.jsHistory.unshift(code);
            if (self.jsHistory.length > 20) self.jsHistory.pop();
            Storage.set(HISTORY_KEY, self.jsHistory);
            
            const result = SnippetsManager.execute(code);
            if (!result.success) {
              alert('Error: ' + result.error);
            }
          }
          return;
        }
        if (id === 'elvis-js-clear') {
          self.currentJS = '';
          self.render();
          return;
        }
        if (id === 'elvis-js-debug') {
          setTimeout(() => { debugger; }, 100);
          return;
        }
        if (id === 'elvis-js-save-snippet') {
          const code = document.getElementById('elvis-js-editor').value;
          if (code.trim()) {
            const name = prompt('Snippet name:');
            const category = prompt('Category:', 'custom');
            if (name && category) {
              SnippetsManager.add({ name, code, category });
              alert('Snippet saved!');
            }
          }
          return;
        }
        if (historyIndex !== undefined) {
          self.currentJS = self.jsHistory[parseInt(historyIndex)];
          self.render();
          return;
        }

        // Snippets actions
        if (snippetId) {
          const snippets = SnippetsManager.get();
          const snippet = snippets.find(s => s.id === snippetId);
          if (snippet) {
            self.currentJS = snippet.code;
            self.activeTab = 'js';
            self.render();
          }
          return;
        }

        // Repeater actions
        if (id === 'elvis-repeater-send') {
          self.handleRepeaterSend();
          return;
        }
        if (id === 'elvis-repeater-clear') {
          self.repeaterRequest = '';
          self.repeaterResponse = '';
          self.render();
          return;
        }

        // Security actions
        if (id === 'elvis-security-scan') {
          self.render();
          return;
        }

        // Settings actions
        if (id === 'elvis-export-data') {
          const data = {
            config: CONFIG,
            snippets: Storage.get(SNIPPETS_KEY, []),
            history: self.jsHistory,
            customCSS: self.customCSS,
          };
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'elvis-dev-export.json';
          a.click();
          URL.revokeObjectURL(url);
          return;
        }
        if (id === 'elvis-clear-data') {
          if (confirm('This will clear all Elvis-Dev data. Continue?')) {
            Storage.remove(STORAGE_KEY);
            Storage.remove(SNIPPETS_KEY);
            Storage.remove(HISTORY_KEY);
            Storage.remove('elvis_custom_css');
            location.reload();
          }
          return;
        }
      });

      // Input/Change events
      this.container.addEventListener('input', (e) => {
        const id = e.target.id;

        if (id === 'elvis-console-search') {
          self.consoleSearch = e.target.value;
          self.render();
        }
        if (id === 'elvis-network-search') {
          self.networkSearch = e.target.value;
          self.render();
        }
        if (id === 'elvis-setting-opacity') {
          CONFIG.opacity = parseFloat(e.target.value);
          saveConfig();
          self.updateThemeVars();
        }
        if (id === 'elvis-setting-fontsize') {
          CONFIG.fontSize = parseInt(e.target.value);
          saveConfig();
          self.updateThemeVars();
        }
      });

      this.container.addEventListener('change', (e) => {
        const id = e.target.id;

        if (id === 'elvis-console-filter') {
          self.consoleFilter = e.target.value;
          self.render();
        }
        if (id === 'elvis-setting-theme') {
          CONFIG.theme = e.target.value;
          saveConfig();
          self.render();
        }
        if (id === 'elvis-setting-vibration') {
          CONFIG.vibrationEnabled = e.target.checked;
          saveConfig();
        }
        if (id === 'elvis-setting-autocapture') {
          CONFIG.autoCapture = e.target.checked;
          saveConfig();
        }
        if (id === 'elvis-repeater-cors') {
          CONFIG.corsBypass = e.target.checked;
          saveConfig();
        }
      });
    }

    async handleInterceptAction(action) {
      if (!this.currentIntercept) return;

      const el = document.getElementById('elvis-intercept-editor');
      const raw = el.value;
      const parsed = HttpParser.parseRaw(raw);

      const { resolve, reject, type, data } = this.currentIntercept;

      if (action === 'reject') {
        reject();
      } else {
        if (type === 'req') {
          const parts = parsed.firstLine;
          let newUrl = data.url;
          if (parts[1]) {
            try {
              const u = new URL(data.url);
              if (parts[1].startsWith('http')) newUrl = parts[1];
              else newUrl = u.origin + parts[1];
            } catch(e) { newUrl = parts[1]; }
          }

          resolve({
            id: data.id,
            method: parts[0] || data.method,
            url: newUrl,
            headers: parsed.headers,
            body: parsed.body
          });
        } else {
          const parts = parsed.firstLine;
          resolve({
            id: data.id,
            status: parts[1] || 200,
            statusText: parts.slice(2).join(' ') || 'OK',
            headers: parsed.headers,
            body: parsed.body
          });
        }
      }

      this.currentIntercept = null;
      this.processQueue();
    }

    async handleRepeaterSend() {
      const raw = document.getElementById('elvis-repeater-request').value;
      this.repeaterRequest = raw;
      const parsed = HttpParser.parseRaw(raw);

      let url = parsed.firstLine[1];
      const headers = parsed.headers;

      if (url && !url.startsWith('http')) {
        const host = headers['Host'] || headers['host'];
        if (host) url = 'https://' + host + url;
      }

      // Apply CORS bypass if enabled
      if (CONFIG.corsBypass && url.startsWith('http') && !url.includes('corsproxy.io')) {
        url = 'https://corsproxy.io/?' + encodeURIComponent(url);
      }

      const resEl = document.getElementById('elvis-repeater-response');
      resEl.value = 'Sending...';

      try {
        const response = await this.engine.originalFetch(url, {
          method: parsed.firstLine[0],
          headers: headers,
          body: ['GET', 'HEAD'].includes(parsed.firstLine[0]) ? undefined : parsed.body
        });

        const text = await response.text();
        const resHeaders = {};
        response.headers.forEach((v, k) => resHeaders[k] = v);

        const rawRes = HttpParser.responseToRaw(response.status, response.statusText, resHeaders, text);
        this.repeaterResponse = rawRes;
        resEl.value = rawRes;
      } catch(e) {
        this.repeaterResponse = 'Error: ' + e.message;
        resEl.value = 'Error: ' + e.message;
      }
    }

    setupDraggable() {
      let isDragging = false, startX, startY, initLeft, initTop;

      const onDown = (e) => {
        if (this.isMinimized || this.isMaximized) return;
        if (e.target.closest('.elvis-header') && !e.target.closest('button')) {
          isDragging = true;
          const touch = e.touches ? e.touches[0] : e;
          startX = touch.clientX;
          startY = touch.clientY;
          const rect = this.container.getBoundingClientRect();
          initLeft = rect.left;
          initTop = rect.top;
        }
      };

      const onMove = (e) => {
        if (!isDragging) return;
        const touch = e.touches ? e.touches[0] : e;
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;
        
        const newX = Math.max(0, Math.min(window.innerWidth - 50, initLeft + dx));
        const newY = Math.max(0, Math.min(window.innerHeight - 50, initTop + dy));
        
        this.container.style.left = newX + 'px';
        this.container.style.top = newY + 'px';
        this.container.style.right = 'auto';
        this.container.style.bottom = 'auto';
        
        CONFIG.position = { x: newX, y: newY };
        e.preventDefault();
      };

      const onUp = () => {
        if (isDragging) {
          saveConfig();
          isDragging = false;
        }
      };

      this.container.addEventListener('mousedown', onDown);
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);

      this.container.addEventListener('touchstart', onDown, { passive: true });
      window.addEventListener('touchmove', onMove, { passive: false });
      window.addEventListener('touchend', onUp);
    }

    setupResize() {
      let isResizing = false, startX, startY, initWidth, initHeight;

      const onDown = (e) => {
        if (this.isMinimized || this.isMaximized) return;
        if (e.target.id === 'elvis-resize') {
          isResizing = true;
          const touch = e.touches ? e.touches[0] : e;
          startX = touch.clientX;
          startY = touch.clientY;
          const rect = this.container.getBoundingClientRect();
          initWidth = rect.width;
          initHeight = rect.height;
          e.preventDefault();
        }
      };

      const onMove = (e) => {
        if (!isResizing) return;
        const touch = e.touches ? e.touches[0] : e;
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;

        const newWidth = Math.max(320, initWidth + dx);
        const newHeight = Math.max(400, initHeight + dy);

        this.container.style.width = newWidth + 'px';
        this.container.style.height = newHeight + 'px';
        
        CONFIG.size = { width: newWidth, height: newHeight };
        e.preventDefault();
      };

      const onUp = () => {
        if (isResizing) {
          saveConfig();
          isResizing = false;
        }
      };

      this.container.addEventListener('mousedown', onDown);
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);

      this.container.addEventListener('touchstart', onDown, { passive: false });
      window.addEventListener('touchmove', onMove, { passive: false });
      window.addEventListener('touchend', onUp);
    }
  }

  // ╔════════════════════════════════════════════════════════════════════════════════════════╗
  // ║                                 INITIALIZATION                                         ║
  // ╚════════════════════════════════════════════════════════════════════════════════════════╝

  const engine = new InterceptorEngine();
  window.__elvisUI__ = new ElvisUI(engine);

  console.log('%c🚀 Elvis-Dev.js v4.0 Loaded!', 'color:#00ffd5;font-size:16px;font-weight:bold;');
  console.log('%cThe Ultimate Mobile Developer Tools', 'color:#ff00ff;font-size:12px;');

})();