import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
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
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
    fab: {
        position: 'fixed',
        bottom: '20px',
        right: '20px'
    },
    categoryButton: {
        position: 'fixed',
        bottom: '100px',
        right: '20px',
        borderRadius: '50%',
        width: '56px',
        height: '56px',
        zIndex: theme.zIndex.speedDial,
    },
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
    navButton: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
    },
    prevButton: {
        left: '10px',
    },
    nextButton: {
        right: '10px',
    },
    settings: {
        padding: '20px',
        marginBottom: '20px',
        border: '1px solid #ccc',
        borderRadius: '10px',
    },
    startButton: {
        margin: '20px 0',
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

const CardVoca = ({ selectedWords, wordFirst, handleClose }) => {
    const classes = useStyles();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showMeaning, setShowMeaning] = useState(!wordFirst);

    const toggleMeaning = () => setShowMeaning(!showMeaning);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % selectedWords.length);
        setShowMeaning(!wordFirst);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + selectedWords.length) % selectedWords.length);
        setShowMeaning(!wordFirst);
    };

    return (
        <Dialog open={true} onClose={handleClose} fullWidth maxWidth="md">
            <Button onClick={handleClose} color="primary">
                <CloseIcon />
            </Button>
            <DialogContent>
                {selectedWords.length > 0 && (
                    <div>
                        <WordCard wordData={selectedWords[currentIndex]} showMeaning={showMeaning} toggleMeaning={toggleMeaning} />
                    </div>
                )}
            </DialogContent>
            <DialogActions>
                {/* Previous Button */}
                <Button onClick={handlePrev} color="primary" className={classes.prevButton}>
                    이전
                </Button>
                {/* Next Button */}
                <Button onClick={handleNext} color="primary" className={classes.nextButton}>
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

const Voca = () => {
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
    const [wordFirst, setWordFirst] = useState(true);
    const [viewPreference, setViewPreference] = useState('wordFirst'); // Default to word first

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

        // Auto-select all words in the selected category
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

    const handleCloseCardVoca = () => {
        setStartCardVoca(false);
    };

    const handleViewPreferenceChange = (event) => {
        setViewPreference(event.target.value);
        setWordFirst(event.target.value === 'wordFirst');
    };

    let filteredWords = Object.entries(words).filter(([key, word]) => {
        // 선택된 카테고리가 하나도 없으면 모든 단어를 표시합니다.
        if (selectedCategories.length === 0) {
            return true;
        }
    
        // 중요한 단어와 다른 카테고리가 함께 선택된 경우
        if (selectedCategories.includes('important')) {
            if (selectedCategories.length === 1) {
                // important만 선택된 경우
                return word.important;
            } else {
                // important와 다른 카테고리가 함께 선택된 경우
                return word.important && selectedCategories.some(category => category !== 'important' && word.category === category);
            }
        }
    
        // 일반적인 경우: 선택된 카테고리에 해당하는 단어를 필터링합니다.
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
                    <h3>우선 보기 설정</h3>
                    <RadioGroup value={viewPreference} onChange={handleViewPreferenceChange}>
                        <FormControlLabel value="wordFirst" control={<Radio />} label="단어 우선 보기" />
                        <FormControlLabel value="meaningFirst" control={<Radio />} label="뜻 우선 보기" />
                    </RadioGroup>
                </div>
                <div>
                    <Button onClick={handleSelectAll} color="primary">
                        모두 선택
                    </Button>

                    <Button onClick={handleDeselectAll} color="secondary">
                        선택 모두 해제
                    </Button>
                </div>
                
                <Button onClick={handleStartCardVoca} color="primary" variant="contained" className={classes.startButton}>
                    카드 단어 보기 시작
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
            <Fab color="primary" className={classes.fab} onClick={() => setSelectedItems([])}>
                <DeleteIcon />
            </Fab>
            {startCardVoca && selectedItems.length > 0 && (
                <CardVoca
                    selectedWords={Object.keys(words)
                        .filter(id => selectedItems.includes(id))
                        .map(id => words[id])
                    }
                    wordFirst={wordFirst}
                    handleClose={handleCloseCardVoca}
                />
            )}
        </div>
    );
};

export default Voca;