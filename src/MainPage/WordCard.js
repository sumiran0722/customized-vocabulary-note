import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';

const WordItem = ({ item, onToggleImportant }) => (
    <div style={{
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '10px',
        width: '80%',
        margin: '10px auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
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

export default WordItem;
