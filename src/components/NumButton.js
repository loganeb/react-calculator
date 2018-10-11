import React from 'react';

const NumButton = (props) => {
      return (
        <button className="NumButton" id={'button-'+ props.value} onClick={() => props.inputFunc(props.value.toString())}>{props.value}</button>
      );
    
  }

export default NumButton;