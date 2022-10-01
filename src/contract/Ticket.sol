// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract Ticketon {
    //Variable used as the index to store all tickets
    uint256 internal ticketsLength = 0;

    //Address of the cUSD erc-20 token
    address internal constant cUsdTokenAddress =
       0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    struct Ticket {
        address payable owner;
        string image;
        string fixture;
        string venue;
        uint256 price;
        bool forSale;
    }

    //Event that will emit when a new ticket is uploaded
    event newTick(address indexed owner, uint256 index);

    //Even that will emit when a ticket is bought
    event ticketBought(
        address indexed seller,
        uint256 index,
        uint256 price,
        address indexed buyer
    );

    //Mapping that assigns index to all tickets
    mapping(uint256 => Ticket) internal tickets;

    //Modifier that allows only the owner of the ticket to access the functions
    modifier onlyOwner(uint256 _index) {
        require(
            msg.sender == tickets[_index].owner,
            "Only the owner can access this function"
        );
        _;
    }

    modifier checkPrice(uint256 _price) {
        require(_price > 0, "Price needs to be at least one wei");
        _;
    }

    /// @dev Function used to add ticket
    function newTicket(
        string calldata _image,
        string calldata _fixture,
        string calldata _venue,
        uint256 _price
    ) public checkPrice(_price) {
        require(bytes(_image).length > 0, "Empty image");
        require(bytes(_fixture).length > 0, "Empty fixture");
        require(bytes(_venue).length > 0, "Empty venue");

        uint index = ticketsLength;
        Ticket storage tic = tickets[index];
        ticketsLength++;

        tic.owner = payable(msg.sender);
        tic.image = _image;
        tic.fixture = _fixture;
        tic.venue = _venue;
        tic.price = _price;

        emit newTick(msg.sender, index);
    }

    //Returns all the tickets by index
    function getTicket(uint256 _index)
        public
        view
        returns (
            address payable,
            string memory,
            string memory,
            string memory,
            uint256,
            bool
        )
    {
        return (
            tickets[_index].owner,
            tickets[_index].image,
            tickets[_index].fixture,
            tickets[_index].venue,
            tickets[_index].price,
             tickets[_index].forSale
        );
    }

    /// @dev Function using which the owner can change the price of the ticket
    function updateTicketCost(uint256 _index, uint256 _price)
        public
        onlyOwner(_index)
        checkPrice(_price)
    {
        tickets[_index].price = _price;
    }

    /// @dev Function using which the owner can change the for sale status of the ticket making it viable for reselling
    function toggleSaleStatus(uint256 _index) public onlyOwner(_index) {
        tickets[_index].forSale = !tickets[_index].forSale;
    }

    /// @dev Function which a use can use to buy the ticket and become the owner of that ticket
    function buyTicket(uint256 _index) public payable {
        Ticket storage currentTicket = tickets[_index];
        require(currentTicket.forSale == true);
        require(
            currentTicket.owner != msg.sender,
            "You can't buy your own ticket"
        );

        address previousOwner = currentTicket.owner;
        currentTicket.owner = payable(msg.sender);
        currentTicket.forSale = false;
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                previousOwner,
                currentTicket.price
            ),
            "Transfer failed."
        );
        emit ticketBought(
            previousOwner,
            _index,
            currentTicket.price,
            msg.sender
        );
    }

    /// @dev Function that returns the total number of ticket
    function getticketsLength() public view returns (uint256) {
        return (ticketsLength);
    }
}