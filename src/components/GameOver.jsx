import styles from './GameOver.module.css'

export const GameOver = ({ retry, score }) => {
  return (
    <div className={styles.container}>
      <h2>Fim de Jogo!</h2>
      <p>A sua pontuação foi: <span>{score}</span></p>
      <button onClick={retry}>Comece Novamente</button>
    </div>
  )
}
