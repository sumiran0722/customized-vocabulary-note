import React, { useState } from "react";
import WordBoard from "../components/WordBoard";
import '../styles/Inputword.css';

function Inputword() {
    const [inputWord, setInputWord] = useState('');
    const [inputMeaning, setInputMeaning] = useState('');
    const [inputHint, setInputHint] = useState('');
    const [inputCategory, setInputCategory] = useState('');
    const [type, setType] = useState('word'); // Default type set to 'word'
    const [wordList, setWordList] = useState([]);
    const [categories, setCategories] = useState(['일상', '비행', '격식표현', '기타']); // 기본 카테고리 목록에 '기타' 추가

    const addItem = () => {
        // 입력값 검증
        if (!inputWord || !inputMeaning) {
            alert('영어와 뜻은 필수 입력 항목입니다.');
            return;
        }

        const newItem = {
            word: inputWord,
            meaning: inputMeaning,
            hint: inputHint,
            category: inputCategory || '기타', // 카테고리가 입력되지 않으면 기본값으로 '기타' 설정
            type: type
        };
        setWordList([...wordList, newItem]);
        setInputWord('');
        setInputMeaning('');
        setInputHint('');
        setInputCategory('');
    };

    const handleCategoryChange = (event) => {
        setInputCategory(event.target.value);
    };

    const handleCategoryAdd = () => {
        if (inputCategory && !categories.includes(inputCategory)) {
            setCategories([...categories, inputCategory]);
        }
        setInputCategory('');
    };

    return (
        <div>
            <div>
                <div className="radio-group" style={{ marginTop: '10px' }}>
                    <label>
                        <input
                            type="radio"
                            value="word"
                            checked={type === 'word'}
                            onChange={(event) => setType(event.target.value)}
                        />
                        단어

                        <input
                            type="radio"
                            value="sentence"
                            checked={type === 'sentence'}
                            onChange={(event) => setType(event.target.value)}
                        />
                        예문
                    </label>
                </div>

                <div style={{ marginTop: '10px' }}>
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

                <div className="category-input" style={{ marginTop: '10px' }}>
                    <label>카테고리</label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            value={inputCategory}
                            type="text"
                            placeholder="카테고리 입력"
                            onChange={handleCategoryChange}
                            style={{ marginRight: '10px' }}
                        />
                        <button onClick={handleCategoryAdd}>추가</button>
                    </div>
                    <ul>
                        {categories.map((category, index) => (
                            <li key={index} onClick={() => setInputCategory(category)}>{category}</li>
                        ))}
                    </ul>
                </div>

                <button onClick={addItem}>추가</button>

                <WordBoard wordList={wordList} setWordList={setWordList} />
            </div>
        </div>
    );
}

export default Inputword;
