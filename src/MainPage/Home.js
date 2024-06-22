import React from "react";
import AppShell from "../components/AppShell";
import Inputword from "./Inputword";
import TodoList from "./TodoList";
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

function Home() {
    return (
        <Router>
            <AppShell>
                <Routes>
                    <Route path="/" element={<div>Home</div>} />
                    <Route path="/Input" element={<Inputword />} />
                    <Route path="/TodoList" element={<TodoList />} />
                </Routes>
            </AppShell>
        </Router>
    );
}

export default Home;
