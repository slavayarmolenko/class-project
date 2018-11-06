import React from 'react';
import axios from 'axios';

class Lawyer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            description: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.onReset = this.onReset.bind(this);
    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
          [name]: value
        });
    }
    onReset(event) {
        this.setState({ 
            name: '',
            email: '',
            description: ''
        });
    }
    handleSubmit(event) {
            event.preventDefault();
            /*var validation = this.refs.form.value().validation;
            if (ReactForms.validation.isFailure(validation)) {
              console.log('invalid form');
              return;
            }
            */
            console.log('Form is valid');
            let data = this.state;
            if (data.name !== '' && data.email !== '' && data.description !== '') {
                console.log('name', data.name, 'email ', data.email, 'description ', data.description);
                axios.post('/api/lawyers', JSON.stringify(data))
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
            } else {
                alert('Some data is not filled');
            }
            
    }
    componentDidMount() {
        var self = this;
    }
    render() {

        //const { data, dataLoaded, error } = this.state;
        //if (error) {
        //    return <p>{error}</p>;
        //} else {

            return (   
                <div className="container">
                    <form onSubmit={this.handleSubmit}>
                        <label>Name</label><input type="text" name="name" value={this.state.name} onChange={this.handleInputChange} />
                        <label>E-mail</label><input type="text" name="email" value={this.state.email} onChange={this.handleInputChange} />
                        <label>Description</label><textarea name="description" value={this.state.description} onChange={this.handleInputChange} />
                        <div class="buttons">
                            <button type="button" onClick={this.onReset}>Reset Form</button>
                            <button type="submit">Submit</button>
                        </div>
                      </form>
                </div>
                    );
        }
    //}

}
export default Lawyer;