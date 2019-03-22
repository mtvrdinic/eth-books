const BookAd = artifacts.require("BookAd");

contract("Testing BookAd Functions", async accounts => {
	
	it("should return price of the book", async () => {
		let instance = await BookAd.deployed();
		let price = await instance.getPrice.call({from: accounts[1]});

		assert.equal(price.valueOf() / 1e18, 10);		
	});

	
	// Status getter
	it("should return status as false", async () => {
		let instance = await BookAd.deployed();
		let status = await instance.getStatus.call();

		assert.equal(status, false);
	})

	
	it("should send order", async () => {
		let instance = await BookAd.deployed();
		
		await instance.sendOrder({from: accounts[1], value: 1e19});
		
		/*
		// Check if funds get transfered from account to contract
		let balance = await web3.eth.getBalance(accounts[1]);
		assert.equal(web3.utils.fromWei(balance), '90');
		*/		
	});

	
	// Status should've changed
	it("should return status as true", async () => {
		let instance = await BookAd.deployed();
		let status = await instance.getStatus.call();

		assert.equal(status, true);
	})


	it("should cancel order or", async () => {
		let instance = await BookAd.deployed();
		
		await instance.cancelOrder({from: accounts[1]});	
	});

	it("should say the book is sent", async () => {
		let instance = await BookAd.deployed();

		await instance.sendOrder({from: accounts[1], value: 1e19});
		await instance.bookSent({from: accounts[0]});
	});	
	

	it("should confirm shipment", async () => {
		let instance = await BookAd.deployed();

		await instance.confirmShipment({from: accounts[1]});
	});	


});



/*
Available Accounts example
==================
(0) 0xe92cc55226778419c55a858ea4be672c4693205d (~100 ETH)
(1) 0x3168aef28c9c6cc36c042beccab13c0580e9afa7 (~100 ETH)
(2) 0x5d470faa8a1ab593878b6dd982e910a9a1d6883e (~100 ETH)
(3) 0x5b971ec2d5eec59db29660cb925222efcddef048 (~100 ETH)
(4) 0x286ebd1be07c8477e5384be12d9982022717d004 (~100 ETH)
(5) 0xa2d0c58485a112304b015f861827993e19790734 (~100 ETH)
(6) 0x9928bba3efdfb28489d37f252d8f726ad221731a (~100 ETH)
(7) 0xe6b2ecf78da1d4024a6fe942ce741cb635f32e16 (~100 ETH)
(8) 0x40e432c40ad9ace3242434a9c7dea7992ff8cffc (~100 ETH)
(9) 0x98f44d3738e86a29c014913cac31d02ac7aa84b3 (~100 ETH)
*/