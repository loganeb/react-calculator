import React from 'react';

//Button for decimal input, passed handleDecimal() from Calculator
export const Decimal = (props) => {
    return(
        <button id="decimal" onClick={() => props.inputFunc('.')}>.</button>
    );
    
}
  
  //Passed handleClear() function from Calculator
export const Clear = (props) => {
    
    return(
        <button id="clear" onClick={() => props.clearFunc()}>Clear</button>
    );
    
}
  
  //Passed handleEnter() function from Calculator
export const Enter = (props) => {
    
    return(
        <button id="enter" onClick={() => props.enterFunc()}>Enter</button>
    );
    
}
  
export const Delete = (props) => {
      
    return(
        <button id="delete" onClick={() => props.deleteFunc()}>Delete</button>
    );

}