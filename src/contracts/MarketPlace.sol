pragma solidity ^0.5.0;

contract MarketPlace {
    string public name;
    uint public productCount = 0;
    mapping(uint => Product) public products;

    struct Product {
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
    }

    event ProductCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    event ProductPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    constructor() public {
        name = "Gozlite Market Place";
    }

    function createProduct(string memory _name, uint _price) public {
        // Validate _name
        require(bytes(_name).length > 0);
        // Validate _price
        require(_price > 0);
        // Increment productCount
        productCount++;
        // Create the product
        products[productCount] = Product(productCount, _name, _price, msg.sender, false);
        // Triiger event
        emit ProductCreated(productCount, _name, _price, msg.sender, false);
    }

    function purchaseProduct(uint _id) public payable{
        // Fetch product
        Product memory _product = products[_id];
        // Fetch seller
        address payable _seller = _product.owner;
        // Make sure the product has a valid id
        require(_product.id > 0 && _product.id <= productCount);
        // Ensure that the Ether is enough
        require(msg.value >= _product.price);
        // Require that the product has not been purchased
        require(!_product.purchased);
        // Require that the buyer is not the seller
        require(_seller != msg.sender);
        // Transfer ownership
        _product.owner = msg.sender;
        // Mark as purchased
        _product.purchased = true;
        // Update blockchain record
        products[_id] = _product;
        // Pay seller
        address(_seller).transfer(msg.value);
        // Trigger an event
        emit ProductPurchased(_id, _product.name, _product.price, msg.sender, true);
    }
}