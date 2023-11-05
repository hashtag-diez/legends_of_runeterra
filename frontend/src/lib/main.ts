import { ethers } from 'ethers'
import * as ethereum from './ethereum'
import Main from "../../../contracts/artifacts/src/Main.sol/Main.json"
const MainAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

export const correctChain = () => {
  return 31337
}

export const init = async (details: ethereum.Details) => {
  const { provider, signer } = details
  const network = await provider.getNetwork()
  if (correctChain() !== network.chainId) {
    console.error('Please switch to HardHat')
    return null
  }
  const contract = new ethers.Contract(MainAddress, Main.abi, provider)
  const deployed = await contract.deployed()
  if (!deployed) return null
  const contract_ = signer ? contract.connect(signer) : contract
  return contract_
}
