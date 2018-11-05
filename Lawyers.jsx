/*
Vladislav Iarmolenko
slava.yarmolenko@gmail.com
Created: August 2018
*/
import React from 'react';
import ReactTable from 'react-table';
import axios from 'axios';
<<<<<<< HEAD
import Lawyer from './Lawyer.jsx';
=======
var zipcodes = require('zipcodes');
>>>>>>> 55724c999e0a063416dc5d497707e363eced9201
class Lawyers extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            dataLoaded: false,
            error: null
        };
<<<<<<< HEAD
        
=======
        //this.handleSubmit = this.handleSubmit.bind(this);


>>>>>>> 55724c999e0a063416dc5d497707e363eced9201
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
                console.log('error::');
                console.log('bebebe:' + error);
                this.setState({
                    error: error.Error,
                    dataLoaded: false
                });

            });



    }
    handleSubmit(event) {
        console.log("here");
        event.preventDefault();

        let data = {
            params: {
                usersZip: parseInt(document.searchLawyersNear.usersZip.value),
                distance: parseInt(document.searchLawyersNear.distance.value),
                units: document.searchLawyersNear.units.value
            }
        };
        console.log(data.usersZip);
        if (data.usersZip !== '' && data.distance !== '' && data.description !== '') {
            console.log('zip ', data.usersZip, 'distance ', data.distance, 'description ', data.description);

            axios.get('/api/lawyers', data)
                .then(result => {
                    console.log('Submitted laywer');
                    console.log(result.data);
                    this.setState({
                        data: result.data.data,
                        dataLoaded: true
                    });

                })
<<<<<<< HEAD
                .catch(error => { 
=======
                .catch(error => {
                    console.log('error::');
                    console.log('bebebe:' + error);
>>>>>>> 55724c999e0a063416dc5d497707e363eced9201
                    this.setState({
                        error: error.Error,
                        dataLoaded: false
                    });

                });



        } else {
            alert('Some data is not filled');
        }
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
<<<<<<< HEAD
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
=======
                <div>
                    <ReactTable
                        data={data}
                        columns={columns}
                        pageSize="10"
                    />
                    <form action="/api/lawyers" method="GET" name="searchLawyersNear" onSubmit={this.handleSubmit.bind(this)} >
                        <div>
                        Enter your zip:
                            <input type="text" name="usersZip" />
                            </div>
                            <div>
                        Distance:
                            <input type="text" name="distance" />
                            </div>
                        <input type="radio" name="units" value="km" checked/> Kilometers
                        <input type="radio" name="units" value="mil"/>Miles
                        <div>
                        <input type="submit" value="Submit"/>
                        </div>
                    </form>
                </div>
                        );
                    }
                }
            
            }
>>>>>>> 55724c999e0a063416dc5d497707e363eced9201
export default Lawyers;