import React from 'react'
import styles from './styles.module.css'

const NavBar = ({setMenu}) => {
  return (
    <nav className={styles.nav}>
      <div className={styles.trim_left}></div>
      <div className={styles.trim_top}></div>
      <div className={styles.trim_bot}></div>
      <img className={styles.trim_top_left} src="/Trim2.png" alt="" />
      <img className={styles.trim_bot_left} src="/Trim.png" alt="" />
      <div onClick={() => setMenu("Home")}>
        <img src="/R.png" alt="" />
        <h1>HOME</h1>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="78"
        height="5"
        viewBox="0 0 78 5"
        fill="none"
      >
        <line
          x1="0.75"
          y1="2.5"
          x2="76.75"
          y2="2.5"
          stroke="#FFB3B3"
          stroke-opacity="0.15"
        />
        <line
          x1="77"
          y1="1.82131e-08"
          x2="77"
          y2="5"
          stroke="#FFB3B3"
          stroke-opacity="0.15"
        />
        <line
          x1="1"
          y1="1.82131e-08"
          x2="1"
          y2="5"
          stroke="#FFB3B3"
          stroke-opacity="0.15"
        />
      </svg>
      <div onClick={() => setMenu("Collection")}>
        <img src="/backpack.png" alt="" />
        <h1>COLLECTION</h1>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="78"
        height="5"
        viewBox="0 0 78 5"
        fill="none"
      >
        <line
          x1="0.75"
          y1="2.5"
          x2="76.75"
          y2="2.5"
          stroke="#FFB3B3"
          stroke-opacity="0.15"
        />
        <line
          x1="77"
          y1="1.82131e-08"
          x2="77"
          y2="5"
          stroke="#FFB3B3"
          stroke-opacity="0.15"
        />
        <line
          x1="1"
          y1="1.82131e-08"
          x2="1"
          y2="5"
          stroke="#FFB3B3"
          stroke-opacity="0.15"
        />
      </svg>
      <div onClick={() => setMenu("Store")}>
        <img src="/c.png" alt="" />
        <h1>STORE</h1>
      </div>
    </nav>
  )
}

export default NavBar
