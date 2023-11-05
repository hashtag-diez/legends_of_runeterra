// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


import "./Card.sol";

contract Collection {
  struct CardStruct {
    address add;
    string id;
  }

  CardStruct[] public cards;
  string public name;
  int256 public cardCount;

  constructor(string memory _name) {
    name = _name;
    cardCount = 0;
  }

  function get_name() public view returns(string memory){
    return name;
  }
  function add_to_collection(Card c) external {
    cards.push(CardStruct(address(c), c.get_id()));
    cardCount++;
  }
  function get_cards() public view returns(CardStruct[] memory){
    return cards;
  }
  
}
