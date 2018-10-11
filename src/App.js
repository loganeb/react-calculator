import React, { Component } from 'react';
import Calculator from './components/Calculator';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Calculator/>

        <div className="footer">
          <a href="https://github.com/loganeb/react-calculator">
            Built by Logan Bynes
          </a>
        </div>
      </div>  
    );
  }
}

export default App;
