import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

//Button used to enter single digit, each button passed handleInput() from Calculator
class NumButton extends React.Component {
  render() {
    return (
      <button className="num-button" id="number-button" onClick={() => this.props.inputFunc(this.props.value.toString())}>{this.props.value}</button>
    );
  }
}

//Collection of buttons 0-9, passed handleInput() function from Calculator
class NumPad extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      buttons: []
    }
  }
  componentDidMount(){
    var temp = [];
    for(var i = 0; i < 10; i++){
      temp.push(<NumButton inputFunc={(input) => this.props.inputFunc(input)} value={i} key={i} />)
    }
    this.setState({
      buttons: temp
    })
  }

  render() {
    return (
      <div>
        <div>{this.state.buttons[1]}{this.state.buttons[2]}{this.state.buttons[3]}</div>
        <div>{this.state.buttons[4]}{this.state.buttons[5]}{this.state.buttons[6]}</div>
        <div>{this.state.buttons[7]}{this.state.buttons[8]}{this.state.buttons[9]}</div>
        <div>{this.state.buttons[0]}</div>
      </div>
    );
  }
}

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

//Button for decimal input, passed handleDecimal() from Calculator
class Decimal extends React.Component {
  render(){
    return(
      <button id="decimal" onClick={() => this.props.inputFunc('.')}>.</button>
    );
  }
}

//Passed handleClear() function from Calculator
class Clear extends React.Component {
  render(){
    return(
      <button id="clear" onClick={() => this.props.clearFunc()}>Clear</button>
    );
  }
}

//Passed handleEnter() function from Calculator
class Enter extends React.Component {
  render(){
    return(
      <button id="enter" onClick={() => this.props.enterFunc()}>Enter</button>
    );
  }
}

class Delete extends React.Component {
  render(){
    return(
      <button id="delete" onClick={() => this.props.deleteFunc()}>Delete</button>
    );
  }
}

//Main component, contains app logic
class Calculator extends Component {
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
  }

  //Handles input of digits
  handleInput = (input) => {
    //State cleared if last input was Enter button
    if(this.state.answer !== ''){
      this.handleClear();
    }
    //Prevents input of 40 or more chars
    if(this.state.inputString.length >= 40)
      return;
    //Was last input something other than a digit? Ensures space between numbers and operators
    if(!this.state.numInput){
      var temp = ' ';
      temp = temp.concat(input);
      this.setState({
        inputString: this.state.inputString.concat(temp),
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
    //Prevents input of more than 40 chars, input of operators as first char and input of operators directly after decimals
    if(this.state.inputString.length >= 40 
      || this.state.inputString.length < 1 
      || this.state.currentInput.charAt(this.state.currentInput.length - 1) === '.')
      return;
    //Was last input a digit? Ensures space between operators and numbers
    if(this.state.numInput){
      let temp = ' ';
      temp = temp.concat(operator);
      this.setState({
        inputString: this.state.inputString.concat(temp),
        currentInput: operator,
        numInput: false
      })
      return;
    }
    //If last input was operator, that operator is replaced with new input
    let temp = this.state.inputString.slice(0, -1);
    temp = temp.concat(operator);
    this.setState({
      inputString: temp,
      currentInput: operator
    });
  }

  //Handles input of a decimal point
  handleDecimal = () => {
    //Prevents input of more than 40 char
    if(this.state.inputString.length >= 40)
      return;
    //Resets state if last input was Enter
    if(this.state.answer !== ''){
      this.handleClear();
    }
    if(this.state.currentInput.includes('.')){
      return
    }
    var temp = this.state.inputString;
    if(!this.state.numInput){
      this.setState({
        inputString: temp.concat(' 0.'),
        currentInput: '0.',
        numInput: true
      });
      return
    }
    this.setState({
      inputString: temp.concat('.'),
      currentInput: this.state.currentInput.concat('.')
    });
  }

  //This is where all calculations take place
  handleEnter = () => {
    //Prevents code from running if last input was decimal point or operator
    if(/^[+-/x.]/.test(this.state.inputString.charAt(this.state.inputString.length - 1)))
      return;

    //Parse inputString on ' ' to create array of numbers and operators
    var input = this.state.inputString.split(' ');

    //This next block uses Shunting Yard to convert input from infix notation to reverse polish notation, 
    //link: https://brilliant.org/wiki/shunting-yard-algorithm/

    var output = [];
    var opStack = [];

    //Put numbers on output stack and operators on opStack, x takes precedence over / which takes precedence over + and -
    for(let i = 1; i < input.length; i++){
      if(/^[0-9]/.test(input[i])){
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

    //Performs operations then replaces operator and values 
    //with single result element until output stack contains only one element
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
    this.setState({
      inputString: '',
      currentInput: '',
      numInput: false, 
      answer: Math.round(output[0]*100000000000)/100000000000
    })
    console.log(output);
  }

  handleDelete = () => {
    if(this.state.inputString.length < 1 || this.state.answer !== '')
      return;
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
      let newCurrent = this.state.currentInput.slice(0, -1);
      this.setState({
        inputString: newInput,
        currentInput: newCurrent
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

  handleClear = () => {
    this.setState({
      inputString: '',
      currentInput: '',
      numInput: false,
      answer: ''
    });
  }

  render(){
    return (
      <div className="calculator">
        <div className="past-input">{this.state.inputString}</div>
        <div className="current-input">{this.state.answer}{this.state.currentInput}</div>
        <NumPad className="numpad" inputFunc={(input) => this.handleInput(input)}/>
        <OpButtons inputFunc={(input) => this.handleOpInput(input)}/>
        <Decimal inputFunc={() => this.handleDecimal()}/>
        <Clear clearFunc={() => this.handleClear()}/>
        <Enter enterFunc={() => this.handleEnter()}/>
        <Delete deleteFunc={() => this.handleDelete()}/>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>React Calculator</h2>
        </div>
        <Calculator/>
      </div>  
    );
  }
}

export default App;
