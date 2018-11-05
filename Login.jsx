import React from 'react';
import ReactTable from 'react-table';
import 'whatwg-fetch';
import axios from 'axios';
class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            dataLoaded: false,
            error: null,
            login: '',
            password: '',
            ssid: '',
            success: false,
            admin: true
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });

    }
    handleSubmit(event) {
        event.preventDefault();

        axios.post('/api/login', { login: 'Vasya', password: 'aaa123' })
            .then(result => {
                /*this.setState({
                    data: result.data.data,
                    dataLoaded: true
                });*/
                console.log("Logged in");
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
    componentDidMount() {
        var self = this;
    }
    render() {

        console.log('render lawyers');

        const { data, dataLoaded, error } = this.state;
        var self = this;
        axios.post('/api/login', { login: 'Vasya', password: 'aaa123' })
            .then(function (res) {
                console.log('Getting response');
                console.log(res);
                return res.json();
            })
            .then(function (login) {
                console.log('Getting json');
                console.log(login);
                if (!self.state.dataLoaded) {

                    self.setState({ success: login.success, login: login.login, ssid: login.ssid });
                }
            });
        if (error) {
            return <p>{error}</p>;
        } else if (self.state.success) {
            return (
                <div>
                    Youre logged in!
                    </div>
            );
        } else {
            return (
                <div>
                    <form onSubmit={this.handleSubmit}>
                        Login:
                            <input type="text" name="login" value={this.state.login} onChange={this.handleInputChange} /><br />
                        Password:
                            <input type="password" name="password" value={this.state.password} onChange={this.handleInputChange} /><br />
                        <input type="submit" value="Submit" />
                    </form>
                </div>
            );
        }
    }

}
export default Login;