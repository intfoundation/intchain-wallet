'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var secp256k1 = require('secp256k1');

var _require = require('crypto'),
    randomBytes = _require.randomBytes,
    createHash = _require.createHash;

var _require2 = require('./staticwriter'),
    StaticWriter = _require2.StaticWriter;

var assert = require('assert');
var base58 = '' + '123456789' + 'ABCDEFGHJKLMNPQRSTUVWXYZ' + 'abcdefghijkmnopqrstuvwxyz';
function createKeyPair() {
  var privateKey = void 0;

  do {
    privateKey = randomBytes(32);
  } while (!secp256k1.privateKeyVerify(privateKey));

  var key = secp256k1.publicKeyCreate(privateKey, true);
  return [key, privateKey];
}

function publicKeyFromSecretKey(secret) {
  if (typeof secret === 'string') {
    secret = Buffer.from(secret, 'hex');
  }
  if (!secp256k1.privateKeyVerify(secret)) {
    return;
  }
  var key = secp256k1.publicKeyCreate(secret, true);
  return key;
}

function addressFromSecretKey(secret) {
  var publicKey = publicKeyFromSecretKey(secret);
  if (publicKey) {
    return addressFromPublicKey(publicKey);
  }
}

function addressFromPublicKey(publicKey) {
  if (typeof publicKey === 'string') {
    publicKey = Buffer.from(publicKey, 'hex');
  }
  return base58encode(pubKeyToBCFormat(publicKey, ''));
}
function hash160(data) {
  return ripemd160(sha256(data));
}
function sha256(data) {
  return hash('sha256', data);
}
function ripemd160(data) {
  return hash('ripemd160', data);
}
function hash(alg, data) {
  return createHash(alg).update(data).digest();
}
function pubKeyToBCFormat(publickey, netPrefix) {
  var keyHash = hash160(publickey);
  var size = 5 + keyHash.length;
  var bw = new StaticWriter(size);

  bw.writeU8(netPrefix);

  bw.writeBytes(keyHash);
  bw.writeChecksum();

  return bw.render();
}
function base58encode(data) {
  var zeroes = 0;
  var i = 0;

  for (; i < data.length; i++) {
    if (data[i] !== 0) break;
    zeroes++;
  }

  var b58 = Buffer.allocUnsafe((data.length * 138 / 100 | 0) + 1);
  b58.fill(0);

  var length = 0;

  for (; i < data.length; i++) {
    var carry = data[i];
    var j = 0;

    for (var k = b58.length - 1; k >= 0; k--, j++) {
      if (carry === 0 && j >= length) break;
      carry += 256 * b58[k];
      b58[k] = carry % 58;
      carry = carry / 58 | 0;
    }

    assert(carry === 0);
    length = j;
  }

  i = b58.length - length;
  while (i < b58.length && b58[i] === 0) {
    i++;
  }var str = '';

  for (var _j = 0; _j < zeroes; _j++) {
    str += '1';
  }for (; i < b58.length; i++) {
    str += base58[b58[i]];
  }return str;
};

var _createKeyPair = createKeyPair(),
    _createKeyPair2 = (0, _slicedToArray3.default)(_createKeyPair, 2),
    key = _createKeyPair2[0],
    secret = _createKeyPair2[1];

var addr = addressFromSecretKey(secret);
//console.log(`address:${addr} secret:${secret.toString('hex')}`);

module.exports = {
  createKeyPair: createKeyPair,
  addressFromSecretKey: addressFromSecretKey
};