import React, { useState, useEffect } from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    fab: {
        position: 'fixed',
        bottom: '20px',
        right: '20px'
    }
}));

const databaseURL = "https://jini-c66ca-default-rtdb.firebaseio.com";

function Voca() {
    const classes = useStyles();
    const [words, setWords] = useState({});
    const [dialog, setDialog] = useState(false);
    const [word, setWord] = useState('');
    const [weight, setWeight] = useState('');

    useEffect(() => {
        fetch(`${databaseURL}/words.json`).then(res => {
            if (res.status !== 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(words => setWords(words || {}));
    }, []);

    const handleDialogToggle = () => setDialog(!dialog);

    const handleValueChange = (e) => {
        const { name, value } = e.target;
        if (name === 'word') setWord(value);
        if (name === 'weight') setWeight(value);
    };

    const handleSubmit = () => {
        const newWord = {
            word: word,
            weight: weight
        };
        handleDialogToggle();
        if (!newWord.word || !newWord.weight) {
            return;
        }
        fetch(`${databaseURL}/words.json`, {
            method: 'POST',
            body: JSON.stringify(newWord)
        }).then(res => {
            if (res.status !== 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(data => {
            setWords(prevWords => ({
                ...prevWords,
                [data.name]: newWord
            }));
            setWord('');
            setWeight('');
        });
    };

    const handleDelete = (id) => {
        fetch(`${databaseURL}/words/${id}.json`, {
            method: 'DELETE'
        }).then(res => {
            if (res.status !== 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(() => {
            setWords(prevWords => {
                const updatedWords = { ...prevWords };
                delete updatedWords[id];
                return updatedWords;
            });
        });
    };

    return (
        <div>
            {Object.keys(words).map(id => {
                const word = words[id];
                if (!word) return null;
                return (
                    <Card key={id}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                가중치: {word.weight}
                            </Typography>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Typography variant="h5" component="h2">
                                        {word.word}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button variant="contained" color="primary" onClick={() => handleDelete(id)}>삭제</Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                );
            })}
            <Fab color="primary" className={classes.fab} onClick={handleDialogToggle}>
                <AddIcon />
            </Fab>
            <Dialog open={dialog} onClose={handleDialogToggle}>
                <DialogTitle>단어 추가</DialogTitle>
                <DialogContent>
                    <TextField label="단어" type="text" name="word" value={word} onChange={handleValueChange} fullWidth /> <br />
                    <TextField label="가중치" type="text" name="weight" value={weight} onChange={handleValueChange} fullWidth /> <br />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>추가</Button>
                    <Button variant="outlined" color="primary" onClick={handleDialogToggle}>닫기</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Voca;
