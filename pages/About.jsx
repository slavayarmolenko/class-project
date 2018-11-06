import React from 'react';

class About extends React.Component {
   render() {
       console.log("render about");
      return (
         <div className="container">
             <h1>About</h1>
            <div className="voloteer-img"></div>
            <div className="aboutText">
                Since the Trump Administration repealed the DACA program in September 2017, we have been concerned for our friends and classmates whose safety, academic opportunities, and DREAMs for a bright future in the country they grew up in have been compromised.  
                We are a group of Carlmont High School  and Design Tech High School students who have tasked ourselves with building a safety net and speaking up for those who are now too afraid to speak for themselves. Come join our ranks, and together we can make a difference. 
                Jenna Teterin Luz Victoria Valle Remond Nisha Marino Adrian Fernandez
            </div>
            
         </div>
      );
   }
}
export default About;