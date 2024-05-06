const BlockStore = artifacts.require("BlockStore");
const blockStoreInstance = await BlockStore.deployed();

class StoreModel {
  async createStore(_sender, _storeAddress, _name) {
    await blockStoreInstance.createStore(_storeAddress, _name, {
      from: _sender,
    });
  }

  async removeStore(_sender, _storeAddress, _name) {
    await blockStoreInstance.removeStore(_storeAddress, _name, {
      from: _sender,
    });
  }
}

export default new StoreModel();
