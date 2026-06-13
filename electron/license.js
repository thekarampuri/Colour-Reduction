// Colour Reduction — License Verification
const crypto = require('crypto');
const os     = require('os');
const path   = require('path');
const fs     = require('fs');

// ── 1. PASTE YOUR PUBLIC KEY HERE ─────────────────────────────────────────────
const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEEq28Ml1uSn+e51jTU8NLsaimjEvG
jsBg8ylJLB/DyDxQ4nvFO5tLApJ5RdU8y/4XOM6/+hPpUedI/JdDHkgbNA==
-----END PUBLIC KEY-----`;
// ─────────────────────────────────────────────────────────────────────────────

// ── 2. Collect Hardware Fingerprint (Machine ID) ──────────────────────────────
function getMachineId() {
  try {
    const { execSync } = require('child_process');
    // Use the official Windows Registry MachineGuid to avoid Antivirus heuristics
    const regPath = process.env.windir ? path.join(process.env.windir, 'System32', 'reg.exe') : 'reg';
    const output = execSync(`"${regPath}" query HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Cryptography /v MachineGuid`, { timeout: 5000 }).toString();
    const match = output.match(/REG_SZ\s+([^\r\n]+)/i);
    const guid = match ? match[1].trim() : '';
    
    if (!guid) throw new Error('MachineGuid not found');
      
    const hash = crypto.createHash('sha256')
      .update(guid)
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
  try {
    const p = getLicensePath();
    const dir = path.dirname(p);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(p, JSON.stringify({ machineId, licenseKey }), 'utf8');
  } catch (e) {
    console.error('Failed to save license', e);
  }
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
