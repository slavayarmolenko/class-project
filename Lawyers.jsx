import React from 'react';
import ReactTable from 'react-table';
import 'whatwg-fetch';
import axios from 'axios';
class Lawyers extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            dataLoaded: false,
            error: null
        };
        this.handleSubmit = function (event) {
            event.preventDefault();
            let data = {
                name: document.formNewLawyer.name,
                email: document.formNewLawyer.email,
                description: document.formNewLawyer.description
            };
            if (data.name !== '' && data.email !== '' && data.description !== '') {
                console.log('name', data.name, 'email ', data.email, 'description ', data.description);
                fetch("/api/lawyers", {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    mode: "cors",
                    body: JSON.stringify(data)
                })
                        .then(response => response.json())
                        .then(data => console.log(data))
                        .catch(error => console.log(error));
            } else {
                alert('Some data is not filled');
            }
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
                    console.log('error::');
                    console.log('bebebe:' + error);
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
                        <form action="/api/lawyers" method="POST" name="formNewLawyer">
                            Name:
                            <input type="text" name="name"/><br/>
                            Email:
                            <input type="text" name="email" /><br/>
                            Write about yourself:
                            <input type="text" name="description"/><br/>
                            <input type="button" value="Submit" onClick="{this.handleSubmit}"/>
                        </form>
                    </div>
                    );
        }
    }

}
export default Lawyers;