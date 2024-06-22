import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppShell from "../components/AppShell";
import Inputword from "./Inputword";
import TodoList from "./TodoList";
import Voca from "./Voca";
import Logout from "../GoogleSingin/Logout"

function Home() {
    return (
        <Router>
            <AppShell>
                <Routes>
                    <Route path="/" element={<div>Welcome to Home</div>} />
                    <Route path="/Input" element={<Inputword />} />
                    <Route path="/TodoList" element={<TodoList />} />
                    <Route path="/Voca" element={<Voca />} />
                    <Route path="/Logout" element={<Logout />} />
                </Routes>
            </AppShell>
        </Router>
    );
}

export default Home;
