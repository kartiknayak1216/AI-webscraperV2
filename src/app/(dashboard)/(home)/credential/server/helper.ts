import crypto from 'crypto'
const algorithm = 'aes-256-cbc'
 export function decrypt(text: string): string | false{
    const key = process.env.SECRET_KEY
    if(!key){
      return false
    }
    const [ivHex, encryptedHex] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedData = Buffer.from(encryptedHex, 'hex');

 const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), iv);
  
  let decrypted = decipher.update(encryptedData);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString('utf-8');
  
  }