import React from 'react';
import NumButton from './NumButton';

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

  export default NumPad;