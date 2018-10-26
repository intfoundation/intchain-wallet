/*!
 * merkle.js - merkle trees for bcoin
 * Copyright (c) 2014-2015, Fedor Indutny (MIT License)
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */
'use strict';

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module crypto/merkle
 */
var digest = require("./digest");
/**
 * Build a merkle tree from leaves.
 * Note that this will mutate the `leaves` array!
 * @param {Buffer[]} leaves
 * @returns {Array} [nodes, malleated]
 */
function createTree(leaves) {
    var nodes = leaves;
    var size = leaves.length;
    var malleated = false;
    var i = 0;
    if (size === 0) {
        nodes.push(Buffer.alloc(32));
        return [nodes, malleated];
    }
    while (size > 1) {
        for (var j = 0; j < size; j += 2) {
            var k = Math.min(j + 1, size - 1);
            var left = nodes[i + j];
            var right = nodes[i + k];
            if (k === j + 1 && k + 1 === size && left.equals(right)) {
                malleated = true;
            }
            var hash = digest.root256(left, right);
            nodes.push(hash);
        }
        i += size;
        size += 1;
        size >>>= 1;
    }
    return [nodes, malleated];
}
exports.createTree = createTree;
/**
 * Calculate merkle root from leaves.
 * @param {Buffer[]} leaves
 * @returns {Array} [root, malleated]
 */
function createRoot(leaves) {
    var _createTree = createTree(leaves),
        _createTree2 = (0, _slicedToArray3.default)(_createTree, 2),
        nodes = _createTree2[0],
        malleated = _createTree2[1];

    var root = nodes[nodes.length - 1];
    return [root, malleated];
}
exports.createRoot = createRoot;
/**
 * Collect a merkle branch from vector index.
 * @param {Number} index
 * @param {Buffer[]} leaves
 * @returns {Buffer[]} branch
 */
function createBranch(index, leaves) {
    var size = leaves.length;

    var _createTree3 = createTree(leaves),
        _createTree4 = (0, _slicedToArray3.default)(_createTree3, 1),
        nodes = _createTree4[0];

    var branch = [];
    var i = 0;
    while (size > 1) {
        var j = Math.min(index ^ 1, size - 1);
        branch.push(nodes[i + j]);
        index >>>= 1;
        i += size;
        size += 1;
        size >>>= 1;
    }
    return branch;
}
exports.createBranch = createBranch;
/**
 * Derive merkle root from branch.
 * @param {Buffer} hash
 * @param {Buffer[]} branch
 * @param {Number} index
 * @returns {Buffer} root
 */
function deriveRoot(hash, branch, index) {
    var root = hash;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = (0, _getIterator3.default)(branch), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var branchHash = _step.value;

            if (index & 1) {
                root = digest.root256(branchHash, root);
            } else {
                root = digest.root256(root, branchHash);
            }
            index >>>= 1;
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return root;
}
exports.deriveRoot = deriveRoot;