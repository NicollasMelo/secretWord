import './App.css';
//React
import { useCallback, useEffect, useState } from 'react';

//data
import { wordsList } from './data/words'

//components
import { StarScreen } from './components/StarScreen';
import { Game } from './components/Game';
import { GameOver } from './components/GameOver';

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

const guessesQty = 10

function App() {

  const [gameStage, setgameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setletters] = useState([])

  const [guessedLetters, setGuessLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQty)
  const [score, setScore] = useState(0)

  const pickWordAndCategory = useCallback(() => {
    // pick random category
    const categories = Object.keys(words)
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)]

    //pick a random word
    const word =
      words[category][Math.floor(Math.random() * words[category].length)]

    return { word, category }
  }, [words])

  //starts the secret word game

  const startGame = useCallback(() => {
    clearLetterStates()

    // pick word and pick category

    const { word, category } = pickWordAndCategory()
    // create an array of letters

    let wordLetters = word.split("")

    setgameStage(stages[1].name)

    //fill states
    setPickedWord(word)
    setPickedCategory(category)
    setletters(wordLetters)
  }, [pickWordAndCategory])

  //process the letter input
  const verifyLetter = (letter) => {

    const normalizedLetter = letter.toLowerCase(letter)
    if (guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return
    }
    if (letters.includes(normalizedLetter)) {
      setGuessLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ])

    } else {
      setWrongLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,])
      setGuesses((actualGuesses) => actualGuesses - 1)
    }
  }

  const clearLetterStates = () => {
    setGuessLetters([])
    setWrongLetters([])
  }

  useEffect(() => {
    if (guesses <= 0) {
      clearLetterStates()
      setgameStage(stages[2].name)
    }
  }, [guesses])

  useEffect(() => {
    const uniqueLetters = [... new Set(letters)]
    if (guessedLetters.length === uniqueLetters.length) {
      setScore((actualScore) => actualScore += 100)

      startGame()
    }

  }, [guessedLetters, letters, startGame])

  //FIM
  const retry = () => {
    setScore(0)
    setGuesses(guessesQty)

    setgameStage(stages[0].name)
  }

  return (
    <div className="App">
      {gameStage === 'start' && <StarScreen startGame={startGame} />}
      {gameStage === 'game' && <Game verifyLetter={verifyLetter}
        pickedWord={pickedWord}
        pickedCategory={pickedCategory}
        letters={letters}
        guessedLetters={guessedLetters}
        wrongLetters={wrongLetters}
        guesses={guesses}
        score={score} />}
      {gameStage === 'end' && <GameOver
        retry={retry}
        score={score} />}
    </div>
  );
}

export default App;