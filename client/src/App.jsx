import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { Container } from 'react-bootstrap';

import API from "./API.mjs";
import NavHeader from "./components/NavHeader";
import Home from './components/HomeLayout';
import LoginForm from './components/LoginLayout';
import Game from './components/GameLayout';
import History from './components/HistoryLayout';
import NotFound from './components/NotFoundLayout';


function App() 
{
    const [user, setUser] = useState(null);
    const [loginErrMsg, setLoginErrMsg] = useState("");

    const navigate = useNavigate();

    useEffect(() => 
    {
        const checkLogin = async () =>
        {
            try
            {
                const user = await API.getUserInfo();
                setUser(user);
                setLoginErrMsg("");
            }
            catch {}
        }

        checkLogin();
    }, []);

    const handleLogin = async (username, password) => 
    {
        try 
        {
            const user = await API.logIn(username, password);
            setUser(user);
            setLoginErrMsg("");
            navigate("/");
        }
        catch(err) 
        {
            setLoginErrMsg("Email e/o password errata/e");
        }
    }

    const handleLogout = async () => 
    {
        await API.logOut();
        setUser(null);
        setLoginErrMsg("");
        navigate("/");
    }
    

    return (
    <>
        <Routes>
            <Route path = "/" element = 
            {
                <>
                    <NavHeader  user = {user} 
                                handleLogout = {handleLogout} />
                    <Container  fluid className = 'mt-4'>
                        <Outlet />
                    </Container>
                </>
            }>
                <Route index element = { <Home user = {user} /> } />

                <Route path = "/login" element = 
                    {
                        <LoginForm  handleLogin = {handleLogin}
                                    loginErrMsg = {loginErrMsg}
                                    setLoginErrMsg = {setLoginErrMsg} />
                    } />

                <Route path = "/play" element = {<Game user = {user} /> } />

                <Route path = "/user-history" element = {user && <History user = {user}/>} />

                <Route path = "*" element = { <NotFound /> } />
            </Route>
        </Routes>
    </>
    );
}


export default App;