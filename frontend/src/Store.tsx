import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import styles from './styles.module.css'
import { useWallet } from './App'
import Modal from './Modal'

const Store = ({ wallet }) => {
  const [boosters, setBoosters] = useState<null | string>(null)
  const [type_opening, setOpening] = useState<null|number>(null)
  const buy_booster = async (type: number, price: number) => {
    try {
      const booster_id = await wallet.contract.mint_booster(
        ethers.BigNumber.from(type.toString()),
        { value: ethers.utils.parseEther(price.toString()) }
      )
      setOpening(type)
      wallet.contract.on('Transfer', (booster_id: string) => {
        setBoosters(booster_id)
      })
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <main className={styles.main_collection}>
      {type_opening!==null ? <Modal wallet={wallet} boosters={boosters} type={type_opening} setOpening={setOpening}/> : "" }      
      <aside className={styles.decks_nav}>
        <div className={styles.decks_navelem}>
          <div>CAPSULES</div>
        </div>
      </aside>
      <section className={styles.collection_section}>
        <div className={styles.border_left}></div>
        {/*  {(cards == null ?
        <h2>Loading</h2>
        :
        <ul className={styles.card_list}>
          {cards.map(card =>  <Card link={card.link} id={card.id}/>)}
        </ul>
      )} */}
        {/* <button onClick={() => buy_booster()}>Buy a champion capsule</button>
        <button onClick={() => consume_booster()}>Consume the capsule and display cards</button> */}
        <div className={styles.store}>
          <ul>
            <li onClick={() => buy_booster(0, 20)}>
              <img className={styles.capsule} height={230} src="/Capsule.png" alt="" />
              <div>COMMON CAPSULE &nbsp; 20<img src="/coin.png" width={48} alt="" /></div>
              <div className={styles.capsule_content}>
                <div><img width={45} src="/card_common.png" alt="" /><span>4x</span></div>
                <div><img width={45} src="/card_rare.png" alt="" /><span>1x</span></div>
              </div>
            </li>
            <li onClick={() => buy_booster(1, 50)}>
              <img className={styles.capsule} height={230}src="/Capsule_epic.png" alt="" />
              <div>EPIC CAPSULE &nbsp; 50<img src="/coin.png" width={48} alt="" /></div>
              <div className={styles.capsule_content}>
                <div><img width={45} src="/card_common.png" alt="" /><span>6x</span></div>
                <div><img width={45} src="/card_rare.png" alt="" /><span>2x</span></div>
                <div><img width={45} src="/card_epic.png" alt="" /><span>1x</span></div>
              </div>
            </li>
            <li onClick={() => buy_booster(2, 100)}>
              <img className={styles.capsule} width={230}src="/Capsule_champion.png" alt="" />
              <div>CHAMPION CAPSULE &nbsp; 100<img src="/coin.png" width={48} alt="" /></div>
              <div className={styles.capsule_content}>
                <div><img width={45} src="/card_common.png" alt="" /><span>6x</span></div>
                <div><img width={45} src="/card_rare.png" alt="" /><span>6x</span></div>
                <div><img width={45} src="/card_epic.png" alt="" /><span>3x</span></div>
                <div><img width={45} src="/card_champion.png" alt="" /><span>1x</span></div>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </main>
  )
}

export default Store
