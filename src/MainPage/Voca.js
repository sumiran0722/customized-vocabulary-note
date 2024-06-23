import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import { getDatabase, ref, set, onValue, push, remove } from "firebase/database";
import { auth } from '../GoogleSingin/config';

const useStyles = makeStyles((theme) => ({
    fab: {
        position: 'fixed',
        bottom: '20px',
        right: '20px'
    }
}));

const WordItem = ({ item }) => (
    <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', width: '100%' }}>
        <div>
            <h6>
                {item.type === 'word' ? '단어' : '예문'} - {item.category}
            </h6>
        </div>
        <div>
            <div>
                <strong>영어 :</strong> {item.word}
            </div>
            <div>
                <strong>뜻 :</strong> {item.meaning}
            </div>
            <div>
                <h6><strong>Hint :</strong> {item.hint}</h6>
            </div>
        </div>
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

    const db = getDatabase();
    const user = auth.currentUser;
    const userId = user ? user.uid : null;

    useEffect(() => {
        if (userId) {
            const wordsRef = ref(db, `Voca/${userId}`);
            onValue(wordsRef, (snapshot) => {
                const data = snapshot.val();
                setWords(data || {});
            });
        }
    }, [userId]);

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
            type: 'word'
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
        // Delete selected items in reverse order
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

    return (
        <div>
            {Object.keys(words).map((id, index) => {
                const word = words[id];
                if (!word) return null;
                return (
                    <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', marginBottom: '10px' }} key={index}>
                        <Checkbox
                            style={{ marginRight: '10px' }}
                            checked={selectedItems.includes(index)}
                            onChange={() => toggleCheckbox(index)}
                        />
                        <WordItem item={word} />
                    </div>
                );
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
}

export default Voca;
