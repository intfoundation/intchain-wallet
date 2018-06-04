/*!
 * address.js - address object for bcoin
 * Copyright (c) 2014-2015, Fedor Indutny (MIT License)
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

const assert = require('assert');
const Network = require('../Protocol/network');
const encoding = require('../Utils/encoding');
const util = require('../Utils/util');
const digest = require('../Crypto/digest');
const BufferReader = require('../Utils/reader');
const StaticWriter = require('../Utils/staticwriter');
const base58 = require('../Utils/base58');
const bech32 = require('../Utils/bech32');

/**
 * Represents an address.
 * @alias module:primitives.Address
 * @constructor
 * @param {Object?} options
 * @property {Buffer} hash
 * @property {AddressPrefix} type
 * @property {Number} version
 * @property {Network} network
 */

class Address {
    constructor(options) {
        if (!(this instanceof Address))
            return new Address(options);

        this.hash = encoding.ZERO_HASH160;
        this.type = Address.types.PUBKEYHASH;
        this.version = -1;
        this.network = Network.primary;

        if (options)
            this.fromOptions(options);
    }

    /**
     * Address types by value.
     * @const {RevMap}
     */
    static typesByVal() {
        return util.reverse(Address.types);
    }

    /**
     * Inject properties from options object.
     * @private
     * @param {Object} options
     */
    fromOptions(options) {
        if (typeof options === 'string')
            return this.fromString(options);

        return this.fromHash(
            options.hash,
            options.type,
            options.version,
            options.network
        );
    }

    /**
     * Insantiate address from options.
     * @param {Object} options
     * @returns {Address}
     */
    static fromOptions(options) {
        return new Address().fromOptions(options);
    }

    /**
     * Get the address hash.
     * @param {String?} enc - Can be `"hex"` or `null`.
     * @returns {Hash|Buffer}
     */
    getHash(enc) {
        if (enc === 'hex')
            return this.hash.toString(enc);
        return this.hash;
    }

    /**
     * Test whether the address is null.
     * @returns {Boolean}
     */
    isNull() {
        if (this.hash.length === 20)
            return this.hash.equals(encoding.ZERO_HASH160);

        if (this.hash.length === 32)
            return this.hash.equals(encoding.ZERO_HASH);

        for (let i = 0; i < this.hash.length; i++) {
            if (this.hash[i] !== 0)
                return false;
        }

        return true;
    }

    /**
     * Test equality against another address.
     * @param {Address} addr
     * @returns {Boolean}
     */
    equals(addr) {
        assert(addr instanceof Address);

        return this.network === addr.network
            && this.type === addr.type
            && this.version === addr.version
            && this.hash.equals(addr.hash);
    }


    /**
     * Get the address type as a string.
     * @returns {String}
     */
    getType() {
        return Address.typesByVal[this.type].toLowerCase();
    }

    /**
     * Get a network address prefix for the address.
     * @param {Network?} network
     * @returns {Number}
     */
    getPrefix(network) {
        if (!network)
            network = this.network;

        network = Network.get(network);

        const prefixes = network.addressPrefix;

        switch (this.type) {
            case Address.types.PUBKEYHASH:
                return prefixes.pubkeyhash;
            case Address.types.SCRIPTHASH:
                return prefixes.scripthash;
            case Address.types.WITNESS:
                if (this.hash.length === 20)
                    return prefixes.witnesspubkeyhash;

                if (this.hash.length === 32)
                    return prefixes.witnessscripthash;

                break;
        }

        return -1;
    }


    /**
     * Calculate size of serialized address.
     * @returns {Number}
     */
    getSize() {
        let size = 5 + this.hash.length;

        if (this.version !== -1)
            size += 2;

        return size;
    }

    /**
     * Compile the address object to its raw serialization.
     * @param {{NetworkType|Network)?} network
     * @returns {Buffer}
     * @throws Error on bad hash/prefix.
     */
    toRaw(network) {
        const size = this.getSize();
        const bw = new StaticWriter(size);
        const prefix = this.getPrefix(network);

        assert(prefix !== -1, 'Not a valid address prefix.');

        bw.writeU8(prefix);

        if (this.version !== -1) {
            bw.writeU8(this.version);
            bw.writeU8(0);
        }

        bw.writeBytes(this.hash);
        bw.writeChecksum();

        return bw.render();
    }

