import React from 'react';
import { constants } from '../utils/constants.js';
import Companies from '../components/Companies.jsx';
class Partners extends React.Component {
    constructor() {
        super();

        this.state = {
            data: [],
            dataLoaded: false,
            errorText: ''
        };

    }
    componentDidMount() {
        
    }
    render() {
        
        return (
                <div className="container pageContent">
                    <h1>Partners</h1>
                    <Companies companyType={constants.companyType.PARTNER}></Companies>
                </div>
                )
    }

}
export default Partners;