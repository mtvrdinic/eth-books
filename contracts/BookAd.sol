pragma solidity ^0.5.0;

contract BookAd {
    
    // Important variables 
    uint public bookID;
    
    uint private bookPrice;
    
    address payable owner;
    
    address payable buyerAddr;
    
    // Is true if book was ordered
    bool private order = false;
    
    // Is true if owner sent the book
    bool private sent = false;
    
    // Is true if the buyer received the book
    bool private shipment = false;
    
    
    modifier isActive {
        require (!order);
        _;
    }
    
    modifier isOwner {
        require (owner == msg.sender);
        _;
    }
    
    modifier isBuyer {
        require (buyerAddr == msg.sender);
        _;
    }
    
    // The smart contract's constructor
    constructor (uint _bookID, uint _bookPrice) public {
        
        // No empty values
        require(_bookID > 0);
        require(_bookPrice > 0);

        // The seller is the contract's owner
        owner = msg.sender;
        
        // Book information
        bookID = _bookID;
        
        // Price has to be set in Eth
        bookPrice = _bookPrice * 1e18;

    }
    
    // Event triggered for new order
    event OrderSent(address buyer, uint money);
    
    // Event triggered for price change
    event PriceUpdate(uint _price);
    
    // Event triggered for shipment confirmation
    event ShipmentConfirmed(uint _now);
    
    // Event triggered when order gets canceled
    event OrderCanceled(address _buyer, uint _now);
    
    // Event triggered when book gets sent
    event BookSent(address _owner);
    
    // The function to send purchase orders
    //   requires fee
    //   Payable functions returns just the transaction object, with no custom field.
    //   To get field values listen to OrderSent event.
    function sendOrder() payable public isActive{
        
        // Owner not allowed
        require (owner != msg.sender);
        
        //Value sent to the contract has to match book price
        require (msg.value >= bookPrice, "Insufficient funds.");
        
        //Return ether if overpaid
        msg.sender.transfer(msg.value - bookPrice);
        
        // Buyer found
        buyerAddr = msg.sender;
        order = true;
        
        // Trigger the event
        emit OrderSent(msg.sender, msg.value);

    }
    
    // The function to cancel ongoing order
    // Funds get returned to buyerAddr
    function cancelOrder () payable public isBuyer {
        
        // Order can not be canceled if the book has alredy been sent
        require(!sent);
        
        // Returning money to the buyer
        buyerAddr.transfer(bookPrice);
        
        // Reseting contract
        order = false;
        
        // Trigger the event
        emit OrderCanceled(msg.sender, now);
        
    }
    
    // The function to confirm shipping
    // Once confirmed, funds get transfered - payable
    // Only buyer can confirm it, cannot be called before ordering
    function confirmShipment() payable public isBuyer {
                
        // Update the bool
        shipment = true;
        
        // Funds get transfered to ex owner of the book
        owner.transfer(bookPrice);
        
        // Trigger the event
        emit ShipmentConfirmed(now);
        
    }
    
    
    // Say that book has been shipped
    // Only owner can call it, but not before order
    function bookSent () public isOwner {
        
        // Is there an order?
        require(order);
        
        // Update the bool
        sent = true;
        
        // Trigger the event
        emit BookSent(msg.sender);
        
    }
    
    
    // Editing book price
    function newPrice (uint _price) public isOwner {
        require(!order);

        bookPrice = _price * 1e18;
        
        // Trigger the event
        emit PriceUpdate(bookPrice);
    }   
      
    
    // Price getter
    function getPrice () public view returns (uint) {
        return bookPrice;
    }
    
    // Get status
    function getStatus () public view returns (bool) {
        return order;
    }
}