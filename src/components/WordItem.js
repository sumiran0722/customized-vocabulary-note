import React from "react";
import '../styles/WordItem.css';
import Checkbox from '@material-ui/core/Checkbox'; 

function WordItem(props) {

    return (
        <div> 
            <div>
                <div>
                    <h6>
                        {props.item.type === 'word' ? '단어' : '예문'}
                        - {props.item.category}
                    </h6>
                </div>
            </div>
            <div>
                <div>
                    <strong>영어 :</strong> {props.item.word}
                    <strong>뜻 :</strong> {props.item.meaning}
                </div>
                <div>
                    <h6><strong>Hint :</strong> {props.item.hint}</h6>
                </div>                
            </div>
        </div>
    );
    
    
}

export default WordItem;
