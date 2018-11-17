import React from 'react';
import Companies from '../components/Companies.jsx';

class Sponsors extends React.Component {
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
                    <h1>Sponsors</h1>
                    <div className="error">{this.state.errorText}</div>
                    <Companies companyType="2"></Companies>
                </div>
                )
    }

}
export default Sponsors;