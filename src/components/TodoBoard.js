import React from "react";
import TodoItem from "./TodoItem";

function TodoBoard(props) {

    // console.log("todoBorad",props.TodoList)
    return (
        <div>
            <h1>Todo List</h1>
            {props.TodoList.map((item) => <TodoItem item = {item}/>)}
        </div>
    )
}


export default TodoBoard