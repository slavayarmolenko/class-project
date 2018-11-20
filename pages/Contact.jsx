import React from 'react';

class Contact extends React.Component {
    render() {
        return (
            <div className="container pageContent">
                <h1>Contact</h1>
                <p>
                Call us: +1(650)-665-45-83 Slava   
                </p> 
                <p>Contact us via <a href="mailto:slava.yarmolenko@example.com?Subject=How%20is%20the%20progress" target="_top">email.</a>
                </p>
            </div>
        );
    }
}
export default Contact;