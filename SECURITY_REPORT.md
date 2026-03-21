# Security Vulnerability Report - F1 Statistics Website

**Report Date**: March 21, 2026  
**Severity**: 🔴 HIGH - Multiple vulnerabilities detected  
**Status**: Action Required

---

## Executive Summary

Security scan identified **7 known vulnerabilities** in dependencies and several code-level security concerns. While the application uses external data sources (not processing user input), there are still important security issues to address before production deployment.

---

## 1. CRITICAL: Dependency Vulnerabilities

### 1.1 Server Dependencies

#### High Severity: ReDoS in `semver` (via `nodemon`)
- **Severity**: 🔴 HIGH
- **CVE**: GHSA-c2qf-rxjj-qqgw
- **Affected Packages**: 
  - `semver` 7.0.0 - 7.5.1 (in node_modules/simple-update-notifier/node_modules/semver)
  - `simple-update-notifier` 1.0.7 - 1.1.0
  - `nodemon` 2.0.19 - 2.0.22
- **Description**: Regular Expression Denial of Service (ReDoS) vulnerability
- **Impact**: Development only (appears to only affect `nodemon`), but should be fixed
- **Fix**: Run `npm audit fix --force` in `/server`

**Recommendation**: While this is in a dev dependency, it's still good practice to fix it.

---

### 1.2 Client Dependencies

#### High Severity: Inefficient RegEx in `nth-check`
- **Severity**: 🔴 HIGH  
- **CVE**: GHSA-rp65-9cf3-cjxr
- **Affected Chain**: 
  - `nth-check` < 2.0.1 (in svgo/node_modules)
  - `css-select` ≤ 3.1.0
  - `svgo` 1.0.0 - 1.3.2
  - `@svgr/webpack` 4.0.0 - 5.5.0
  - `react-scripts` (build tool)
- **Description**: Inefficient Regular Expression Complexity allowing ReDoS
- **Impact**: Build tool vulnerability; potential attack during build process
- **Fix**: Update `react-scripts` to latest version

#### High Severity: RCE in `serialize-javascript`
- **Severity**: 🔴 HIGH (RCE - Remote Code Execution)
- **CVE**: GHSA-5c6j-r48x-rmvq
- **Affected Packages**:
  - `serialize-javascript` ≤ 7.0.2
  - Used by `css-minimizer-webpack-plugin` and `rollup-plugin-terser`
  - Pulled in by `react-scripts`
- **Description**: Serialize JavaScript vulnerable to RCE via RegExp and Date methods
- **Impact**: Build process vulnerability; potential code injection
- **Fix**: Run `npm audit fix --force` in `/client`

#### High Severity: DoS in `underscore`
- **Severity**: 🔴 HIGH (DoS)
- **CVE**: GHSA-qpx9-hpmf-5gmw
- **Affected Packages**:
  - `underscore` ≤ 1.13.7
  - `jsonpath` (depends on vulnerable underscore)
- **Description**: Unlimited recursion in `_.flatten()` and `_.isEqual()` - Denial of Service
- **Impact**: Potentially high if jsonpath processes untrusted data
- **Fix**: Run `npm audit fix` in `/client`

#### Moderate Severity: PostCSS Line Parsing Error
- **Severity**: 🟠 MODERATE
- **CVE**: GHSA-7fh5-64p2-3v2j
- **Affected Package**: 
  - `postcss` < 8.4.31 (in resolve-url-loader)
- **Description**: PostCSS line return parsing error
- **Fix**: Run `npm audit fix --force` in `/client`

#### @tootallnate/once - Incorrect Control Flow
- **Severity**: 🟠 MODERATE
- **CVE**: GHSA-vpq2-c234-7xj6
- **Affected Chain**: @tootallnate/once → http-proxy-agent → jsdom → jest-environment-jsdom
- **Description**: Incorrect control flow scoping
- **Impact**: Testing/dev dependency; limited exposure in production
- **Fix**: Run `npm audit fix` in `/client`

---

## 2. CODE-LEVEL SECURITY ISSUES

### 2.1 CORS Configuration - ⚠️ MODERATE

