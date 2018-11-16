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
import Sponsors from './pages/Sponsors.jsx';
import Volonteers from './pages/Volonteers.jsx';
import Partners from './pages/Partners.jsx';
import About from './pages/About.jsx';
import Donate from './pages/Donate.jsx';
import Login from './pages/Login.jsx';
import AddLawyer from './pages/AddLawyer.jsx';
import Lawyer from './pages/Lawyer.jsx';
import {URLs} from './utils/URLs.js';

const home = () => <Home></Home>;
const contact = () => <Contact></Contact>;
const about = () => <About></About>;
const team = () => <Team></Team>;
const lawyers = () => <Lawyers></Lawyers>;
const donate = () => <Donate></Donate>;
const login = () => <Login></Login>;
const addLawyer = () => <AddLawyer></AddLawyer>;
const lawyer = (input) => <Lawyer id={input.match.params.id}></Lawyer>;
const sponsors = () => <Sponsors></Sponsors>;
const partners = () => <Partners></Partners>;
const volonteers = () => <Volonteers></Volonteers>;


const AppRouter = () => (
    <Router>
        <div>
            <Header/>


                <Route path="/" exact component={home} />
                <Route path="/about/" component={about} />
                <Route path={URLs.pages.ATTORNEYS} component={lawyers} />
                <Route path="/donate/" component={donate} />
                <Route path="/team/" component={team} />
                <Route path="/contact/" component={contact} />
                <Route path="/login/" component={login} />
                <Route path="/addattorney/" component={addLawyer} />
                <Route path="/attorney/:id" component={lawyer} />
                <Route path="/sponsors/" component={sponsors} />
                <Route path="/partners/" component={partners} />
                <Route path="/volonteers/" component={volonteers} />
            <Footer/>
        </div>
    </Router>
);

export default AppRouter;