const BlockStore = artifacts.require("BlockStore");

module.exports = function (deployer) {
  deployer.deploy(BlockStore);
};