    /**
     * Compile the address object to a base58 address.
     * @param {{NetworkType|Network)?} network
     * @returns {Base58Address}
     * @throws Error on bad hash/prefix.
     */
    toBase58(network) {
        return base58.encode(this.toRaw(network));
    }


    /**
     * Compile the address object to a bech32 address.
     * @param {{NetworkType|Network)?} network
     * @returns {String}
     * @throws Error on bad hash/prefix.
     */

    toBech32(network) {
        const version = this.version;
        const hash = this.hash;

        assert(version !== -1,
            'Cannot convert non-program address to bech32.');

        if (!network)
            network = this.network;

        network = Network.get(network);

        const hrp = network.addressPrefix.bech32;

        return bech32.encode(hrp, version, hash);
    }

    /**
     * Inject properties from string.
     * @private
     * @param {String} addr
     * @param {(Network|NetworkType)?} network
     * @returns {Address}
     */
    fromString(addr, network) {
        assert(typeof addr === 'string');
        assert(addr.length > 0);
        assert(addr.length <= 100);

        // If the address is mixed case,
        // it can only ever be base58.
        if (isMixedCase(addr))
            return this.fromBase58(addr, network);

        // Otherwise, it's most likely bech32.
        try {
            return this.fromBech32(addr, network);
        } catch (e) {
            return this.fromBase58(addr, network);
        }
    }

    /**
     * Instantiate address from string.
     * @param {String} addr
     * @param {(Network|NetworkType)?} network
     * @returns {Address}
     */
    static fromString(addr, network) {
        return new Address().fromString(addr, network);
    }

    /**
     * Convert the Address to a string.
     * @param {(Network|NetworkType)?} network
     * @returns {Base58Address}
     */
    toString(network) {
        if (this.version !== -1)
            return this.toBech32(network);
        return this.toBase58(network);
    }

    /**
     * Inspect the Address.
     * @returns {Object}
     */
    inspect() {
        return '<Address:'
            + ` type=${this.getType()}`
            + ` version=${this.version}`
            + ` str=${this.toString()}`
            + '>';
    }

    /**
     * Inject properties from serialized data.
     * @private
     * @param {Buffer} data
     * @throws Parse error
     */
    fromRaw(data, network) {
        const br = new BufferReader(data, true);

        if (data.length > 40)
            throw new Error('Address is too long.');

        const prefix = br.readU8();

        network = Network.fromAddress(prefix, network);

        const type = Address.getType(prefix, network);

        let version = -1;
        if (data.length > 25) {
            version = br.readU8();

            if (br.readU8() !== 0)
                throw new Error('Address version padding is non-zero.');
        }

        const hash = br.readBytes(br.left() - 4);

        br.verifyChecksum();

        return this.fromHash(hash, type, version, network);
    }

    /**
     * Create an address object from a serialized address.
     * @param {Buffer} data
     * @returns {Address}
     * @throws Parse error.
     */
    static fromRaw(data, network) {
        return new Address().fromRaw(data, network);
    };

    /**
     * Inject properties from base58 address.
     * @private
     * @param {Base58Address} data
     * @param {Network?} network
     * @throws Parse error
     */
    fromBase58(data, network) {
        assert(typeof data === 'string');

        if (data.length > 55)
            throw new Error('Address is too long.');

        return this.fromRaw(base58.decode(data), network);
    }

    /**
     * Create an address object from a base58 address.
     * @param {Base58Address} data
     * @param {Network?} network
     * @returns {Address}
     * @throws Parse error.
     */
    static fromBase58(data, network) {
        return new Address().fromBase58(data, network);
    }

    /**
     * Inject properties from bech32 address.
     * @private
     * @param {String} data
     * @param {Network?} network
     * @throws Parse error
     */
    fromBech32(data, network) {
        const type = Address.types.WITNESS;

        assert(typeof data === 'string');

        const addr = bech32.decode(data);

        network = Network.fromBech32(addr.hrp, network);

        return this.fromHash(addr.hash, type, addr.version, network);
    }

