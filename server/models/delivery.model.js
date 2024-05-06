const BlockStore = artifacts.require("BlockStore");
const blockStoreInstance = await BlockStore.deployed();

class DeliveryModel {
  async createDeliveryRequest(_sender, _receiver, _productId) {
    await blockStoreInstance.createDeliveryRequest(_receiver, _productId, {
      from: _sender,
    });
  }

  async confirmDelivery(_sender, _requestId) {
    await blockStoreInstance.confirmDelivery(_requestId, {
      from: _sender,
    });
  }
}

export default new DeliveryModel();
