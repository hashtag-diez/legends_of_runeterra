// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Card is Ownable, ERC721URIStorage {
  
  uint256 private _token_id;
  address public _owner;
  string public card_id;

  constructor(string memory c, uint256 id) ERC721("MyCard", "Card") Ownable(msg.sender) {
    _owner = msg.sender;
    card_id = c;
    _token_id = id;
  }

  function get_id() public view returns(string memory){
    return card_id;
  }
  function mint(
    address user,
    string memory _tokenURI
  ) external onlyOwner returns (bool) {
    _safeMint(user, _token_id);
    _setTokenURI(_token_id, _tokenURI);
    return true;
  }
}
