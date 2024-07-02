import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppShell from "../components/AppShell";
import Inputword from "./Inputword";
import TodoList from "./TodoList";
import Voca from "./Voca";
import CardVoca from './CardVoca';
import Logout from "../GoogleSingin/Logout";
import VocaForCard from './VocaForCard';

function Home() {
    // selectedWords 배열을 초기화
    const selectedWords = ['word1', 'word2', 'word3'];

    return (
        <Router>
            <AppShell>
                <Routes>
                    <Route path="/" element={<div>Welcome to Home</div>} />
                    <Route path="/Input" element={<Inputword />} />
                    <Route path="/TodoList" element={<TodoList />} />
                    <Route path="/Voca" element={<Voca />} />
                    <Route path="/CardVoca" element={<CardVoca />} />
                    <Route path="/VocaForCard" element={<VocaForCard />} />
                    <Route path="/Logout" element={<Logout />} />
                </Routes>
            </AppShell>
        </Router>
    );
}

export default Home;
