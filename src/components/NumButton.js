import React from 'react';

const NumButton = (props) => {
      return (
        <button className="num-button" id="number-button" onClick={() => props.inputFunc(props.value.toString())}>{props.value}</button>
      );
    
  }

export default NumButton;