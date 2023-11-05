import Card from './Card'
import styles from './styles.module.css'

const OpeningForm = ({cards, handle_next, text}) => {
  return (
    <>
      <div className={styles.cards_obtained}>
        {cards.map((card, i) => (
          <div data-timing={i.toString()} className={styles.new_card} key={i}>
            <Card link={card.link} id={card.id} />
          </div>
        ))}
      </div>
      <span onClick={() => handle_next()}>
        {text}
      </span>
    </>
  )
}

export default OpeningForm
