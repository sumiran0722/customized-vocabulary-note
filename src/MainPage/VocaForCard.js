import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { getDatabase, ref, onValue, update } from "firebase/database";
import { auth } from '../GoogleSingin/config';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
    card: {
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '10px',
        width: '80%',
        margin: '10px auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    word: {
        fontSize: '30px',
        fontWeight: 'bold',
    },
    meaning: {
        fontSize: '20px',
        fontWeight: 'bold',
    },
    hint: {
        fontSize: '14px',
        marginTop: '10px',
    },
    input: {
        marginTop: '20px',
        padding: '10px',
        fontSize: '20px',
        width: '100%',
        boxSizing: 'border-box',
    },
}));

const WordCard = ({ wordData, showMeaning, toggleMeaning }) => {
    const classes = useStyles();

    return (
        <div className={classes.card}>
            {!showMeaning ? (
                <div className={classes.word}>
                    {wordData.word}
                </div>
            ) : (
                <div>
                    <div className={classes.meaning}>
                        {wordData.meaning}
                    </div>
                    <div className={classes.hint}>
                        {wordData.hint}
                    </div>
                </div>
            )}
            <Button onClick={toggleMeaning} variant="outlined" color="primary">
                {showMeaning ? '단어 보기' : '뜻 보기'}
            </Button>
        </div>
    );
};

const TestCard = ({ wordData, showMeaning, showHint, onAnswerChange, answer }) => {
    const classes = useStyles();

    return (
        <div className={classes.card}>
            {!showMeaning ? (
                <div className={classes.word}>
                    {wordData.meaning}
                </div>
            ) : (
                <div>
                    <div className={classes.meaning}>
                        {wordData.word}
                    </div>
                    {showHint && (
                        <div className={classes.hint}>
                            {wordData.hint}
                        </div>
                    )}
                </div>
            )}
            <input
                className={classes.input}
                placeholder={showMeaning ? '단어를 입력하세요' : '뜻을 입력하세요'}
                value={answer}
                onChange={onAnswerChange}
            />
        </div>
    );
};

