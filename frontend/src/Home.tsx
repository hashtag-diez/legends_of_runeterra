import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import styles from './styles.module.css'
import { createAvatar } from '@dicebear/core'
import { botttsNeutral } from '@dicebear/collection'

const Home = ({ wallet }) => {
  const [amount, setAmount] = useState<string | null>(null)
  const avatar = createAvatar(botttsNeutral, {
    seed: wallet?.details?.account ?? 'test',
  })
  const fetch_amount = async () => {
    const data = await wallet.contract.balanceOf()
    const res = (parseInt(data._hex, 16) / Math.pow(10, 18)).toFixed(2)
    setAmount(res)
  }

  useEffect(() => {
    if (wallet != undefined) {
      fetch_amount()
    }
  }, [])
  const svg = avatar.toString()
  return (
    <div className={styles.home}>
      <video
        id="background-video"
        autoPlay
        loop
        muted
      >
        <source src="/Demacia.mp4" type="video/mp4" />
      </video>
      {wallet ? (
        <div className={styles.account}>
          <div className={styles.icon_wrapper}>
            <img
              className={styles.icon}
              src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`}
            />
          </div>
          <div className={styles.amout_wrapper}>
            <img src="/c.png" width={48} alt="" />
            {amount}
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default Home
