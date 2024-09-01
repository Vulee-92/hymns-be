const crypto = require('crypto');

// Đảm bảo ENCRYPTION_KEY là một chuỗi hex 32 byte (64 ký tự hex)
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
const IV_LENGTH = 16;

function encrypt(text) {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
	if (!text || typeof text !== 'string') {
    throw new Error('Invalid input for decryption');
  }

  if (!ivHex || !encryptedHex) {
    throw new Error('Invalid encrypted data format');
  }
  const [ivHex, encryptedHex] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encryptedText = Buffer.from(encryptedHex, 'hex');
  // Sử dụng ENCRYPTION_KEY đã được định nghĩa ở trên, không cần chuyển đổi lại
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

module.exports = { encrypt, decrypt };