import React from 'react';
import Home from './Home.jsx';
import Contact from './Contact.jsx';
import Team from './Team.jsx';
import Lawyers from './Lawyers.jsx';
import About from './About.jsx';
import Donate from './Donate.jsx';

class App extends React.Component {
   constructor() {
      super();
      var self = this;
      this.state = {
         data: 
            {
                pageLoadedName: 'Home',
                tag:(<Home/>)
            }
      };
      
      window.setInterval(function() {
           var newHash = window.location.hash ? window.location.hash.slice(1): 'Home';
           if (newHash !== self.state.data.pageLoadedName) {
               
               var tag;
               switch (newHash) {
                   case 'Contact':
                        tag = (<Contact/>);
                        break;
                    case 'Team':
                        tag = (<Team/>);
                        break;
                    case 'Donate':
                        tag = (<Donate/>);
                        break;
                    case 'About':
                        tag = (<About/>);
                        break;
                    case 'Lawyers':
                        tag = (<Lawyers/>);
                        break;
                    case 'Lawyers':
                        tag = (<Lawyers/>);
                        break;
                    default: 
                        tag = (<Home/>);
                        break;
               }
          
               self.setState(   { data: { pageLoadedName:  newHash,
                                        tag: tag
                                    }
                                }
                            );
               console.log('Page hash changed to ' + newHash);
           }
       }, 500);
   }
   render() {
       
       
      var aStyle = {
          fontSize: 20,
          marginRight: 20,
      }
      return (
        
         <div class="map-header">
            <div>
                <div class="page">
                    <div class="title">
                    <h1 class = "cls">CLASS</h1>
                    <ul class="navigation">
                        <li><a href="#Home" style={aStyle}>Home</a></li>
                        <li><a href="#Team" style={aStyle}>Team</a></li>
                        <li><a href="#Donate" style={aStyle}>Donate</a></li>
                        <li><a href="#Contact" style={aStyle}>Contact Us</a></li>
                        <li><a href="#About" style={aStyle}>About</a></li>
                        <li><a href="#Lawyers" style={aStyle}>Lawyers</a></li>
                    </ul>
                    </div>
                    <h2>{this.state.data.pageLoadedName}</h2> 
                    
                    <div class="pageContent">
                            {this.state.data.tag}
                    </div>
                </div>
            </div>

         </div>
      );
   }
}
export default App;