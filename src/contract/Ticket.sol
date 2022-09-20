 // SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
  function transfer(address, uint256) external returns (bool);
  function approve(address, uint256) external returns (bool);
  function transferFrom(address, address, uint256) external returns (bool);
  function totalSupply() external view returns (uint256);
  function balanceOf(address) external view returns (uint256);
  function allowance(address, address) external view returns (uint256);

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract  Ticketon {

    //Variable used as the index to store all artworks
    uint internal ticketsLength = 0;

    //Address of the cUSD erc-20 token
    address internal constant cUsdTokenAddress = 0x686c626E48bfC5DC98a30a9992897766fed4Abd3;

    struct  Ticket {
        address payable owner;
        string image;
        string fixture;
        string venue;
        uint price;
        
        bool forSale;  
    }

    //Event that will emit when a new art is uploaded
    event newTick(address indexed owner, uint index);

    //Even that will emit when an art is bought
    event ticketBought(address indexed seller, uint index, uint price, address indexed buyer);

    //Mapping that assigns index to all tickets
    mapping (uint =>  Ticket) internal tickets;

    //Modifier that allows only the owner of the ticket to access the functions
    modifier onlyOwner(uint _index){
        require(msg.sender == tickets[_index].owner, "Only the owner can access this function");
        _;
    }

    //Function used to add ticket 
    function  newTicket(
        string memory _image,
        string memory _fixture, 
        string memory _venue, 
        uint _price
    ) public {
        Ticket storage tic = tickets[ticketsLength];

        tic.owner = payable(msg.sender);
        tic.image = _image;
        tic.fixture = _fixture;
        tic.venue = _venue;
        tic.price = _price;
 
        emit newTick(msg.sender, ticketsLength);
        ticketsLength++;
    }

    //Returns all the tickets by index
    function getTicket(uint _index) public view returns (
        address payable,
        string memory, 
        string memory, 
        string memory, 
        uint
        
    ) {
        return (
            tickets[_index].owner,
            tickets[_index].image, 
            tickets[_index].fixture,  
            tickets[_index].venue,
            tickets[_index].price
            
        );
    }

   
    //Function using which the owner can change the price of the ticket making it viable for reselling
     function updateTicketCost(
        uint256 _index,
        uint _price
    ) public onlyOwner(_index){
        tickets[_index].price = _price;
    }


    //Function which a use can use to buy the ticket and be the owner of that ticket
    function buyTicket(uint _index) public payable  {
        require(tickets[_index].forSale == true);
        require(
          IERC20Token(cUsdTokenAddress).transferFrom(
            msg.sender,
            tickets[_index].owner,
            tickets[_index].price
          ),
          "Transfer failed."
        );

         tickets[_index].owner = payable(msg.sender);

        emit ticketBought(tickets[_index].owner, _index, tickets[_index].price, msg.sender);
         
    }
 
    

    //Function that returns the total number of ticket 
    function getticketsLength() public view returns (uint) {
        return (ticketsLength);
    }
}