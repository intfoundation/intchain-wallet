const secp256k1 = require('secp256k1');
export class Transaction {
    constructor();

    static address = "";

    method = "";

    nonce;

    input;

    sign(privateKey) {
        let pubkey = Address.publicKeyFromSecretKey(privateKey);
        this.m_publicKey = pubkey;
        this.updateHash();
        this.m_signature = Address.sign(this.m_hash, privateKey);
    }
    updateHash() {
        this.m_hash = this._genHash();
    }
}
export class ValueTransaction extends Transaction {
    constructor();

    value;

    fee;
}

function publicKeyFromSecretKey(secret) {
    if (typeof secret === 'string') {
        secret = Buffer.from(secret, 'hex');
    }
    if (!secp256k1.privateKeyVerify(secret)) {
        return;
    }
    const key = secp256k1.publicKeyCreate(secret, true);
    return key;
}