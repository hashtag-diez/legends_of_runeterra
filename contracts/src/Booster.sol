// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Card.sol";
import "hardhat/console.sol";

contract Booster is Ownable, ERC721URIStorage {
    
  uint256 private _token_id;
  uint256 private _cards_id;
  string public _type;
  string[] private cards;

  constructor(uint256 id, string memory type_, uint256 card_id) ERC721("MyBooster", "Booster") Ownable(msg.sender) {
    _token_id = id;
    _type = type_;
    _cards_id = card_id;
  }

  function get_type() public view returns(string memory){
    return _type;
  }

  function mint(
    address user,
    string memory _tokenURI
  ) external onlyOwner returns (bool) {
    _safeMint(user, _token_id);
    _setTokenURI(_token_id, _tokenURI);
    return true;
  }

  function set_cards(
    string[] memory cards_
  ) external onlyOwner {
    cards = cards_;
  }

  function init_mint_cards_and_burn(address add) public returns(Card[] memory) {
    require(cards.length > 0);
    Card[] memory res = new Card[](cards.length);
    for(uint i = 0; i<cards.length; i++){
      Card c = new Card(cards[i], _cards_id);
      string memory _tokenURI = string.concat(string.concat(cards[i], "_"), Strings.toString(_cards_id));
      c.mint(add, _tokenURI);
      _cards_id++;
      res[i] = c;
    }
    _burn(_token_id);
    return res;
  }
}