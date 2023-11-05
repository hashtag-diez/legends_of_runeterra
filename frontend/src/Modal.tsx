import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { array_to_object } from './CardNavigator'
import { ethers } from 'ethers'
import Card_ from '../../contracts/artifacts/src/Card.sol/Card.json'

import background from './background.module.css'
import OpeningForm from './OpeningForm'

const Modal = ({ wallet, boosters, type, setOpening }) => {
  const [cards, setCards] = useState<any[]>([])
  const consume_booster = async () => {
    try {
      await wallet.contract.consume_and_burn(boosters)
      wallet.contract.on('Result', async (addrs: string[]) => {
        const res = []
        for (let i = 0; i < addrs.length; i++) {
          const card_ = new ethers.Contract(
            addrs[i],
            Card_.abi,
            wallet.details.signer
          )
          const id = await card_.get_id()
          const card = await wallet.contract.cards(id)
          res.push(array_to_object(card))
        }
        setCards(res)
      })
    } catch (e) {
      console.log(e)
    }
  }

  const handle_next = () => {
    if (cards.length == 5) {
      setOpening(null)
    } else {
      const next_cards = cards.slice(5, cards.length)
      setCards(next_cards)
    }
  }
  useEffect(() => {
    if (boosters != null) {
      consume_booster()
    }
  }, [boosters])
  useEffect(() => {
  }, [cards])
  const type_to_header = ['COMMON CAPSULE', 'EPIC CAPSULE', 'CHAMPION CAPSULE']

  return (
    <div className={styles.global_modal}>
        <div className={background.bg_animation}>
            <div className={background.stars}></div>
            <div className={background.stars2}></div>
            <div className={background.stars3}></div>
            <div className={background.stars4}></div>
          </div>
      {cards.length == 0 ? (
        <span className={styles.loader}></span>
      ) : (
        <main>
              <h1>{type_to_header[type]}</h1>
              <OpeningForm key={cards} cards={cards.slice(0, 5)} type={type} handle_next={handle_next} text={cards.length==5 ? "FINISH" : "CONTINUE"}/>
        </main>
      )}
    </div>
  )
}

export default Modal
