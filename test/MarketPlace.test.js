const MarketPlace = artifacts.require("./MarketPlace.sol");

require('chai')
    .use(require('chai-as-promised'))
        .should();

contract('MarketPlace', ([deployer, seller, buyer]) => {
    let marketPlace;

    before(async () => {
        marketPlace = await MarketPlace.deployed();
    });

    describe('Deployment', async () => {
        it('deployed successfully', async () => {
            let address = await marketPlace.address;

            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        });

        it('has a name', async () => {
            let name = await marketPlace.name();

            assert.equal(name, 'Gozlite Market Place');
        });
    });

    describe('Products', async () => {
        let result, productCount;

        before(async () => {
            result = await marketPlace.createProduct('Lenovo 350x', web3.utils.toWei('1', 'Ether'), { from: seller });
            productCount = await marketPlace.productCount();
        });

        it('was created successfully', async () => {
            // SUCCESS
            assert.equal(productCount, 1);
            const event = result.logs[0].args;

            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct');
            assert.equal(event.name, 'Lenovo 350x', 'name is correct');
            assert.equal(event.price, '1000000000000000000', 'price is correct');
            assert.equal(event.owner, seller, 'owner is correct');
            assert.equal(event.purchased, false, 'purchased is correct');

            //FAILURE - Product must have name
            await marketPlace.createProduct('', web3.utils.toWei('1', 'Ether'), { from: seller }).should.be.rejected;
            //FAILURE - Product must have price
            await marketPlace.createProduct('Lenovo 350x', 0, { from: seller }).should.be.rejected;
        });

        it('list products', async () => {
            let product = await marketPlace.products(productCount);

            assert.equal(product.id.toNumber(), productCount.toNumber(), 'id is correct');
            assert.equal(product.name, 'Lenovo 350x', 'name is correct');
            assert.equal(product.price, '1000000000000000000', 'price is correct');
            assert.equal(product.owner, seller, 'owner is correct');
            assert.equal(product.purchased, false, 'purchased is correct');
        });

        it('sell product', async () => {
            let oldSellerBalance = await web3.eth.getBalance(seller);
            oldSellerBalance = new web3.utils.BN(oldSellerBalance);

            let result = await marketPlace.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('1', 'Ether') });

            const event = result.logs[0].args;
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct');
            assert.equal(event.name, 'Lenovo 350x', 'name is correct');
            assert.equal(event.price, '1000000000000000000', 'price is correct');
            assert.equal(event.owner, buyer, 'owner is correct');
            assert.equal(event.purchased, true, 'purchased is correct');

            let newSellerBalance = await web3.eth.getBalance(seller);
            newSellerBalance = new web3.utils.BN(newSellerBalance);

            let price = web3.utils.toWei('1', 'Ether')
            price = new web3.utils.BN(price);

            const expectedBalance = oldSellerBalance.add(price);

            assert.equal(newSellerBalance.toString(), expectedBalance.toString());

            // FAILURE: Tries to buy a product that doesn't exist
            await marketPlace.purchaseProduct(99, { from: buyer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
            // FAILURE: Tries to buy a product without enough Ether
            await marketPlace.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('0.8', 'Ether') }).should.be.rejected;
            // FAILURE: Deployer tries to buy the product
            await marketPlace.purchaseProduct(productCount, { from: deployer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
            // FAILURE: Seller tries to buy the product
            await marketPlace.purchaseProduct(productCount, { from: seller, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
            
        });
    });
});