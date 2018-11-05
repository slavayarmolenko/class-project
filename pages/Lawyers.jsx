import React from 'react';
import ReactTable from 'react-table';
import axios from 'axios';
import Lawyer from './Lawyer.jsx';
class Lawyers extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            dataLoaded: false,
            error: null
        };
        
    }
    componentDidMount() {
        var self = this;

        axios.get('/api/lawyers')
                .then(result => {
                    this.setState({
                        data: result.data.data,
                        dataLoaded: true
                    });
                })
                .catch(error => { 
                    this.setState({
                        error: error.Error,
                        dataLoaded: false
                    });
                    
                });
                    


    }
    render() {

        console.log('render lawyers');

        const columns = [{
                Header: 'Name',
                accessor: 'name' // String-based value accessors!
            }, {
                Header: 'email',
                accessor: 'email',
            }, {
                Header: 'description',
                accessor: 'description'
            }];
        
        const { data, dataLoaded, error } = this.state;
        if (error) {
            return <p>{error}</p>;
        } else {




            return (
                    <div>
                        <ReactTable
                            data={data}
                            columns={columns}
                            pageSize="10"
                        />
                        <div className="classForm">    
                            <Lawyer />
                        </div>
                    </div>
                    );
        }
    }

}
export default Lawyers;