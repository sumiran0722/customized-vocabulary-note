import React from 'react';
import { Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';

const AnswerReview = ({ words, answers, handleToggleImportant, handleClose }) => {
    return (
        <div>
            <h2>테스트 결과</h2>
            <List>
                {words.map((word, index) => (
                    <ListItem key={index}>
                        <ListItemText
                            primary={word.word}
                            secondary={`답변: ${answers[index]}, 뜻: ${word.meaning}`}
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => handleToggleImportant(word.id)}>
                                {word.important ? <StarIcon /> : <StarBorderIcon />}
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
            <Button onClick={handleClose} color="primary">닫기</Button>
        </div>
    );
};

export default AnswerReview;