    /**
     * Create an address object from a bech32 address.
     * @param {String} data
     * @param {Network?} network
     * @returns {Address}
     * @throws Parse error.
     */
    static fromBech32(data, network) {
        return new Address().fromBech32(data, network);
    }

    /**
     * Inject properties from witness.
     * @private
     * @param {Witness} witness
     */
    fromWitness(witness) {
        const [, pk] = witness.getPubkeyhashInput();

        // We're pretty much screwed here
        // since we can't get the version.
        if (pk) {
            this.hash = digest.hash160(pk);
            this.type = Address.types.WITNESS;
            this.version = 0;
            return this;
        }

        const redeem = witness.getScripthashInput();

        if (redeem) {
            this.hash = digest.sha256(redeem);
            this.type = Address.types.WITNESS;
            this.version = 0;
            return this;
        }

        return null;
    }

    /**
     * Inject properties from output script.
     * @private
     * @param {Script} script
     */
    fromScript(script) {
        const pk = script.getPubkey();

        if (pk) {
            this.hash = digest.hash160(pk);
            this.type = Address.types.PUBKEYHASH;
            this.version = -1;
            return this;
        }

        const pkh = script.getPubkeyhash();

        if (pkh) {
            this.hash = pkh;
            this.type = Address.types.PUBKEYHASH;
            this.version = -1;
            return this;
        }

        const sh = script.getScripthash();

        if (sh) {
            this.hash = sh;
            this.type = Address.types.SCRIPTHASH;
            this.version = -1;
            return this;
        }

        const program = script.getProgram();

        if (program && !program.isMalformed()) {
            this.hash = program.data;
            this.type = Address.types.WITNESS;
            this.version = program.version;
            return this;
        }

        // Put this last: it's the slowest to check.
        if (script.isMultisig()) {
            this.hash = script.hash160();
            this.type = Address.types.SCRIPTHASH;
            this.version = -1;
            return this;
        }

        return null;
    }

    /**
     * Inject properties from input script.
     * @private
     * @param {Script} script
     */
    fromInputScript(script) {
        const [, pk] = script.getPubkeyhashInput();

        if (pk) {
            this.hash = digest.hash160(pk);
            this.type = Address.types.PUBKEYHASH;
            this.version = -1;
            return this;
        }

        const redeem = script.getScripthashInput();

        if (redeem) {
            this.hash = digest.hash160(redeem);
            this.type = Address.types.SCRIPTHASH;
            this.version = -1;
            return this;
        }

        return null;
    }

    /**
     * Create an Address from a witness.
     * Attempt to extract address
     * properties from a witness.
     * @param {Witness}
     * @returns {Address|null}
     */
    static fromWitness(witness) {
        return new Address().fromWitness(witness);
    }

    /**
     * Create an Address from an input script.
     * Attempt to extract address
     * properties from an input script.
     * @param {Script}
     * @returns {Address|null}
     */
    static fromInputScript(script) {
        return new Address().fromInputScript(script);
    }

    /**
     * Create an Address from an output script.
     * Parse an output script and extract address
     * properties. Converts pubkey and multisig
     * scripts to pubkeyhash and scripthash addresses.
     * @param {Script}
     * @returns {Address|null}
     */
    static fromScript(script) {
        return new Address().fromScript(script);
    }

