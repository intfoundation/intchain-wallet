const secp256k1 = require('secp256k1');
const { randomBytes,createHash } = require('crypto');
const { StaticWriter } = require( './staticwriter');
const assert = require('assert')
const base58 = ''
  + '123456789'
  + 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  + 'abcdefghijkmnopqrstuvwxyz';
function createKeyPair(){
  let privateKey;

  do {
    privateKey = randomBytes(32);
  } while (!secp256k1.privateKeyVerify(privateKey));

  const key = secp256k1.publicKeyCreate(privateKey, true);
  return [key, privateKey];
}

function publicKeyFromSecretKey(secret){
  if (typeof secret === 'string') {
    secret = Buffer.from(secret, 'hex');
  }
  if (!secp256k1.privateKeyVerify(secret)) {
    return;
  }
  const key = secp256k1.publicKeyCreate(secret, true);
  return key;
}

function addressFromSecretKey(secret){
  let publicKey = publicKeyFromSecretKey(secret);
  if (publicKey) {
    return addressFromPublicKey(publicKey);
  }
}

function addressFromPublicKey(publicKey){
  if (typeof publicKey === 'string') {
    publicKey = Buffer.from(publicKey, 'hex');
  }
  return base58encode(pubKeyToBCFormat(publicKey, ''));
}
function hash160(data){
  return ripemd160(sha256(data));
}
function sha256(data){
  return hash('sha256', data);
}
function ripemd160(data){
  return hash('ripemd160', data);
}
function hash(alg, data) {
  return createHash(alg).update(data).digest();
}
function pubKeyToBCFormat(publickey, netPrefix) {
  const keyHash = hash160(publickey);
  const size = 5 + keyHash.length;
  const bw = new StaticWriter(size);

  bw.writeU8(netPrefix);

  bw.writeBytes(keyHash);
  bw.writeChecksum();

  return bw.render();
}
function base58encode(data) {
  let zeroes = 0;
  let i = 0;

  for (; i < data.length; i++) {
    if (data[i] !== 0)
      break;
    zeroes++;
  }

  const b58 = Buffer.allocUnsafe(((data.length * 138 / 100) | 0) + 1);
  b58.fill(0);

  let length = 0;

  for (; i < data.length; i++) {
    let carry = data[i];
    let j = 0;

    for (let k = b58.length - 1; k >= 0; k--, j++) {
      if (carry === 0 && j >= length)
        break;
      carry += 256 * b58[k];
      b58[k] = carry % 58;
      carry = carry / 58 | 0;
    }

    assert(carry === 0);
    length = j;
  }

  i = b58.length - length;
  while (i < b58.length && b58[i] === 0)
    i++;

  let str = '';

  for (let j = 0; j < zeroes; j++)
    str += '1';

  for (; i < b58.length; i++)
    str += base58[b58[i]];

  return str;
};
let [key, secret] = createKeyPair();
let addr = addressFromSecretKey(secret);
//console.log(`address:${addr} secret:${secret.toString('hex')}`);

module.exports = {
  createKeyPair,
  addressFromSecretKey
}