const TestVoca = ({ selectedWords, wordFirst, handleClose }) => {
    const classes = useStyles();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showMeaning, setShowMeaning] = useState(!wordFirst);
    const [answers, setAnswers] = useState(Array(selectedWords.length).fill(''));
    const [showHint, setShowHint] = useState(false); // State to manage hint visibility

    const handleAnswerChange = (e) => {
        const newAnswers = [...answers];
        newAnswers[currentIndex] = e.target.value;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentIndex < selectedWords.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setShowMeaning(!wordFirst);
            setShowHint(false); // Reset hint visibility when moving to the next word
        } else {
            handleClose();
        }
    };

    const toggleHint = () => {
        setShowHint(!showHint); // Toggle hint visibility
    };

    return (
        <Dialog open={true} onClose={handleClose} fullWidth maxWidth="md">
            <Button onClick={handleClose} color="primary">
                <CloseIcon />
            </Button>
            <DialogContent>
                <TestCard
                    wordData={selectedWords[currentIndex]}
                    showMeaning={showMeaning}
                    showHint={showHint} // Pass showHint state to TestCard
                    onAnswerChange={handleAnswerChange}
                    answer={answers[currentIndex]}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={toggleHint} color="primary"> {/* Button to toggle hint visibility */}
                    {showHint ? '힌트 숨기기' : '힌트 보기'}
                </Button>
                <Button onClick={handleNext} color="primary">
                    다음
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const WordItem = ({ item, onToggleImportant, onSelect, isSelected }) => (
    <div style={{
        padding: '5px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        width: '80%',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center'
    }}>
        <Checkbox
            checked={isSelected}
            onChange={onSelect}
            style={{ marginRight: '10px' }}
        />
        <div style={{ flex: 1 }}>
            <h6 style={{ margin: '5px 0', fontSize: '12px' }}>
                {item.type === 'word' ? '단어' : '예문'} - {item.category}
            </h6>
            <div style={{ marginTop: '7px', marginBottom: '5px', fontSize: '30px' }}>
                <strong>{item.word}</strong>
            </div>
            <div style={{ marginTop: '10px', marginBottom: '5px', fontSize: '20px' }}>
                <strong>{item.meaning}</strong>
            </div>
            <div>
                <h6 style={{ marginTop: '17px', margin: '5px 0', fontSize: '14px' }}>{item.hint}</h6>
            </div>
        </div>
        <Checkbox
            checked={item.important}
            onChange={onToggleImportant}
            icon={<StarBorderIcon />}
            checkedIcon={<StarIcon />}
        />
    </div>
);

const VocaForCard = () => {
    const classes = useStyles();
    const [words, setWords] = useState({});
    const [selectedItems, setSelectedItems] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showWords, setShowWords] = useState(true);
    const [showSentences, setShowSentences] = useState(true);
    const [selectedCategoriesText, setSelectedCategoriesText] = useState('');
    const [startCardVoca, setStartCardVoca] = useState(false);
    const [startTestVoca, setStartTestVoca] = useState(false);
    const [wordFirst, setWordFirst] = useState(true);

    const db = getDatabase();
    const user = auth.currentUser;
    const userId = user ? user.uid : null;

    useEffect(() => {
        if (userId && db) {
            const wordsRef = ref(db, `Voca/${userId}`);
            onValue(wordsRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    let sortedWords = Object.entries(data);
                    if (sortOrder === 'asc') {
                        sortedWords.sort((a, b) => a[1].timestamp - b[1].timestamp);
                    } else if (sortOrder === 'desc') {
                        sortedWords.sort((a, b) => b[1].timestamp - a[1].timestamp);
                    } else if (sortOrder === 'random') {
                        sortedWords = sortedWords.sort(() => Math.random() - 0.5);
                    }

                    setWords(Object.fromEntries(sortedWords));

                    const uniqueCategories = [...new Set(Object.values(data).map(word => word.category))];
                    setCategories(['important', ...uniqueCategories]);
                } else {
                    setWords({});
                    setCategories([]);
                }
            });
        }
    }, [userId, db, sortOrder]);

    const handleSortOrderChange = (event) => {
        setSortOrder(event.target.value);
    };

    const handleCategorySelect = (category) => {
        let newSelectedCategories = [];
        if (selectedCategories.includes(category)) {
            newSelectedCategories = selectedCategories.filter(c => c !== category);
        } else {
            newSelectedCategories = [...selectedCategories, category];
        }
        setSelectedCategories(newSelectedCategories);
        setSelectedCategoriesText(newSelectedCategories.join(', '));

        let newSelectedItems = [];
        if (newSelectedCategories.length === 0) {
            newSelectedItems = [];
        } else {
            Object.entries(words).forEach(([key, word]) => {
                if (newSelectedCategories.includes(word.category) || (newSelectedCategories.includes('important') && word.important)) {
                    newSelectedItems.push(key);
                }
            });
        }
        setSelectedItems(newSelectedItems);
    };

    const handleToggleImportant = (key) => {
        const updatedWords = { ...words };
        updatedWords[key].important = !updatedWords[key].important;

        const wordRef = ref(db, `Voca/${userId}/${key}`);
        update(wordRef, { important: updatedWords[key].important });
    };

    const handleItemSelect = (key) => {
        let newSelectedItems = [];
        if (selectedItems.includes(key)) {
            newSelectedItems = selectedItems.filter(k => k !== key);
        } else {
            newSelectedItems = [...selectedItems, key];
        }
        setSelectedItems(newSelectedItems);
    };

    const handleDeselectAll = () => {
        setSelectedItems([]);
    };

    const handleSelectAll = () => {
        const allItems = Object.keys(words);
        setSelectedItems(allItems);
    };

    const handleStartCardVoca = () => {
        setStartCardVoca(true);
    };

    const handleStartTestVoca = (wordFirst) => {
        setWordFirst(wordFirst);
        setStartTestVoca(true);
    };

    const handleCloseCardVoca = () => {
        setStartCardVoca(false);
    };

    const handleCloseTestVoca = () => {
        setStartTestVoca(false);
    };

    let filteredWords = Object.entries(words).filter(([key, word]) => {
        if (selectedCategories.length === 0) {
            return true;
        }
        if (selectedCategories.includes('important')) {
            if (selectedCategories.length === 1) {
                return word.important;
            } else {
                return word.important && selectedCategories.some(category => category !== 'important' && word.category === category);
            }
        }
        const matchesCategory = selectedCategories.includes(word.category);
        const matchesType = (showWords && word.type === 'word') || (showSentences && word.type === 'sentence');
        
        return matchesCategory && matchesType;
    });

    return (
        <div>
            <div className={classes.settings}>
                <div>
                    <h3>정렬순서</h3>
                    <RadioGroup value={sortOrder} onChange={handleSortOrderChange}>
                        <FormControlLabel value="random" control={<Radio />} label="랜덤" />
                        <FormControlLabel value="desc" control={<Radio />} label="최신 순" />
                        <FormControlLabel value="asc" control={<Radio />} label="오래된 순" />
                    </RadioGroup>
                </div>
                <div>
                    <h3>Categories</h3>
                    {categories.map(category => (
                        <FormControlLabel
                            key={category}
                            control={
                                <Checkbox
                                    checked={selectedCategories.includes(category)}
                                    onChange={() => handleCategorySelect(category)}
                                />
                            }
                            label={category}
                        />
                    ))}
                </div>
                <div>
                    <Button onClick={handleSelectAll} color="primary">
                        모두 선택
                    </Button>

                    <Button onClick={handleDeselectAll} color="secondary">
                        선택 모두 해제
                    </Button>
                </div>
                
                <Button onClick={() => handleStartTestVoca(true)} color="primary" variant="contained" className={classes.startButton}>
                    단어로 테스트
                </Button>
                <Button onClick={() => handleStartTestVoca(false)} color="primary" variant="contained" className={classes.startButton}>
                    뜻으로 테스트
                </Button>
            </div>
            <div>
                {filteredWords.map(([id, word], index) => (
                    <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', marginBottom: '10px' }} key={index}>
                        <Checkbox
                            style={{ marginRight: '10px' }}
                            checked={selectedItems.includes(id)}
                            onChange={() => handleItemSelect(id)}
                        />
                        <WordItem item={word} onToggleImportant={() => handleToggleImportant(id)} isSelected={selectedItems.includes(id)} />
                    </div>
                ))}
            </div>
            {startTestVoca && selectedItems.length > 0 && (
                <TestVoca
                    selectedWords={Object.keys(words)
                        .filter(id => selectedItems.includes(id))
                        .map(id => words[id])
                    }
                    wordFirst={wordFirst}
                    handleClose={handleCloseTestVoca}
                />
            )}
        </div>
    );
};

export default VocaForCard;