// SPDX-License-Identifier: ISC
pragma solidity >=0.4.22 <0.9.0;

contract BlockStore {
    enum Role {
        Admin,
        Seller,
        Buyer,
        Supplier
    }

    enum ReqStatus {
        Approved,
        Rejected,
        Waiting
    }

    struct User {
        Role role;
        address userAddress;
        string password;
        bool isRegistered;
    }

    struct Store {
        address owner;
        uint rating;
        string name;
        uint balance;
    }

    struct Product {
        uint id;
        string name;
        uint price;
        address seller;
        bool isAvailable;
    }

    struct RoleChangeRequest {
        address userAddress;
        Role currentRole;
        Role desiredRole;
        ReqStatus reqStatus;
    }

    struct DeliveryRequest {
        address sender;
        address receiver;
        uint productId;
        bool isDelivered;
    }

    mapping(address => User) public users;
    mapping(address => Store) public stores;
    mapping(uint => Product) public products;
    
    mapping(address => RoleChangeRequest) public roleChangeRequests;
    mapping(uint => DeliveryRequest) public deliveryRequests;

    uint public productCount;
    uint public requestCount;

    constructor() {
        users[0x627306090abaB3A6e1400e9345bC60c78a8BEf57] = User(Role.Admin, 0x627306090abaB3A6e1400e9345bC60c78a8BEf57, 'adminpass', true);
        users[0xf17f52151EbEF6C7334FAD080c5704D77216b732] = User(Role.Seller, 0xf17f52151EbEF6C7334FAD080c5704D77216b732, 'adminpass', true);
        users[0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef] = User(Role.Buyer, 0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef, 'adminpass', true);
    }

    modifier onlyAdmin() {
        require(users[msg.sender].role == Role.Admin, "Only admin can perform this action");
        _;
    }

    modifier onlySeller() {
        require(users[msg.sender].role == Role.Seller, "Only seller can perform this action");
        _;
    }

    modifier onlyBuyer() {
        require(users[msg.sender].role == Role.Buyer, "Only buyer can perform this action");
        _;
    }

    modifier onlySupplier() {
        require(users[msg.sender].role == Role.Supplier, "Only supplier can perform this action");
        _;
    }

    function createUser(address _userAddress, Role _role, string memory _password) public {
        require(!users[_userAddress].isRegistered, "User already registered");
        users[_userAddress] = User(_role, _userAddress, _password, true);
    }

    function createStore(address _storeAddress, string memory _name) public onlyAdmin {
        stores[_storeAddress] = Store(_storeAddress, 0, _name, 0);
    }

    function createAdmin(address _adminAddress, string memory _password) public onlyAdmin {
        require(!users[_adminAddress].isRegistered, "User already registered, update his role");
        users[_adminAddress] = User(Role.Admin, _adminAddress, _password, true);
    }

    function removeStore(address _storeAddress) public onlyAdmin {
        require(stores[_storeAddress].owner != address(0), "Store does not exist");
        delete stores[_storeAddress];

        users[_storeAddress].role = Role.Buyer;
    }

    function createProduct(string memory _name, uint _price) public onlySeller {
        productCount++;
        products[productCount] = Product(productCount, _name, _price, msg.sender, false);
    }

    function buyProduct(uint _productId) public payable onlyBuyer {
        Product memory product = products[_productId];
        require(product.id != 0, "Product doesn't exist");
        require(product.isAvailable, "Product is not available");
        require(msg.value >= product.price, "Not enough Ether provided");

        payable(product.seller).transfer(msg.value);
        products[_productId].isAvailable = false;
    }

    function returnProduct(uint _productId) public payable onlyBuyer {
        Product storage product = products[_productId];
        require(!product.isAvailable, "Product is not available for return");

        payable(msg.sender).transfer(product.price);

        products[_productId].isAvailable = true;
    }

    function createRequestRoleChange(Role _desiredRole) public {
        require(users[msg.sender].role != _desiredRole, "You already have the desired role");
        roleChangeRequests[msg.sender] = RoleChangeRequest(msg.sender, users[msg.sender].role, _desiredRole, ReqStatus.Waiting);
    }

    function approveRoleChange(address _userAddress) public onlyAdmin {
        RoleChangeRequest storage request = roleChangeRequests[_userAddress];
        require(request.reqStatus == ReqStatus.Waiting, "The application has already been reviewed");
        users[_userAddress].role = request.desiredRole;
        request.reqStatus = ReqStatus.Approved;
    }

    function rejectRoleChange(address _userAddress) public onlyAdmin {
        RoleChangeRequest storage request = roleChangeRequests[_userAddress];
        require(request.reqStatus == ReqStatus.Waiting, "The application has already been reviewed");
        request.reqStatus = ReqStatus.Rejected;
    }

    function createDeliveryRequest(address _receiver, uint _productId) public {
        requestCount++;
        deliveryRequests[requestCount] = DeliveryRequest(msg.sender, _receiver, _productId, false);
    }

    function confirmDelivery(uint _requestId) public {
        DeliveryRequest storage request = deliveryRequests[_requestId];
        Product storage product = products[request.productId];
        
        require(!request.isDelivered, "Request is already confirmed");
        require(msg.sender == request.sender || msg.sender == request.receiver, "Only sender or receiver can confirm delivery");
        require(!product.isAvailable, "Product is already available");

        products[request.productId].isAvailable = true;
        deliveryRequests[_requestId].isDelivered = true;
    }
}
