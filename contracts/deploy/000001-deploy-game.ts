import 'dotenv/config'
import { DeployFunction } from 'hardhat-deploy/types'
import db from '../data/set1.json';

const deployer: DeployFunction = async hre => {
  const accounts = await hre.ethers.provider.listAccounts();
  console.log("Accounts[0]:", accounts[0]);

  // We get the contract to deploy
  const Main = await hre.ethers.getContractFactory("Main");
  console.log("Deploying Main...");
  const main = await Main.deploy();

  await main.deployed();
  console.log("Main deployed to:", main.address);

  const data = db.map(elem => {
    return {
      link: elem.assets[0].gameAbsolutePath,
      id: elem.cardCode,
      rarity: elem.rarity,
      name: elem.name,
      type_: elem.type,
      subtype_: elem.subtype,
      supertype_: elem.supertype,
      cost: elem.cost.toString(),
      region: elem.regionRef
    }
  })
  
  await main.initialize(accounts[0]);
  console.log("Main initialized");
  console.log("Main owner:", await main.owner());
  await main.card_init(data.slice(0, data.length / 4));
  await main.card_init(data.slice(data.length / 4, data.length / 2));
  await main.card_init(data.slice(data.length / 2, data.length / 2 + data.length / 4));
  await main.card_init(data.slice(data.length / 2 + data.length / 4, data.length));
  console.log("Cards Field initialized"); 
}

export default deployer 
