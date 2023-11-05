import { useState } from 'react'  
import styles from './styles.module.css'
import CardNavigator from './CardNavigator'

const Collection = ({wallet}) => {
  const [menu, setMenu] = useState("Cards")
  const menu_to_component = { Cards: <CardNavigator wallet={wallet} stack_only={false}/> }


  return (
    <main className={styles.main_collection}>
      <aside className={styles.decks_nav}>
        <div onClick={() => setMenu("Cards")} className={styles.decks_navelem}>
          <div>CARDS</div>
        </div>
      </aside>
      <section className={styles.collection_section}>
        <div className={styles.border_left}></div>
{/*         <button onClick={() => createCollec()}>Add collection Diez</button>
        <button onClick={() => mint_and_assign()}>Add card to the collection</button>
        <button onClick={() => get_collect()}>Retrieve the collection</button> */}
        {menu_to_component[menu]}
      </section>
    </main>
  )
}

export default Collection