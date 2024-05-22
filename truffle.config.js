const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();

const {
  MNEMONIC,
  INFURA_BSC_TESTNET_PROVIDER,
  INFURA_BSC_PROVIDER,
  INFURA_ETHEREUM_PROVIDER,
  INFURA_ETHEREUM_TESTNET_PROVIDER,
} = process.env;

module.exports = {
  networks: {
    bsc_testnet: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: MNEMONIC,
          },
          providerOrUrl: INFURA_BSC_TESTNET_PROVIDER,
        }),
      network_id: 97,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true,
      networkCheckTimeout: 1000000,
    },
    bsc: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: MNEMONIC,
          },
          providerOrUrl: INFURA_BSC_PROVIDER,
        }),
      network_id: 56,
      gasPrice: 20000000000,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true,
      networkCheckTimeout: 1000000,
    },
    ethereum_testnet: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: MNEMONIC,
          },
          providerOrUrl: INFURA_ETHEREUM_TESTNET_PROVIDER,
        }),
      network_id: 11155111,
      gasPrice: 1000000000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      networkCheckTimeout: 1000000,
    },
    ethereum: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: MNEMONIC,
          },
          providerOrUrl: INFURA_ETHEREUM_PROVIDER,
        }),
      network_id: 1,
      gasPrice: 1000000000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      networkCheckTimeout: 1000000,
    },
  },
  compilers: {
    solc: {
      version: "0.8.9",
    },
  },
};
