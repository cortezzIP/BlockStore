const BlockStore = artifacts.require("BlockStore");
const blockStoreInstance = await BlockStore.deployed();

class RoleModel {
  async createRequestRoleChange(_sender, _desiredRole) {
    await blockStoreInstance.createRequestRoleChange(_desiredRole, {
      from: _sender,
    });
  }

  async approveRoleChange(_sender, _userAddress) {
    await blockStoreInstance.approveRoleChange(_userAddress, {
      from: _sender,
    });
  }

  async rejectRoleChange(_sender, _userAddress) {
    await blockStoreInstance.rejectRoleChange(_userAddress, {
      from: _sender,
    });
  }
}

export default new RoleModel();
