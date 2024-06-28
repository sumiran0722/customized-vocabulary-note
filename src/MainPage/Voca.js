import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { getDatabase, ref, set, onValue, push, remove, update } from "firebase/database";
import { auth } from '../GoogleSingin/config';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';

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
}));

const WordItem = ({ item, onToggleImportant }) => (
    <div style={{
        padding: '5px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        width: '80%',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center'
    }}>
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
    const [dialog, setDialog] = useState(false);
    const [word, setWord] = useState('');
    const [meaning, setMeaning] = useState('');
    const [hint, setHint] = useState('');
    const [category, setCategory] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
    const [sortOrder, setSortOrder] = useState('desc');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showWords, setShowWords] = useState(true);
    const [showSentences, setShowSentences] = useState(true);

    const db = getDatabase();
    const user = auth.currentUser;
    const userId = user ? user.uid : null;

    useEffect(() => {
        if (userId && db) {
            const wordsRef = ref(db, `Voca/${userId}`);
            onValue(wordsRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const sortedWords = Object.entries(data)
                        .sort((a, b) => sortOrder === 'desc' ? b[1].timestamp - a[1].timestamp : a[1].timestamp - b[1].timestamp)
                        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
                    setWords(sortedWords);

                    const uniqueCategories = [...new Set(Object.values(data).map(word => word.category))];
                    setCategories(['important', ...uniqueCategories]);
                } else {
                    setWords({});
                    setCategories([]);
                }
            });
        }
    }, [userId, db, sortOrder]);

    const handleDialogToggle = () => setDialog(!dialog);

    const handleValueChange = (e) => {
        const { name, value } = e.target;
        if (name === 'voca') setWord(value);
        if (name === 'meaning') setMeaning(value);
        if (name === 'hint') setHint(value);
        if (name === 'category') setCategory(value);
    };

    const handleSubmit = () => {
        const newWord = {
            word: word,
            meaning: meaning,
            hint: hint,
            category: category,
            type: 'word',
            timestamp: Date.now(),
            important: false
        };

        handleDialogToggle();
        if (!newWord.word || !newWord.meaning || !newWord.hint || !newWord.category) {
            return;
        }

        const newWordRef = push(ref(db, `Voca/${userId}`));
        set(newWordRef, newWord).then(() => {
            setWord('');
            setMeaning('');
            setHint('');
            setCategory('');
        });
    };

    const toggleCheckbox = (index) => {
        setSelectedItems(prevSelectedItems =>
            prevSelectedItems.includes(index)
                ? prevSelectedItems.filter(item => item !== index)
                : [...prevSelectedItems, index]
        );
    };

    const handleDelete = () => {
        setDeleteConfirmDialog(true);
    };

    const confirmDelete = () => {
        setDeleteConfirmDialog(false);
        const reversedSelectedItems = selectedItems.slice().reverse();
        reversedSelectedItems.forEach(index => {
            const wordId = Object.keys(words)[index];
            const wordRef = ref(db, `Voca/${userId}/${wordId}`);
            remove(wordRef);
        });
        setSelectedItems([]);
    };

    const cancelDelete = () => {
        setDeleteConfirmDialog(false);
    };

    const handleSortOrderChange = (event) => {
        setSortOrder(event.target.value);
    };

    const toggleImportant = (wordId) => {
        const wordRef = ref(db, `Voca/${userId}/${wordId}`);
        const currentStatus = words[wordId].important;
        update(wordRef, { important: !currentStatus });
    };

    const handleCategoryDialogToggle = () => {
        setDialog(!dialog);
    };

    const handleCategorySelect = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    return (
        <div>
            <RadioGroup row value={sortOrder} onChange={handleSortOrderChange}>
                <FormControlLabel value="desc" control={<Radio />} label="최신순" />
                <FormControlLabel value="asc" control={<Radio />} label="오래된순" />
            </RadioGroup>

            <div style={{ marginBottom: '10px' }}>
                <FormControlLabel
                    control={<Checkbox checked={showWords} onChange={() => setShowWords(!showWords)} />}
                    label="단어 보기"
                />
                <FormControlLabel
                    control={<Checkbox checked={showSentences} onChange={() => setShowSentences(!showSentences)} />}
                    label="예문 보기"
                />
            </div>

            <Fab color="primary" className={classes.categoryButton} onClick={handleCategoryDialogToggle}>
                📁
            </Fab>

            <Dialog open={dialog} onClose={handleDialogToggle}>
                <DialogTitle>카테고리 선택</DialogTitle>
                <DialogContent>
                    {categories.map((category, index) => (
                        <FormControlLabel
                            key={index}
                            control={<Checkbox checked={selectedCategories.includes(category)} onChange={() => handleCategorySelect(category)} />}
                            label={category === 'important' ? '⭐' : category}
                        />
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogToggle} color="primary">
                        닫기
                    </Button>
                </DialogActions>
            </Dialog>

            {Object.keys(words).map((id, index) => {
                const word = words[id];
                if (!word) {
                    return null;
                }

                if ((showWords && word.type === 'word') || (showSentences && word.type === 'sentence')) {
                    if (selectedCategories.includes('important')) {
                        if (!word.important) {
                            return null;
                        }
                    } else {
                        if (selectedCategories.length > 0 && !selectedCategories.includes(word.category)) {
                            return null;
                        }
                    }

                    return (
                        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', marginBottom: '10px' }} key={index}>
                            <Checkbox
                                style={{ marginRight: '10px' }}
                                checked={selectedItems.includes(index)}
                                onChange={() => toggleCheckbox(index)}
                            />
                            <WordItem item={word} onToggleImportant={() => toggleImportant(id)} />
                        </div>
                    );
                } else {
                    return null;
                }
            })}

            <Fab color="primary" className={classes.fab} onClick={handleDelete}>
                <DeleteIcon />
            </Fab>

            <Dialog open={deleteConfirmDialog} onClose={cancelDelete}>
                <DialogTitle>삭제 확인</DialogTitle>
                <DialogContent>
                    선택한 단어를 삭제하시겠습니까?
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="primary" onClick={confirmDelete}>확인</Button>
                    <Button variant="outlined" color="primary" onClick={cancelDelete}>취소</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Voca;
