import React from 'react';
import ReactTable from 'react-table';
import { Link } from "react-router-dom";
import axios from 'axios';

class Lawyers extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            dataLoaded: false,
            error: null
        };
        //this.handleSubmit = this.handleSubmit.bind(this);


    }
    componentDidMount() {
        var self = this;

        axios.get('/api/lawyers')
            .then(result => {
                console.log('All Lawyers');
                console.log(result.data.data)
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
                .catch(error => {
                    console.log('error::');
                    console.log('bebebe:' + error);
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


        const columns = [
        {
            Header: 'id',
            accessor: 'id',
            show: false
        },
        {
            Header: 'Name',
            accessor: 'name', // String-based value accessors!
            Cell: (props) => <Link to={"/lawyer/" + props.row.id}>{props.value}</Link>
        }, {
            Header: 'email',
            accessor: 'email',
        }, {
            Header: 'description',
            accessor: 'description'
        }];


            return (
                <div className="container pageContent">
                    <h1>Laywers</h1>
                    <div className="filtered-layout">
                        <div className="filter">
                            <form method="GET" name="searchLawyersNear" onSubmit={this.handleSubmit.bind(this)} >
                                <div>
                                    Enter your zip:
                                <input type="text" name="usersZip" />
                                </div>
                                <div>
                                    Distance:
                                <input type="text" name="distance" />
                                </div>
                                <input type="radio" name="units" value="km" defaultChecked /> Kilometers
                            <input type="radio" name="units" value="mil" />Miles
                            <div>
                                    <input type="submit" value="Submit" />
                                </div>
                            </form>
                        </div>
                        <div className="result">
                            <ReactTable
                                data={this.state.data}
                                columns={columns}
                                pageSize="10"
                            />
                        </div>
                    </div>
                </div>
            );
        //}
    }

}
export default Lawyers;