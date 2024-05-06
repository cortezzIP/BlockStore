const BlockStore = artifacts.require("BlockStore");

contract("BlockStore", (accounts) => {
  it("should create a user", async () => {
    const blockStoreInstance = await BlockStore.deployed();
    const userAddress = accounts[5];
    const role = 1; // Seller
    const password = "password123";

    await blockStoreInstance.createUser(userAddress, role, password, {
      from: accounts[0],
    });

    const user = await blockStoreInstance.users(userAddress);
    assert.equal(user.role.toNumber(), role, "User role is incorrect");
    assert.equal(user.userAddress, userAddress, "User address is incorrect");
    assert.equal(user.password, password, "User password is incorrect");
    assert.isTrue(user.isRegistered, "User is not registered");
  });

  it("should create a store", async () => {
    const blockStoreInstance = await BlockStore.deployed();
    const storeName = "My Store";
    const storeAddress = "0x893D23930E2fe3708e0c733729DcB185b47bbc97";

    await blockStoreInstance.createStore(storeAddress, storeName, {
      from: accounts[0],
    });

    const store = await blockStoreInstance.stores(storeAddress);
    assert.equal(store.name, storeName, "Store name is incorrect");
    assert.equal(store.owner, storeAddress, "Store owner is incorrect");
  });

  it("should allow a buyer to buy a product", async () => {
    const blockStoreInstance = await BlockStore.deployed();
    const productName = "Product 1";
    const receiver = accounts[3];
    let productId = 1;
    const productPrice = web3.utils.toWei("1", "ether");

    await blockStoreInstance.createProduct(productName, productPrice, {
      from: accounts[1],
    });

    await blockStoreInstance.createDeliveryRequest(receiver, productId, {
      from: accounts[1],
    });

    const requestCount = await blockStoreInstance.requestCount();

    const deliveryRequest = await blockStoreInstance.deliveryRequests(
      requestCount
    );

    await blockStoreInstance.confirmDelivery(requestCount, {
      from: deliveryRequest.sender,
    });

    await blockStoreInstance.buyProduct(productId, {
      from: accounts[2],
      value: productPrice,
    });

    const product = await blockStoreInstance.products(productId);
    assert.isFalse(
      product.isAvailable,
      "Product should not be available after purchase"
    );
  });

  it("should allow a user to request a role change", async () => {
    const blockStoreInstance = await BlockStore.deployed();
    const desiredRole = 2; // Buyer

    await blockStoreInstance.createRequestRoleChange(desiredRole, {
      from: accounts[1],
    });

    const request = await blockStoreInstance.roleChangeRequests(accounts[1]);
    assert.equal(
      request.desiredRole.toNumber(),
      desiredRole,
      "Desired role is incorrect"
    );
    assert.equal(
      request.reqStatus.toNumber(),
      2,
      "Request status should be Waiting"
    );
  });

  it("should allow a user to create a delivery request", async () => {
    const blockStoreInstance = await BlockStore.deployed();
    const receiver = accounts[2];
    const productId = 1; // Предполагается, что продукт уже создан

    await blockStoreInstance.createDeliveryRequest(receiver, productId, {
      from: accounts[1],
    });

    const requestCount = await blockStoreInstance.requestCount();
    const deliveryRequest = await blockStoreInstance.deliveryRequests(
      requestCount
    );

    assert.equal(
      deliveryRequest.sender,
      accounts[1],
      "Sender address is incorrect"
    );
    assert.equal(
      deliveryRequest.receiver,
      receiver,
      "Receiver address is incorrect"
    );
    assert.equal(
      deliveryRequest.productId,
      productId,
      "Product ID is incorrect"
    );
    assert.isFalse(
      deliveryRequest.isDelivered,
      "Delivery should not be confirmed initially"
    );
  });

  it("should allow the sender or receiver to confirm delivery", async () => {
    const blockStoreInstance = await BlockStore.deployed();
    const requestCount = await blockStoreInstance.requestCount();
    const deliveryRequest = await blockStoreInstance.deliveryRequests(
      requestCount
    );

    await blockStoreInstance.confirmDelivery(requestCount, {
      from: deliveryRequest.sender,
    });

    let updatedDeliveryRequest = await blockStoreInstance.deliveryRequests(
      requestCount
    );

    assert.isTrue(
      updatedDeliveryRequest.isDelivered,
      "Delivery should be confirmed by sender"
    );
  });

  it("should allow an admin to create another admin", async () => {
    const blockStoreInstance = await BlockStore.deployed();
    const newAdminAddress = accounts[4];
    const password = "newAdminPassword";

    await blockStoreInstance.createAdmin(newAdminAddress, password, {
      from: accounts[0],
    });

    const newAdmin = await blockStoreInstance.users(newAdminAddress);
    assert.equal(newAdmin.role.toNumber(), 0, "New admin role should be Admin");
    assert.equal(
      newAdmin.userAddress,
      newAdminAddress,
      "New admin address is incorrect"
    );
    assert.equal(
      newAdmin.password,
      password,
      "New admin password is incorrect"
    );
    assert.isTrue(newAdmin.isRegistered, "New admin should be registered");
  });

  it("should allow an admin to remove a store", async () => {
    const blockStoreInstance = await BlockStore.deployed();
    const storeAddress = "0x84d1973bF50e542538D6da5Acf40276cc911b5Ba";

    await blockStoreInstance.createStore(storeAddress, "Test Store", {
      from: accounts[0],
    });
    await blockStoreInstance.removeStore(storeAddress, { from: accounts[0] });

    const store = await blockStoreInstance.stores(storeAddress);
    assert.equal(
      store.owner,
      "0x0000000000000000000000000000000000000000",
      "Store owner should be reset to zero address"
    );

    const user = await blockStoreInstance.users(storeAddress);
    assert.equal(
      user.role.toNumber(),
      2,
      "User role should be changed to Buyer"
    );
  });

  it("should allow a seller to create a product", async () => {
    const blockStoreInstance = await BlockStore.deployed();
    const productName = "Test Product";
    const productPrice = web3.utils.toWei("1", "ether");

    await blockStoreInstance.createProduct(productName, productPrice, {
      from: accounts[1],
    });

    const productCount = await blockStoreInstance.productCount();
    const product = await blockStoreInstance.products(productCount);
    assert.equal(product.name, productName, "Product name is incorrect");
    assert.equal(product.price, productPrice, "Product price is incorrect");
    assert.equal(product.seller, accounts[1], "Product seller is incorrect");
    assert.isFalse(product.isAvailable, "Product shouldn't be available");
  });

  it("should allow a buyer to return a product", async () => {
    const blockStoreInstance = await BlockStore.deployed();
    const receiver = accounts[3];
    const productId = 3;

    const productName = "Product 2";
    const productPrice = web3.utils.toWei("1", "ether");

    await blockStoreInstance.createProduct(productName, productPrice, {
      from: accounts[1],
    });

    await blockStoreInstance.createDeliveryRequest(receiver, productId, {
      from: accounts[1],
    });

    const requestCount = await blockStoreInstance.requestCount();

    const deliveryRequest = await blockStoreInstance.deliveryRequests(
      requestCount
    );

    await blockStoreInstance.confirmDelivery(requestCount, {
      from: deliveryRequest.sender,
    });

    await blockStoreInstance.buyProduct(productId, {
      from: accounts[2],
      value: productPrice,
    });
    await blockStoreInstance.returnProduct(productId, {
      from: accounts[2],
      value: productPrice,
    });

    const product = await blockStoreInstance.products(productId);
    assert.isTrue(
      product.isAvailable,
      "Product should be available after return"
    );
  });

  it("should allow an admin to reject a role change request", async () => {
    const blockStoreInstance = await BlockStore.deployed();
    const userAddress = accounts[2];
    const desiredRole = 1; // Seller

    await blockStoreInstance.createRequestRoleChange(desiredRole, {
      from: userAddress,
    });
    await blockStoreInstance.rejectRoleChange(userAddress, {
      from: accounts[0],
    });

    const request = await blockStoreInstance.roleChangeRequests(userAddress);
    assert.equal(
      request.reqStatus.toNumber(),
      1,
      "Request status should be Rejected"
    );
  });

  it("should allow an admin to approve a role change request", async () => {
    const blockStoreInstance = await BlockStore.deployed();
    const userAddress = accounts[2];
    const desiredRole = 1; // Seller

    await blockStoreInstance.createRequestRoleChange(desiredRole, {
      from: userAddress,
    });
    await blockStoreInstance.approveRoleChange(userAddress, {
      from: accounts[0],
    });

    const user = await blockStoreInstance.users(userAddress);
    assert.equal(
      user.role.toNumber(),
      desiredRole,
      "User role should be updated to Seller"
    );
  });
});
