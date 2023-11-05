import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import styles from './styles.module.css'
import Card from './Card'
import Collect from '../../contracts/artifacts/src/Collection.sol/Collection.json'


export const array_to_object = (arr: any[]) => {
  const [link, id, rarity, name, type, cost, sub_type, super_type, region] =
    arr
  return {
    cost: super_type,
    id: id,
    link: link,
    name: name,
    rarity: rarity,
    region: region,
    sub_type: sub_type,
    super_type: cost,
    type: type,
  }
}

const CardNavigator = ({ wallet, stack_only }) => {
  const [showFilters, setShowFilers] = useState(false)
  const [showRegions, setShowRegions] = useState(false)
  let timer
  const [filters, setFilters] = useState({
    mana: new Set(),
    type: new Set(),
    rarity: new Set(),
    regions: new Set(),
    name: ""
  })
  const [cards, setCards] = useState(localStorage.getItem("cards")!==null ? JSON.parse(localStorage.getItem("cards") as string) : [])
  const [displayedCards, setDisplayedCards] = useState([])
  const fetch_cards = async () => {
    let res: any[] = []
    let data = await wallet.contract.get_collections(wallet.details.account)
    if (stack_only) {
      data = data.slice(0, 1)
    }
    for (let i = 0; i < data.length; i++) {
      const collec_ = new ethers.Contract(
        data[0],
        Collect.abi,
        wallet.details.signer
      )
      const cards = await collec_.get_cards()
      for (let j = 0; j < cards.length; j++) {
        const [_, id] = cards[j]
        let card = await wallet.contract.cards(id)
        res.push(array_to_object(card))
      }
    }
    setCards(res)
    localStorage.setItem("cards", JSON.stringify(res))
    setDisplayedCards(res)
  }
  const reg_to_link = {
    "Piltover & Zaun": "Piltover" ,
    "ShadowIsles": "Shadow-isles" 
  }
  const toggle_filter = (filter: string, type: string) =>{
    const new_filters = structuredClone(filters)
    if(type=="name"){
      new_filters[type] = filter
    } else{
      if(new_filters[type].has(filter)){
        new_filters[type].delete(filter)
      } else{
        if(type=="regions"){
          if(new_filters.regions.size < 2){
            new_filters[type].add(filter)
          }
        } else{
          new_filters[type].add(filter)
        } 
      }
    }
    setFilters(new_filters)
  }
  const search = (val) => {
    clearTimeout(timer);
    timer = setTimeout(() => toggle_filter(val, "name") , 400);
  }
  const reset_regions = () => {
    const new_filters = structuredClone(filters)
    new_filters.regions = new Set()
    setFilters(new_filters)
  }
  useEffect(() => {
    fetch_cards()
  }, [])
  useEffect(() => {
    const new_displayed_cards = cards.filter((card) => apply_filter(card))
    setDisplayedCards(new_displayed_cards)
  }, [filters])
  const apply_filter = (card) => {
    let res = true
    if(filters.name!=""){
      const target = filters.name
      const valid_name = card.name.split(" ").some(word => word.slice(0, target.length).toLowerCase() == target.toLowerCase())
      res = res && valid_name
    }
    if(filters.mana.size > 0){
      let valid_mana = false
      if(filters.mana.has("8+")){
        valid_mana = valid_mana || (parseInt(card.cost)>=8)
      }
      res = res && (valid_mana || filters.mana.has(card.cost))
    } 
    if(filters.rarity.size > 0){
      res = res && (filters.rarity.has(card.rarity) || filters.rarity.has(card.sub_type) || filters.rarity.has(card.super_type))
    }
    if(filters.regions.size > 0){
      res = res && filters.regions.has(card.region)
    }
    if(filters.type.size > 0){
      res = res && (filters.type.has(card.type))
    }
    return res
  }
  return (
    <div>
      {cards.length == 0 ? (
        <h2>Loading</h2>
      ) : (
        <div className={styles.card_nav}>
          {!showFilters ? "":
           <div className={styles.filters}>
            <div className={styles.filter}>
              <div className={styles.filter_header}>
                <h2>CARD'S TYPE</h2>
                <div className={styles.goldline}></div>
              </div>
              <ul>
                <li onClick={() => toggle_filter("Unit", "type")}><img className={filters.type.has("Unit") ? styles.selected : ""} width={36} src="/Unit.png" alt="" />UNITY</li>
                <li onClick={() => toggle_filter("Spell", "type")}><img className={filters.type.has("Spell") ? styles.selected : ""}width={42}src="/Spell.png" alt="" />SPELL</li>
              </ul>
            </div>
            <div>
            <div className={styles.filter}>
              <div className={styles.filter_header}>
                <h2>RARITY</h2>
                <div className={styles.goldline}></div>
              </div>
              <ul>
                <li onClick={() => toggle_filter("COMMON", "rarity")}><img className={filters.rarity.has("COMMON") ? styles.selected : ""} width={42}src="/Common.png" alt="" />COMMON</li>
                <li onClick={() => toggle_filter("RARE", "rarity")}><img className={filters.rarity.has("RARE") ? styles.selected : ""} width={42}src="/Rare.png" alt="" />RARE</li>
                <li onClick={() => toggle_filter("EPIC", "rarity")}><img className={filters.rarity.has("EPIC") ? styles.selected : ""} width={42}src="/Epic.png" alt="" />EPIC</li>
                <li onClick={() => toggle_filter("Champion", "rarity")}><img className={filters.rarity.has("Champion") ? styles.selected : ""} width={42}src="/Champion.png" alt="" />CHAMPION</li>
              </ul>
            </div>
            <div className={styles.filter}>
                <div className={styles.filter_header}>
                <h2>MANA COST</h2>
                <div className={styles.goldline}></div>
              </div>     
              <ul style={{gap: "1rem"}}>
                <li onClick={() => toggle_filter("1", "mana")} className={(filters.mana.has("1") ? styles.mana_cost_selected :styles.mana_cost)}>1</li>
                <li onClick={() => toggle_filter("2", "mana")} className={(filters.mana.has("2") ? styles.mana_cost_selected :styles.mana_cost)}>2</li>
                <li onClick={() => toggle_filter("3", "mana")} className={(filters.mana.has("3") ? styles.mana_cost_selected :styles.mana_cost)}>3</li>
                <li onClick={() => toggle_filter("4", "mana")} className={(filters.mana.has("4") ? styles.mana_cost_selected :styles.mana_cost)}>4</li>
                <li onClick={() => toggle_filter("5", "mana")} className={(filters.mana.has("5") ? styles.mana_cost_selected :styles.mana_cost)}>5</li>
                <li onClick={() => toggle_filter("6", "mana")} className={(filters.mana.has("6") ? styles.mana_cost_selected :styles.mana_cost)}>6</li>
                <li onClick={() => toggle_filter("7", "mana")} className={(filters.mana.has("7") ? styles.mana_cost_selected :styles.mana_cost)}>7</li>
                <li onClick={() => toggle_filter("8+", "mana")} className={(filters.mana.has("8+") ? styles.mana_cost_selected :styles.mana_cost)}>8+</li>
              </ul>
            </div>
            </div>
         </div> }
         
          <div className={styles.card_nav_tools}>
            <img onClick={() => setShowFilers(!showFilters)} width="56" style={{cursor: "pointer"}} src="/filters.png" alt="" />
            <div onClick={() => setShowRegions(!showRegions)} className={styles.region_dropdown}>
              <img src="/selector.png" alt="" />
              <ul>
                {
                  filters.regions.size == 0 ? 
                  <li><img src="/All.png" alt="" />ALL REGIONS</li>
                  : Array.from(filters.regions).map((reg, i) =>
                  <li key={i} className={styles.region_selected}><img src={`/${reg.split(" ").length >1 ? reg_to_link[reg] : reg}.png`} alt="" /></li>
                  )
                }
              </ul>
             {showRegions ?  <div className={styles.region_modal}>
                <ul>
                  <li onClick={() => toggle_filter("Bandle", "regions")}><img className={styles.region_logo} width={120} src="/Bandle.png" alt="" />BANDLE</li>
                  <li onClick={() => toggle_filter("Bilgewater", "regions")}><img className={styles.region_logo} width={120} src="/Bilgewater.png" alt="" />BILGEWATER</li>
                  <li onClick={() => toggle_filter("Demacia", "regions")}><img className={styles.region_logo} width={120} src="/Demacia.png" alt="" />DEMACIA</li>
                  <li onClick={() => toggle_filter("Freljord", "regions")}><img className={styles.region_logo} width={120} src="/Freljord.png" alt="" />FRELJORD</li>
                  <li onClick={() => toggle_filter("Ionia", "regions")}><img className={styles.region_logo} width={120} src="/Ionia.png" alt="" />IONIA</li>
                  <li onClick={() => toggle_filter("Noxus", "regions")}><img className={styles.region_logo} width={120} src="/Noxus.png" alt="" />NOXUS</li>
                  <li onClick={() => toggle_filter("PiltoverZaun", "regions")}><img className={styles.region_logo} width={120} src="/PiltoverZaun.png" alt="" />PILTOVER & ZAUN</li>
                  <li onClick={() => toggle_filter("ShadowIsles", "regions")}><img className={styles.region_logo} width={120} src="/ShadowIsles.png" alt="" />SHADOW ISLES</li>
                  <li onClick={() => toggle_filter("Shurima", "regions")}><img width={130} src="/Shurima.png" alt="" />SHURIMA</li>
                  <li onClick={() => toggle_filter("Targon", "regions")}><img className={styles.region_logo} width={120} src="/Targon.png" alt="" />TARGON</li>
                  <li onClick={() => reset_regions()}><img width={130} src="/All.png" alt="" />ALL REGIONS</li>
                </ul>
              </div> : ""}
            </div>
            <div style={{position: "relative"}}>
              <img width={32} className={styles.loupe} src="/loupe.png" alt="" />
              <input onChange={(e) => search(e.currentTarget.value)} className={styles.input} type="text" placeholder='Search' />
            </div>
          </div>
          <ul className={styles.card_list}>
            {displayedCards.map((card, i) => (
              <Card key={i} link={card.link} id={card.id} />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default CardNavigator
