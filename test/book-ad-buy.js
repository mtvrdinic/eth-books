const BookAd = artifacts.require("BookAd");

contract("Testing BookAd FullBuy - 10eth", async accounts => {
	
	it("should cancel order correctly", async () => {
		let instance = await BookAd.deployed();

		// Starting balances
		let ownerBalance = await web3.eth.getBalance(accounts[0]);
		let buyerBalance = await web3.eth.getBalance(accounts[1]);

		// Price of the book in ether
		let price = await instance.getPrice.call();
		price = web3.utils.fromWei(price);

		// Status should be false, no order yet
		let status = await instance.getStatus.call();
		assert.equal(status, false);

		// Sending order 
		await instance.sendOrder({from: accounts[1], value: 1e19});	

		// Status should've changed - to true
		status = await instance.getStatus.call();
		assert.equal(status, true);

		// Owner calls bookSent function
		await instance.bookSent({from: accounts[0]});

		// Canceling order should fail
		//await instance.cancelOrder({from: accounts[1]});

		// Shipment confirmation
		await instance.confirmShipment({from: accounts[1]});

		// Check if funds got transfered successfully
		let ownerBalanceNew = await web3.eth.getBalance(accounts[0]);
		let buyerBalanceNew = await web3.eth.getBalance(accounts[1]);

		console.log('\townerBalance = '+web3.utils.fromWei(ownerBalance)+ '\n' + 
             		'\tbuyerBalance = '+web3.utils.fromWei(buyerBalance)+  '\n' + 
             		'\townerBalanceNew = '+web3.utils.fromWei(ownerBalanceNew)+ '\n' +  
             		'\tbuyerBalanceNew = '+web3.utils.fromWei(buyerBalanceNew));
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