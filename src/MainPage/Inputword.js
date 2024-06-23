import React, { useState, useEffect } from "react";
import WordBoard from "../components/WordBoard";
import '../styles/Inputword.css';
import { getDatabase, ref, set, onValue, remove } from "firebase/database";
import { auth } from '../GoogleSingin/config';

function Inputword() {
    const [inputWord, setInputWord] = useState('');
    const [inputMeaning, setInputMeaning] = useState('');
    const [inputHint, setInputHint] = useState('');
    const [inputCategory, setInputCategory] = useState('');
    const [type, setType] = useState('word'); // Default type set to 'word'
    const [wordList, setWordList] = useState([]);
    const [categories, setCategories] = useState(['기타']); // 초기 카테고리 목록에 '기타' 포함

    const db = getDatabase();
    const user = auth.currentUser;
    const userId = user ? user.uid : null;

    useEffect(() => {
        if (userId) {
            const wordsRef = ref(db, `Voca/${userId}`);
            onValue(wordsRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const wordArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                    setWordList(wordArray);
                }
            });

            const categoriesRef = ref(db, `Categories/${userId}`);
            onValue(categoriesRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const categoriesArray = Object.values(data); // 수정
                    setCategories(prevCategories => [...new Set([...prevCategories, ...categoriesArray])]);
                }
            });
        }
    }, [userId, db]);

    const addItem = () => {
        if (!inputWord || !inputMeaning) {
            alert('영어와 뜻은 필수 입력 항목입니다.');
            return;
        }

        const newItem = {
            type: type,
            voca: inputWord,
            meaning: inputMeaning,
            hint: inputHint,
            category: inputCategory || '기타'
        };

        if (userId) {
            const newWordKey = wordList.length.toString(); // 고유 ID로 설정
            set(ref(db, `Voca/${userId}/${newWordKey}`), newItem);
            setInputWord('');
            setInputMeaning('');
            setInputHint('');
            setInputCategory('');
        }
    };

    const removeItem = (id) => {
        if (userId) {
            const itemRef = ref(db, `Voca/${userId}/${id}`);
            remove(itemRef).then(() => {
                const updatedList = wordList.filter(item => item.id !== id).map((item, index) => ({ ...item, id: index.toString() }));
                setWordList(updatedList);
                updatedList.forEach(item => {
                    set(ref(db, `Voca/${userId}/${item.id}`), item);
                });
            });
        }
    };

    const handleCategoryChange = (event) => {
        setInputCategory(event.target.value);
    };

    const handleCategoryAdd = () => {
        if (inputCategory && !categories.includes(inputCategory)) {
            const newCategories = [...categories, inputCategory];
            setCategories(newCategories);
            if (userId) {
                const newCategoryKey = newCategories.length.toString(); // 고유 ID로 설정
                set(ref(db, `Categories/${userId}/${newCategoryKey}`), inputCategory);
            }
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

                <WordBoard wordList={wordList} setWordList={setWordList} removeItem={removeItem} />
            </div>
        </div>
    );
}

export default Inputword;
