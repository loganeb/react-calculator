import React from 'react';
import NumPad from './NumPad';
import {Decimal, Clear, Delete, Enter} from './CmdButtons';
import OpButtons from './OpButtons';


class Calculator extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      inputString: '',
      currentInput: '',
      numInput: false,
      answer: ''
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleOpInput = this.handleOpInput.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.inputTooLong = this.inputTooLong.bind(this);
  }

  inputTooLong = () => {
    if(this.state.inputString.length > 40 
    || this.state.currentInput.length > 12)
      return true;
    else
      return false;
  }

  handleClear = (func) => {
    this.setState({
      inputString: '',
      currentInput: '',
      numInput: false,
      answer: ''
    });
  }

  //Handles input of digits
  handleInput = (input) => {
    if(this.inputTooLong())
      return;

    //Was last input enter?
    if(this.state.answer !== ''){
        this.setState({
          inputString: this.state.inputString.concat(input),
          currentInput: this.state.currentInput.concat(input),
          numInput: true,
          answer: ''
        });
        return;
    }

    //Was last input something other than a digit? Ensures space between numbers and operators
    if(!this.state.numInput && this.state.answer === ''){
      this.setState({
        inputString: this.state.inputString.concat(' ' + input),
        currentInput: input,
        numInput: true
      });
      return;
    }

    this.setState({
      inputString: this.state.inputString.concat(input),
      currentInput: this.state.currentInput.concat(input)
    });
  };

  //Handles input of operators
  handleOpInput = (operator) => {
    const inputString = this.state.inputString;
    const currentInput = this.state.inputString;
    const numInput = this.state.numInput;

    //Prevents input of more than 40 chars
    //and input of operators directly after decimals
    if(this.inputTooLong() 
      || currentInput.charAt(currentInput.length - 1) === '.')
      return;

    //Was last input a digit or "enter"? Ensures space between 
    //operators and numbers
    if(numInput || this.state.answer !== ''){
      this.setState({
        inputString: inputString.concat(' ' + operator),
        currentInput: operator,
        numInput: false,
        answer: ''
      })
      return;
    }

    //Allow negative number to begin inputString
    if(inputString.length < 1 && operator === '-'){
      this.setState({
        inputString: ' -',
        currentInput: '-',
        numInput: true,
        answer: ''
      })
      return
    }

    //Allow user to input negative number after operator call
    if(!numInput && operator === '-'){
      this.setState({
        inputString: inputString.concat(' -'),
        currentInput: '-',
        numInput: true,
        answer: ''
      })
      return
    }

    //prevents operators other than '-' as first char in inputString
    if(inputString.length <= 1)
      return

    /* If last input was operator and new operator is not "-",
    that operator is replaced with new input */
    this.setState({
      inputString: inputString.slice(0, -1).concat(operator),
      currentInput: operator,
      numInput: false
    });
  }

  //Handles input of a decimal point
  handleDecimal = () => {
    //Prevents input of more than 40 char
    if(this.inputTooLong())
      return
    
    const inputString = this.state.inputString;
    const currentInput = this.state.currentInput;

    //Resets state if last input was Enter
    if(this.state.answer !== ''){
      this.setState({
        inputString: ' 0.',
        currentInput: '0.',
        numInput: true,
        answer: ''
      });
      return
    }

    if(!this.state.numInput){
      this.setState({
        inputString: inputString.concat(' 0.'),
        currentInput: '0.',
        numInput: true
      });
      return
    }

    if(currentInput.includes('.')){
      return
    }

    this.setState({
      inputString: inputString.concat('.'),
      currentInput: currentInput.concat('.')
    });
  }

  //This is where all calculations take place
  handleEnter = () => {
    const inputString = this.state.inputString;
    //Prevents code from running if last input was decimal point 
    //or operator
    if(inputString.length <= 1 
    || /^[+-/x.]/.test(inputString.charAt(inputString.length - 1)))
      return;

    //Parse inputString on ' ' to create array of numbers and 
    //operators
    var input = inputString.split(' ');

    /* This next block uses Shunting Yard to convert input from 
    infix notation to reverse polish notation
    link: https://brilliant.org/wiki/shunting-yard-algorithm/ */

    var output = [];
    var opStack = [];

    /* Put numbers on output stack and operators on opStack 
    "x" takes precedence over "/" which takes precedence 
    over "+"" and "-" */
    for(let i = 1; i < input.length; i++){
      if(input[i].length > 1 || /^[0-9]/.test(input[i])){
        output.push(parseFloat(input[i]));
      }
      else if (input[i] === 'x'){
        opStack.push(input[i]);
      }
      else if (input[i] === '/'){
        if(opStack.length > 0 && opStack[opStack.length -1] === 'x'){
          let j = opStack.length - 1;
          while(j >= 0 && opStack[j] === 'x'){
            output.push(opStack.pop());
            j--;
          }
          
        }
        opStack.push(input[i]);
      }
      else if (input[i] === '+' || input[i] === '-'){
        if(opStack.length > 0 && /^[x/]*$/.test(opStack[opStack.length - 1])){
          let j = opStack.length - 1;
          while( j >= 0 && /^[x/]*$/.test(opStack[j])){
            output.push(opStack.pop());
            j--;
          }
        }
        opStack.push(input[i]);
      }
    }

    //reverse opStack and add to output stack
    output = output.concat(opStack.reverse());

    /* Performs operations then replaces operator and values 
    with single result element until output stack contains 
    only one element */
    while(output.length > 1){
      let i = 0;
      while(!/^[x/+-]*$/.test(output[i])){
        i++
      }
      let temp = 0;
      switch(output[i]){
        case 'x':
          temp = output[i-1]*output[i-2];
          output.splice(i-2, 3, temp);
          break;

        case '/':
          temp = output[i-2]/output[i-1];
          output.splice(i-2, 3, temp);
          break;

        case '+':
          temp = output[i-1]+output[i-2];
          output.splice(i-2, 3, temp);
          break;

        case '-':
          temp = output[i-2]-output[i-1];
          output.splice(i-2, 3, temp);
          break;

        default:
          break;
      }
    }

    //Round final answer if greater than desired # of digits
    let precise = output[0];
    let answerLength = (precise + '').replace('.', '').length;

    if(answerLength > 10){
      precise = Math.round((precise.toPrecision(10) * 10000000000))/10000000000;
    }

    this.setState({
      inputString: ' ' + precise.toString(),
      currentInput: precise.toString(),
      numInput: false, 
      answer: precise
    })
  }

  handleDelete = () => {
    if(this.state.inputString.length <= 1)
      return;

    if(this.state.answer !== ''){
      this.handleClear();
      return;
    }

    let newInput = this.state.inputString.slice();

    //Delete a digit
    if(this.state.numInput){
      newInput = newInput.slice(0,-1)
      if(newInput.charAt(newInput.length-1) === ' '){
        newInput = newInput.slice(0, -1)
        this.setState({
          inputString: newInput,
          currentInput: '',
          numInput: false
        });
        return;
      }
      this.setState({
        inputString: newInput,
        currentInput: this.state.currentInput.slice(0, -1)
      });
      return;
    }

    //Delete an operator
    newInput = newInput.slice(0, -2);
    this.setState({
      inputString: newInput,
      currentInput: '',
      numInput: true
    });
    
  }

  render(){
    return (
      <div className="calculator">
        <div className="screen">
          <div className="past-input">{this.state.inputString}</div>
          <div className="current-input">{this.state.currentInput}</div>
        </div>
        <div className="buttons">
        
          <div className="top-buttons">
            <Clear className="Clear" clearFunc={() => this.handleClear()}/>
            <Delete className="Delete" deleteFunc={() => this.handleDelete()}/>
          </div>
            
          <NumPad inputFunc={(input) => this.handleInput(input)}/>
          
          <div className="side-buttons">
            <OpButtons className="OpButtons" inputFunc={(input) => this.handleOpInput(input)}/>
            <Decimal className="Decimal" inputFunc={() => this.handleDecimal()}/>
            <Enter className="Enter" enterFunc={() => this.handleEnter()}/>
          </div>
          
        </div>
        
      </div>
    );
  }
}

export default Calculator;