const BlockStore = artifacts.require("BlockStore");
const blockStoreInstance = await BlockStore.deployed();

class PrductModel {
  async createProduct(_sender, _name, _price) {
    await blockStoreInstance.createProduct(_name, _price, {
      from: _sender,
    });
  }

  async buyProduct(_sender, _productId) {
    await blockStoreInstance.buyProduct(_productId, {
      from: _sender,
    });
  }

  async returnProduct(_sender, _productId) {
    await blockStoreInstance.returnProduct(_productId, {
      from: _sender,
    });
  }
}

export default new PrductModel();