**Location**: [server/server.js](server/server.js#L10)

**Current Code**:
```javascript
app.use(cors());
```

**Issue**: Allows requests from ANY origin. This is overly permissive.

**Recommendation**: In production, configure CORS explicitly:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
```

**Risk Level**: Medium - Exposes API to any website

---

### 2.2 Missing Rate Limiting - ⚠️ MODERATE

**Issue**: No rate limiting on API endpoints. External API is accessible without restrictions.

**Risk**: API abuse, consuming external API quota quickly, potential DoS

**Recommendation**: Add `express-rate-limit`:
```javascript
npm install express-rate-limit
```

Then implement:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);
```

---

### 2.3 Missing Security Headers - ⚠️ MODERATE

**Issue**: No security headers set (X-Frame-Options, Content-Security-Policy, etc.)

**Recommendation**: Add `helmet`:
```javascript
npm install helmet

// In server.js
const helmet = require('helmet');
app.use(helmet());
```

This will add:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection headers
- Stricter-Transport-Security (HTTPS)

---

### 2.4 No Input Validation on Query Parameters - ⚠️ LOW

**Location**: [server/server.js](server/server.js#L31)

**Example**:
```javascript
app.get('/api/standings/:year?', async (req, res) => {
  const year = req.params.year || new Date().getFullYear();
  // No validation - could receive malicious input
```

**Recommendation**: Add input validation:
```javascript
const year = parseInt(req.params.year) || new Date().getFullYear();
if (isNaN(year) || year < 1950 || year > new Date().getFullYear() + 1) {
  return res.status(400).json({ error: 'Invalid year' });
}
```

---

### 2.5 Information Disclosure in Error Messages - ⚠️ LOW

**Location**: [server/server.js - multiple](server/server.js)

**Current Code**:
```javascript
} catch (error) {
  console.error('Error fetching standings:', error.message);
  res.status(500).json({ error: 'Failed to fetch standings' });
}
```

**Issue**: While current messages are generic, detailed errors could leak information in production.

**Recommendation**: In production, use generic messages and log full details server-side:
```javascript
const logger = require('winston'); // or similar

} catch (error) {
  logger.error('API Error:', {
    endpoint: '/api/standings',
    error: error.message,
    stack: error.stack
  });
  res.status(500).json({ error: 'An error occurred while fetching data' });
}
```

---

### 2.6 Missing HTTPS Enforcement - ⚠️ MODERATE

**Issue**: No enforcement of HTTPS in production. App runs on HTTP by default.

**Recommendation**: Add middleware to enforce HTTPS:
```javascript
// Only in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

---

### 2.7 No Response Security Headers - ⚠️ LOW

**Issue**: Missing security headers on responses (Content-Security-Policy, etc.)

**Already Covered by Helmet** - see section 2.3

---

## 3. DEPENDENCY MANAGEMENT ISSUES

### 3.1 Outdated Dependencies

**Issue**: Several core dependencies are not at latest stable versions:
- `react@18.2.0` (check for updates)
- `react-router-dom@6.13.0` (check for updates)
- `express@4.18.2` (check for updates)

**Recommendation**: 
```bash
# Check for updates
npm outdated

# Update non-breaking versions
npm update

# For breaking updates, review and test carefully
npm install express@latest
```

---

## 4. ENVIRONMENT CONFIGURATION - ✅ GOOD

**Positive Note**: 
- `.env` files are properly listed in `.gitignore`
- `.env.example` provided as template
- dotenv is correctly used for configuration

**No Critical Issues**: Nothing exposed in version control.

---

## 5. CLIENT-SIDE SECURITY

### 5.1 Open External Links - ✅ SECURE

**Location**: [client/src/components/DriverProfiles.js](client/src/components/DriverProfiles.js)

**Current Code**:
```javascript
<a href={selectedDriver.url} target="_blank" rel="noopener noreferrer">
```

**Status**: ✅ SECURE - Properly uses `rel="noopener noreferrer"`

---

### 5.2 Data Handling - ✅ SECURE

**Note**: React automatically escapes strings rendered in JSX, preventing XSS. Current implementation is safe because:
- No use of `dangerouslySetInnerHTML`
- No rendering of raw HTML
- All data displayed as text strings

---

## 6. REMEDIATION PLAN

### Priority 1: CRITICAL (Do Immediately)
1. **Fix RCE vulnerability in `serialize-javascript`**
   ```bash
   cd client && npm audit fix --force
   cd ../server && npm audit fix --force
   ```

2. **Configure CORS properly** (update [server/server.js](server/server.js#L10))

### Priority 2: HIGH (Before Production)
3. **Add rate limiting** to server
4. **Add helmet security headers** to server
5. **Add input validation** on query parameters
6. **Enforce HTTPS** in production environment

### Priority 3: MEDIUM (Before Production)
7. **Add error logging** (Winston, Morgan)
8. **Review and validate** all external API calls
9. **Add CSRF protection** if forms added later
10. **Configure CSP headers** with helmet

### Priority 4: LOW (Best Practice)
11. **Update outdated dependencies** to latest stable versions
12. **Add security testing** to CI/CD pipeline
13. **Implement monitoring** and alerting

---

## 7. QUICK FIXES

### Step 1: Fix NPM Vulnerabilities
```bash
# In /server
cd server
npm audit fix --force

# In /client  
cd ../client
npm audit fix --force
```

### Step 2: Add Security Packages
```bash
# In server
npm install helmet express-rate-limit express-validator
```

### Step 3: Update server.js with security headers
```javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, param, validationResult } = require('express-validator');

// Apply helmet for security headers
app.use(helmet());

// Apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.'
});
app.use('/api/', limiter);

// Proper CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET'],
  allowedHeaders: ['Content-Type']
}));
```

---

## 8. DEPLOYMENT CHECKLIST

- [ ] Run `npm audit` on both client and server - NO critical vulnerabilities
- [ ] Set `NODE_ENV=production` in production
- [ ] Add CORS whitelist with production frontend URL
- [ ] Enable HTTPS/SSL certificate
- [ ] Add rate limiting to API endpoints
- [ ] Configure helmet security headers
- [ ] Add input validation to all endpoints
- [ ] Set up error logging (not console.log)
- [ ] Test all endpoints with production configuration
- [ ] Enable monitoring and alerting
- [ ] Document security requirements
- [ ] Set up automated security scanning in CI/CD

---

## 9. ONGOING SECURITY PRACTICES

1. **Regular Dependency Updates**
   ```bash
   npm outdated
   npm update
   npm audit
   ```

2. **Automated Security Scanning**
   - Use GitHub security scanning
   - Implement Snyk or similar in CI/CD

3. **Code Review**
   - Security-focused code reviews
   - OWASP Top 10 checklist

4. **Monitoring**
   - Track error rates and anomalies
   - Monitor API response times for abuse patterns
   - Alert on high rate limit hits

---

## References

- [OWASP Top 10 (2021)](https://owasp.org/Top10/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [React Security Considerations](https://react.dev/reference/react-dom/createDangerouslySetInnerHTML)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [npm Audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)

---

**Report Created**: March 21, 2026  
**Next Review**: Before production deployment
