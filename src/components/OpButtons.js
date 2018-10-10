import React from 'react';

//Contains +, -, x and / buttons, passed handleOpInput() from Calculator
class OpButtons extends React.Component {
    render(){
      return(
        <div>
          <button id="op-button" onClick={() => this.props.inputFunc('+')}>+</button>
          <button id="op-button" onClick={() => this.props.inputFunc('-')}>-</button>
          <button id="op-button" onClick={() => this.props.inputFunc('x')}>x</button>
          <button id="op-button" onClick={() => this.props.inputFunc('/')}>/</button>
        </div>
      );
    }
  }

export default OpButtons;