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
import Company from './pages/Company.jsx';
import Lawyer from './pages/Lawyer.jsx';
import {URLs} from './utils/URLs.js';

const home = () => <Home></Home>;
const contact = () => <Contact></Contact>;
const about = () => <About></About>;
const team = () => <Team></Team>;
const lawyers = () => <Lawyers></Lawyers>;
const donate = () => <Donate></Donate>;
const login = () => <Login></Login>;
//const create_company = () => <Company></Company>;
const create_lawyer = () => <Lawyer></Lawyer>;
const lawyer = (input) => <Lawyer id={
    input.match.params.id
}></Lawyer>;
const company = (input) => <Company id={input.match.params.id}></Company>;
const sponsors = () => <Sponsors></Sponsors>;
const partners = () => <Partners></Partners>;
const volonteers = () => <Volonteers></Volonteers>;


const AppRouter = () => (
    <Router>
        <div>
            <Header/>


                <Route path="/" exact component={home} />
                <Route path={URLs.pages.ABOUT} component={about} />
                <Route path={URLs.pages.ATTORNEYS} component={lawyers} />
                <Route path={URLs.pages.DONATE} component={donate} />
                <Route path={URLs.pages.TEAM} component={team} />
                <Route path={URLs.pages.CONTACT} component={contact} />
                <Route path={URLs.pages.LOGIN} component={login} />
                <Route path={URLs.pages.COMPANY + ':id'} component={company} />
                <Route path={URLs.pages.ATTORNEY + ':id'} component={lawyer} />
                <Route path={URLs.pages.SPONSORS} component={sponsors} />
                <Route path={URLs.pages.PARTNERS} component={partners} />
                <Route path={URLs.pages.VOLONTEERS} component={volonteers} />
            <Footer/>
        </div>
    </Router>
);

export default AppRouter;