    /**
     * Inject properties from a hash.
     * @private
     * @param {Buffer|Hash} hash
     * @param {AddressPrefix} type
     * @param {Number} [version=-1]
     * @param {(Network|NetworkType)?} network
     * @throws on bad hash size
     */
    fromHash(hash, type, version, network) {
        if (typeof hash === 'string')
            hash = Buffer.from(hash, 'hex');

        if (typeof type === 'string') {
            type = Address.types[type.toUpperCase()];
            assert(type != null, 'Not a valid address type.');
        }

        if (type == null)
            type = Address.types.PUBKEYHASH;

        if (version == null)
            version = -1;

        network = Network.get(network);

        assert(Buffer.isBuffer(hash));
        assert(util.isU8(type));
        assert(util.isI8(version));

        assert(type >= Address.types.PUBKEYHASH && type <= Address.types.WITNESS,
            'Not a valid address type.');

        if (version === -1) {
            assert(type !== Address.types.WITNESS, 'Wrong version (witness)');
            assert(hash.length === 20, 'Hash is the wrong size.');
        } else {
            assert(type === Address.types.WITNESS, 'Wrong version (non-witness).');
            assert(version >= 0 && version <= 16, 'Bad program version.');
            if (version === 0 && type === Address.types.WITNESS) {
                assert(hash.length === 20 || hash.length === 32,
                    'Witness program hash is the wrong size.');
            }
            assert(hash.length >= 2 && hash.length <= 40, 'Hash is the wrong size.');
        }

        this.hash = hash;
        this.type = type;
        this.version = version;
        this.network = network;

        return this;
    }

    /**
     * Create a naked address from hash/type/version.
     * @param {Hash} hash
     * @param {AddressPrefix} type
     * @param {Number} [version=-1]
     * @param {(Network|NetworkType)?} network
     * @returns {Address}
     * @throws on bad hash size
     */
    static fromHash(hash, type, version, network) {
        return new Address().fromHash(hash, type, version, network);
    }

    /**
     * Inject properties from pubkeyhash.
     * @private
     * @param {Buffer} hash
     * @param {Network?} network
     * @returns {Address}
     */
    fromPubkeyhash(hash, network) {
        const type = Address.types.PUBKEYHASH;
        assert(hash.length === 20, 'P2PKH must be 20 bytes.');
        return this.fromHash(hash, type, -1, network);
    }

    /**
     * Instantiate address from pubkeyhash.
     * @param {Buffer} hash
     * @param {Network?} network
     * @returns {Address}
     */
    static fromPubkeyhash(hash, network) {
        return new Address().fromPubkeyhash(hash, network);
    }

    /**
     * Inject properties from scripthash.
     * @private
     * @param {Buffer} hash
     * @param {Network?} network
     * @returns {Address}
     */
    fromScripthash(hash, network) {
        const type = Address.types.SCRIPTHASH;
        assert(hash && hash.length === 20, 'P2SH must be 20 bytes.');
        return this.fromHash(hash, type, -1, network);
    }

    /**
     * Instantiate address from scripthash.
     * @param {Buffer} hash
     * @param {Network?} network
     * @returns {Address}
     */
    static fromScripthash(hash, network) {
        return new Address().fromScripthash(hash, network);
    }

    /**
     * Inject properties from witness pubkeyhash.
     * @private
     * @param {Buffer} hash
     * @param {Network?} network
     * @returns {Address}
     */
    fromWitnessPubkeyhash(hash, network) {
        const type = Address.types.WITNESS;
        assert(hash && hash.length === 20, 'P2WPKH must be 20 bytes.');
        return this.fromHash(hash, type, 0, network);
    }


    /**
     * Instantiate address from witness pubkeyhash.
     * @param {Buffer} hash
     * @param {Network?} network
     * @returns {Address}
     */
    static fromWitnessPubkeyhash(hash, network) {
        return new Address().fromWitnessPubkeyhash(hash, network);
    }

    /**
     * Inject properties from witness scripthash.
     * @private
     * @param {Buffer} hash
     * @param {Network?} network
     * @returns {Address}
     */
    fromWitnessScripthash(hash, network) {
        const type = Address.types.WITNESS;
        assert(hash && hash.length === 32, 'P2WPKH must be 32 bytes.');
        return this.fromHash(hash, type, 0, network);
    }

    /**
     * Instantiate address from witness scripthash.
     * @param {Buffer} hash
     * @param {Network?} network
     * @returns {Address}
     */
    static fromWitnessScripthash(hash, network) {
        return new Address().fromWitnessScripthash(hash, network);
    }

    /**
     * Inject properties from witness program.
     * @private
     * @param {Number} version
     * @param {Buffer} hash
     * @param {Network?} network
     * @returns {Address}
     */
    fromProgram(version, hash, network) {
        const type = Address.types.WITNESS;

        assert(version >= 0, 'Bad version for witness program.');

        if (typeof hash === 'string')
            hash = Buffer.from(hash, 'hex');

        return this.fromHash(hash, type, version, network);
    }

