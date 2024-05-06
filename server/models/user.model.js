const BlockStore = artifacts.require("BlockStore");
const blockStoreInstance = await BlockStore.deployed();
const argon2 = require("argon2");

class UserModel {
  async createUser(_sender, _userAddress, _role, _password) {
    const hashedPassword = argon2.hash(_password);
    await blockStoreInstance.createUser(_userAddress, _role, hashedPassword, {
      from: _sender,
    });
  }

  async createAdmin(_sender, _userAddress, _password) {
    const hashedPassword = argon2.hash(_password);
    await blockStoreInstance.createAdmin(_userAddress, hashedPassword, {
      from: _sender,
    });
  }
}

export default new UserModel();
