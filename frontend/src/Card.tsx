import React from 'react'
import styles from './styles.module.css'


const Card = ({ link, id }) => {
  return (
    <li key={id} className={styles.card}>
      <img src={link} alt="" className={styles.img_card}/>
    </li>
  )
}

export default Card