    /**
     * Instantiate address from witness program.
     * @param {Number} version
     * @param {Buffer} hash
     * @param {Network?} network
     * @returns {Address}
     */
    static fromProgram(version, hash, network) {
        return new Address().fromProgram(version, hash, network);
    }

    /**
     * Test whether the address is pubkeyhash.
     * @returns {Boolean}
     */
    isPubkeyhash() {
        return this.type === Address.types.PUBKEYHASH;
    }

    /**
     * Test whether the address is scripthash.
     * @returns {Boolean}
     */

    isScripthash() {
        return this.type === Address.types.SCRIPTHASH;
    }

    /**
     * Test whether the address is witness pubkeyhash.
     * @returns {Boolean}
     */
    isWitnessPubkeyhash() {
        return this.version === 0 && this.hash.length === 20;
    }

    /**
     * Test whether the address is witness scripthash.
     * @returns {Boolean}
     */
    isWitnessScripthash() {
        return this.version === 0 && this.hash.length === 32;
    }

    /**
     * Test whether the address is witness masthash.
     * @returns {Boolean}
     */
    isWitnessMasthash() {
        return this.version === 1 && this.hash.length === 32;
    }

    /**
     * Test whether the address is a witness program.
     * @returns {Boolean}
     */
    isProgram() {
        return this.version !== -1;
    }

    /**
     * Test whether the address is an unknown witness program.
     * @returns {Boolean}
     */
    isUnknown() {
        if (this.version === -1)
            return false;

        if (this.version > 0)
            return true;

        return this.hash.length !== 20 && this.hash.length !== 32;
    }

    /**
     * Get the hash of a base58 address or address-related object.
     * @param {String|Address|Hash} data
     * @param {String?} enc
     * @param {Network?} network
     * @returns {Hash}
     */
    static getHash(data, enc, network) {
        if (!data)
            throw new Error('Object is not an address.');

        let hash;

        if (typeof data === 'string') {
            if (data.length === 40 || data.length === 64)
                return enc === 'hex' ? data : Buffer.from(data, 'hex');

            hash = Address.fromString(data, network).hash;
        } else if (Buffer.isBuffer(data)) {
            if (data.length !== 20 && data.length !== 32)
                throw new Error('Object is not an address.');
            hash = data;
        } else if (data instanceof Address) {
            hash = data.hash;
            if (network) {
                network = Network.get(network);
                if (data.network !== network)
                    throw new Error('Network mismatch for address.');
            }
        } else {
            throw new Error('Object is not an address.');
        }

        return enc === 'hex'
            ? hash.toString('hex')
            : hash;
    }

    /**
     * Get an address type for a specified network address prefix.
     * @param {Number} prefix
     * @param {Network} network
     * @returns {AddressType}
     */
    static getType(prefix, network) {
        const prefixes = network.addressPrefix;
        switch (prefix) {
            case prefixes.pubkeyhash:
                return Address.types.PUBKEYHASH;
            case prefixes.scripthash:
                return Address.types.SCRIPTHASH;
            case prefixes.witnesspubkeyhash:
            case prefixes.witnessscripthash:
                return Address.types.WITNESS;
            default:
                throw new Error('Unknown address prefix.');
        }
    }
}

/**
 * Address types.
 * @enum {Number}
 */

Address.types = {
    PUBKEYHASH: 2,
    SCRIPTHASH: 3,
    WITNESS: 4
};

/*
 * Helpers
 */

function isMixedCase(str) {
    let lower = false;
    let upper = false;

    for (let i = 0; i < str.length; i++) {
        const ch = str.charCodeAt(i);

        if (ch >= 0x30 && ch <= 0x39)
            continue;

        if (ch & 32) {
            assert(ch >= 0x61 && ch <= 0x7a);
            lower = true;
        } else {
            assert(ch >= 0x41 && ch <= 0x5a);
            upper = true;
        }

        if (lower && upper)
            return true;
    }

    return false;
}

/*
 * Expose
 */

module.exports = Address;
