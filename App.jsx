/*
Vladislav Iarmolenko
slava.yarmolenko@gmail.com
Created: August 2018
*/
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from './components/Header.jsx';
import ErrorList from './components/ErrorList.jsx';
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
import User from './pages/User.jsx';
import HIEROGLYPHS from './pages/HIEROGLYPHS.jsx'; 
import {URLs} from './utils/URLs.js';

import { Provider } from 'react-redux';
import store from './store';

const home = () => <Home></Home>;
const contact = () => <Contact></Contact>;
const about = () => <About></About>;
const team = () => <Team></Team>;
const lawyers = () => <Lawyers></Lawyers>;
const donate = () => <Donate></Donate>;
const login = () => <Login></Login>;
const lawyer = (input) => <Lawyer id={input.match.params.id}></Lawyer>;
const company = (input) => <Company id={input.match.params.id}></Company>;
const user = (input) => <User id={input.match.params.id}></User>;
const sponsors = () => <Sponsors></Sponsors>;
const partners = () => <Partners></Partners>;
const volonteers = () => <Volonteers></Volonteers>;
const hierogliphs = () => <HIEROGLYPHS></HIEROGLYPHS>;


const AppRouter = () => (
    
        <Router>
            <Provider store={store}>
            <div>
                <Header/>
                <ErrorList/>

                <Route path="/" exact component={home} />
                <Route path={URLs.pages.ABOUT} component={about} />
                <Route path={URLs.pages.ATTORNEYS} component={lawyers} />
                <Route path={URLs.pages.DONATE} component={donate} />
                <Route path={URLs.pages.TEAM} component={team} />
                <Route path={URLs.pages.CONTACT} component={contact} />
                <Route path={URLs.pages.LOGIN} component={login} />
                <Route path={URLs.pages.CREATE_COMPANY} component={company} />
                <Route path={URLs.pages.COMPANY + ':id'} component={company} />
                <Route path={URLs.pages.CREATE_ATTORNEY} component={lawyer} />
                <Route path={URLs.pages.ATTORNEY + ':id'} component={lawyer} />
                <Route path={URLs.pages.USER + ':id'} component={user} />
                <Route path={URLs.pages.SPONSORS} component={sponsors} />
                <Route path={URLs.pages.PARTNERS} component={partners} />
                <Route path={URLs.pages.VOLONTEERS} component={volonteers} />
                <Route path={URLs.pages.HIEROGLYPHS} component={hierogliphs} />
                
                <Footer/>
            </div>
            </Provider>
        </Router>
    
);

export default AppRouter;