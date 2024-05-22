"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthereumKeyPair = void 0;
const KeyGenerator_1 = require("./KeyGenerator");
const EthereumKeyOperations_1 = require("./EthereumKeyOperations");
class EthereumKeyPair {
    constructor(keyGenerator = new KeyGenerator_1.PrivateKeyGenerator(), existingPrivateKey) {
        if (existingPrivateKey) {
            this.privateKey = existingPrivateKey;
        }
        else {
            this.privateKey = keyGenerator.generateKey();
        }
        this.publicAddress = EthereumKeyOperations_1.EthereumKeyOperations.getPublicAddress(this.privateKey);
    }
    signMessage(message) {
        return EthereumKeyOperations_1.EthereumKeyOperations.signMessage(message, this.privateKey);
    }
    getPublicAddress() {
        return this.publicAddress;
    }
    getPrivateAddress() {
        return this.privateKey;
    }
}
exports.EthereumKeyPair = EthereumKeyPair;
