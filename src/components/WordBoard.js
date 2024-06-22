import React, { useState } from "react";
import WordItem from "./WordItem";

function WordBoard(props) {
    const [selectedItems, setSelectedItems] = useState([]);

    const toggleCheckbox = (index) => {
        if (selectedItems.includes(index)) {
            setSelectedItems(selectedItems.filter(item => item !== index));
        } else {
            setSelectedItems([...selectedItems, index]);
        }
    };

    const handleDelete = () => {
        if (selectedItems.length === 0) return; // No items selected

        // Show confirmation popup
        const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
        if (confirmDelete) {
            const updatedList = props.wordList.filter((item, index) => !selectedItems.includes(index));
            props.setWordList(updatedList);
            setSelectedItems([]);
        }
    };

    return (
        <div>
            <button style={{ marginTop: '20px' }} onClick={handleDelete}>삭제</button>
            {props.wordList.map((item, index) => (
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }} key={index}>
                    <input
                        type="checkbox"
                        style={{ marginRight: '10px' }}
                        checked={selectedItems.includes(index)}
                        onChange={() => toggleCheckbox(index)}
                    />
                    <WordItem item={item} />
                </div>
            ))}
        </div>
    );
}

export default WordBoard;
