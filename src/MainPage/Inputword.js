import React, { useState } from "react";
import WordBoard from "../components/WordBoard";
import '../styles/Inputword.css';

function Inputword() {
    const [inputWord, setInputWord] = useState('');
    const [inputMeaning, setInputMeaning] = useState('');
    const [inputHint, setInputHint] = useState('');
    const [type, setType] = useState('word'); // Default type set to 'word'
    const [wordList, setWordList] = useState([]); // State variable should be named `wordList`

    const addItem = () => {
        const newItem = {
            word: inputWord,
            meaning: inputMeaning,
            hint : inputHint,
            type: type
        };
        setWordList([...wordList, newItem]);
        setInputWord('');
        setInputMeaning('');
        setInputHint('');
    };

    return (
        <div>
            <div>
                <div>
                    <label>영어</label>
                    <input
                        value={inputWord}
                        type="text"
                        placeholder="영어"
                        onChange={(event) => setInputWord(event.target.value)}
                    />
                </div>

                <div>
                    <label>뜻</label>
                    <input
                        value={inputMeaning}
                        type="text"
                        placeholder="뜻"
                        onChange={(event) => setInputMeaning(event.target.value)}
                    />
                </div>

                <div>
                    <label>Hint</label>
                    <input
                        value={inputHint}
                        type="text"
                        placeholder="Hint"
                        onChange={(event) => setInputHint(event.target.value)}
                    />
                </div>

                <div className="radio-group">
                    <label>
                        <input
                            type="radio"
                            value="word"
                            checked={type === 'word'}
                            onChange={(event) => setType(event.target.value)}
                        />
                        단어
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="sentence"
                            checked={type === 'sentence'}
                            onChange={(event) => setType(event.target.value)}
                        />
                        예문
                    </label>
                </div>

                <button onClick={addItem}>추가</button>

                <WordBoard wordList={wordList} />
            </div>
        </div>
    );
}

export default Inputword;
