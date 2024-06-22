import React from "react";
import WordItem from "./WordItem";

function WordBoard(props) {
    return (
        <div>
            {props.wordList.map((item, index) => (
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }} key={index}>
                    {/* 체크 박스 */}
                    <input type="checkbox" style={{ marginRight: '10px' }} />
                    {/* 단어 아이템 */}
                    <WordItem item={item} />
                </div>
            ))}
        </div>
    )
}

export default WordBoard;
