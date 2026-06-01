// Colour Reduction — License Verification
const crypto = require('crypto');
const os     = require('os');
const path   = require('path');
const fs     = require('fs');

// ── 1. PASTE YOUR PUBLIC KEY HERE ─────────────────────────────────────────────
const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEQSRU5A35y8h59ADIL4PUIP/qD1QB
f1p5j2qM75mvoY3A84K9VYy2fm9gIhK97RBfx5AShOn7VIWlXuxQ7YNh4g==
-----END PUBLIC KEY-----`;
// ─────────────────────────────────────────────────────────────────────────────

// ── 2. Collect Hardware Fingerprint (Machine ID) ──────────────────────────────
function getMachineId() {
  try {
    const { execSync } = require('child_process');
    const uuid = execSync('wmic csproduct get UUID /value', { timeout: 5000 })
      .toString().match(/UUID=([^\r\n]+)/)?.[1]?.trim() || '';
    const cpu  = execSync('wmic cpu get ProcessorId /value', { timeout: 5000 })
      .toString().match(/ProcessorId=([^\r\n]+)/)?.[1]?.trim() || '';
    const disk = execSync('wmic diskdrive get SerialNumber /value', { timeout: 5000 })
      .toString().match(/SerialNumber=([^\r\n]+)/)?.[1]?.trim().split('\n')[0]?.trim() || '';
      
    const hash = crypto.createHash('sha256')
      .update(`${uuid}|${cpu}|${disk}`)
      .digest('hex').toUpperCase();
    return hash.match(/.{8}/g).join('-');
  } catch {
    const ifaces = os.networkInterfaces();
    let mac = '';
    for (const iface of Object.values(ifaces)) {
      for (const addr of iface) {
        if (!addr.internal && addr.mac && addr.mac !== '00:00:00:00:00:00') {
          mac = addr.mac; break;
        }
      }
      if (mac) break;
    }
    const hash = crypto.createHash('sha256')
      .update(`${os.hostname()}|${mac}`)
      .digest('hex').toUpperCase();
    return hash.match(/.{8}/g).join('-');
  }
}

// ── 3. Verify Signature ───────────────────────────────────────────────────────
function verifyLicense(machineId, licenseKey) {
  try {
    if (!PUBLIC_KEY || PUBLIC_KEY.includes('PASTE_YOUR_COLOUR_REDUCTION_PUBLIC_KEY_HERE')) return false;
    
    const verify = crypto.createVerify('SHA256');
    verify.update(machineId.toUpperCase().trim());
    return verify.verify(PUBLIC_KEY, Buffer.from(licenseKey, 'base64'));
  } catch {
    return false;
  }
}

// ── 4. App Storage Helpers ────────────────────────────────────────────────────
function getLicensePath() {
  const { app } = require('electron');
  return path.join(app.getPath('userData'), 'license.dat');
}

function saveLicense(machineId, licenseKey) {
  fs.writeFileSync(getLicensePath(), JSON.stringify({ machineId, licenseKey }), 'utf8');
}

function loadAndVerify() {
  try {
    if (!fs.existsSync(getLicensePath())) return false;
    
    const data      = JSON.parse(fs.readFileSync(getLicensePath(), 'utf8'));
    const currentId = getMachineId();
    
    if (data.machineId !== currentId) return false;
    
    return verifyLicense(currentId, data.licenseKey);
  } catch {
    return false;
  }
}

module.exports = { getMachineId, verifyLicense, saveLicense, loadAndVerify };
