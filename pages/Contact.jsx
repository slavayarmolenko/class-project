import React from 'react';

class Contact extends React.Component {
    render() {
        return (
            <div className="container">
                <h1>Contact</h1>
                <p>
                Call us: +1(650)-665-45-83 Slava<br/>     
                <a href="mailto:someone@example.com?Subject=Hello%20again" target="_top">Contact us via email.</a>
                </p>
            </div>
        );
    }
}
export default Contact;