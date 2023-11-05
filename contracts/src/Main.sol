// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Collection.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./Card.sol";
import "./Booster.sol";
import "./MersenneTwister.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Main is Initializable, OwnableUpgradeable {
  struct CollectionElem {
    Collection[] coll;
    bool is_set;
  }

  struct CardDatas {
    string link;
    string id;
    string rarity;
    string name;
    string type_;
    string subtype_;
    string supertype_;
    string cost;
    string region;
  }

  uint256 private booster_token_id;
  uint256 public card_token_id;
  mapping(string => CardDatas) public cards;
  mapping(address => CollectionElem) public collections;
  mapping(string => Booster) private boosters;
  MersenneTwister private rng = new MersenneTwister();
  string[] private common_card_ids;
  string[] private rare_card_ids;
  string[] private epic_card_ids;
  string[] private champion_card_ids;

  function initialize(address add) public initializer {
    booster_token_id = 0;
    card_token_id = 0;
    __Ownable_init(add);
  }

  function card_init(CardDatas[] memory c) public onlyOwner {
    for (uint256 i = 0; i < c.length; i++) {
      cards[c[i].id] = c[i];
      if(compare_strings(c[i].rarity, "COMMON")){
        common_card_ids.push(c[i].id);
      }
      if(compare_strings(c[i].rarity, "RARE")){
        rare_card_ids.push(c[i].id);
      }
      if(compare_strings(c[i].rarity, "EPIC")){
        epic_card_ids.push(c[i].id);
      }
      if(compare_strings(c[i].rarity, "Champion")|| compare_strings(c[i].supertype_, "Champion")){
        champion_card_ids.push(c[i].id);
      }
    }
  }

  function create_collection(string calldata name) private {
    require(!compare_strings(name, ""));
    if (!collections[msg.sender].is_set) {
      collections[msg.sender] = CollectionElem({
        is_set: true,
        coll: new Collection[](0)
      });
    }
    Collection[] storage coll = collections[msg.sender].coll;
    coll.push(new Collection(name));
    collections[msg.sender].coll = coll;
  }

  function get_collections(
    address id
  ) public view returns (Collection[] memory) {
    require(collections[id].is_set);
    Collection[] memory total = collections[id].coll;
    return total;
  }

  event Transfer(string boost_id);

  function mint_booster(uint _type) external payable {
    require(_type >= 0 && _type <3);
    Booster b;
    string memory prefix_uri;
    string memory suffix_uri = Strings.toString(booster_token_id); 
    if(_type==0){
      require(msg.value == 20000000000000000000);
      b = new Booster(booster_token_id, "CAPSULE", card_token_id);
      card_token_id = card_token_id + 5;
      prefix_uri = "BOOSTER_CAPSULE_";
    } else{
      if(_type==1){
        require(msg.value == 50000000000000000000);
        b = new Booster(booster_token_id, "EPIC", card_token_id);
        card_token_id = card_token_id + 10;
        prefix_uri = "BOOSTER_EPIC_";
      }
      else{
        require(msg.value == 100000000000000000000);
        b = new Booster(booster_token_id, "CHAMPION", card_token_id);
        card_token_id = card_token_id + 15;
        prefix_uri = "BOOSTER_CHAMPION_";
      }
    }
    
    string[] memory allocated_cards = pick_random_cards(b.get_type());
    b.set_cards(allocated_cards);
    b.mint(msg.sender, string.concat(prefix_uri, suffix_uri));
  
    string memory booster_id = string.concat("BOOSTER_",suffix_uri);
    boosters[booster_id] = b;
    booster_token_id++;
    emit Transfer(booster_id);
  }

  event Result(address[] cards_addrs);
  function consume_and_burn(string memory id) external {
    Booster b = boosters[id];

    Card[] memory new_cards = b.init_mint_cards_and_burn(msg.sender);
    delete boosters[id]; 
    CollectionElem memory elem = collections[msg.sender];
    if(!elem.is_set){
      collections[msg.sender] = CollectionElem({
        is_set: true,
        coll: new Collection[](0)
      });
      collections[msg.sender].coll.push(new Collection(""));
      elem =  collections[msg.sender];
    }
    address[] memory res = new address[](new_cards.length);
    uint main_index = uint(find_stack(elem.coll));
    Collection coll = elem.coll[main_index];
    for(uint i = 0; i<new_cards.length; i++){
      coll.add_to_collection(new_cards[i]);
      res[i] = address(new_cards[i]);
    }
    collections[msg.sender].coll[main_index] = coll;
    emit Result(res);
  }

  function pick_random_cards(string memory rank) private view returns (string[] memory){
    string[] memory res = new string[](5);
    uint8[4] memory nb_cards_by_rank = [4, 1, 0, 0];
    if(compare_strings(rank, "EPIC")){
      res = new string[](10);
      nb_cards_by_rank[0] = 6;
      nb_cards_by_rank[1] = 3;
      nb_cards_by_rank[2] = 1;
    }
    if(compare_strings(rank, "CHAMPION")){
      res = new string[](15);
      nb_cards_by_rank[0] = 6;
      nb_cards_by_rank[1] = 6;
      nb_cards_by_rank[2] = 2;
      nb_cards_by_rank[3] = 1;
    }
    uint ind = 0;
    uint index;
    uint[624] memory MT;
    uint random;
    (index, MT) = rng.get_MT_tab();
    for(uint i = 0; i<4; i++){
      for(uint j = 0; j<nb_cards_by_rank[i]; j++){
        (index, MT, random) = rng.next(index, MT);
        if(i==0){
          uint rand = random % common_card_ids.length;
          res[ind] = common_card_ids[rand];
        }
        if(i==1){
          uint rand = random % rare_card_ids.length;
          res[ind] = rare_card_ids[rand];
        }
        if(i==2){
          uint rand = random % epic_card_ids.length;
          res[ind] = epic_card_ids[rand];
        }
        if(i==3){
          uint rand = random % champion_card_ids.length;
          res[ind] = champion_card_ids[rand];
        }
        ind++;
      }
    }
    return res;
  }

  function st2num(string memory numString) private pure returns (uint) {
    uint val = 0;
    bytes memory stringBytes = bytes(numString);
    for (uint i = 0; i < stringBytes.length; i++) {
      uint exp = stringBytes.length - i;
      bytes1 ival = stringBytes[i];
      uint8 uval = uint8(ival);
      uint jval = uval - uint(0x30);

      val += (uint(jval) * (10 ** (exp - 1)));
    }
    return val;
  }

  function balanceOf() public view returns(uint){
    return msg.sender.balance;
  }
  
  function compare_strings(string memory a, string memory b) private pure returns (bool) {
    return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
  }

  function find_stack(Collection[] memory coll) private view returns(int){
    int res = -1;
    for(uint i = 0; i<coll.length; i++){
      if(compare_strings(coll[i].get_name(), "")){
        res = int(i);
      }
    }
    return res;
  }
}
