import React from 'react';
import Companies from '../components/Companies.jsx';

class Volonteers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            dataLoaded: false, 
            errorText: ''
        };

    }
    
    render() {
        
        return (
                <div className="container pageContent">
                    <h1>Volonteers</h1>
                    <div className="error">{this.state.errorText}</div>
                    <Companies companyType="3"></Companies>
                </div>
                )
    }

}
export default Volonteers;