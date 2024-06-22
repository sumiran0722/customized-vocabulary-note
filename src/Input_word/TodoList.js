import React, {useState} from "react";
import TodoBoard from "../components/TodoBoard";
import '../styles/TodoList.css';

function TodoList() {
    const [inputValue, setInputValue] = useState('')
    const [TodoList, setTodoList] = useState([])
    const addItem = () => {
        console.log("I'm here", inputValue)
        setTodoList([...TodoList, inputValue])
    }
    return(
        <div>
            <input value = {inputValue} type = "text" onChange = 
            {(event)=>setInputValue(event.target.value)}/>
            <button onClick={addItem}>추가</button>

            <TodoBoard TodoList = {TodoList}/>
        </div>
        
    )
}

export default TodoList;
