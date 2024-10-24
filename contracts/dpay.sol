// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CardStorage {
    struct CardDetails {
        string cardTokenId;
        string last4;
        uint8 expMonth;
        uint16 expYear;
        string status;
    }

    mapping(address => CardDetails) public userCards;

    
    event CardRegistered(address indexed user, string cardTokenId, string last4, uint8 expMonth, uint16 expYear, string status);


    function registerCard(
        string memory _cardTokenId,
        string memory _last4,
        uint8 _expMonth,
        uint16 _expYear,
        string memory _status
    ) public {
        CardDetails memory newCard = CardDetails({
            cardTokenId: _cardTokenId,
            last4: _last4,
            expMonth: _expMonth,
            expYear: _expYear,
            status: _status
        });

        userCards[msg.sender] = newCard;

        emit CardRegistered(msg.sender, _cardTokenId, _last4, _expMonth, _expYear, _status);
    }

    
    function getCardDetails(address _user) public view returns (CardDetails memory) {
        return userCards[_user];
    }
}
