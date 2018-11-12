/*
Vladislav Iarmolenko
slava.yarmolenko@gmail.com
Created: August 2018
*/
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Contact from './pages/Contact.jsx';
import Team from './pages/Team.jsx';
import Lawyers from './pages/Lawyers.jsx';
import About from './pages/About.jsx';
import Donate from './pages/Donate.jsx';
<<<<<<< HEAD
import Login from './pages/Login.jsx';
=======
import AddLawyer from './pages/AddLawyer.jsx';
>>>>>>> 679348596ea9dec4d0e30c84965d788e8c750c00

const home = () => <Home></Home>;
const contact = () => <Contact></Contact>;
const about = () => <About></About>;
const team = () => <Team></Team>;
const lawyers = () => <Lawyers></Lawyers>;
const donate = () => <Donate></Donate>;
<<<<<<< HEAD
const login = () => <Login></Login>;
=======
const addLawyer = () => <AddLawyer></AddLawyer>;
>>>>>>> 679348596ea9dec4d0e30c84965d788e8c750c00


const AppRouter = () => (
    <Router>
        <div>
            <Header/>


                <Route path="/" exact component={home} />
                <Route path="/about/" component={about} />
                <Route path="/lawyers/" component={lawyers} />
                <Route path="/donate/" component={donate} />
                <Route path="/team/" component={team} />
                <Route path="/contact/" component={contact} />
<<<<<<< HEAD
                <Route path="/login/" component={login} />
=======
                <Route path="/addlawyer/" component={addLawyer} />
>>>>>>> 679348596ea9dec4d0e30c84965d788e8c750c00
            <Footer/>
        </div>
    </Router>
);

export default AppRouter;