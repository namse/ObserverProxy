import React, { Component } from 'react';
import './App.css';
import Hello from './Hello';
import OnlyOne from './OnlyOne';
import { getGlobalStateForReactComponent } from './GlobalState/getGlobalState';
import { CalculatorActions } from './GlobalState/StateAndActions/CalculatorActions';

class App extends Component {
  state = {
    showTest: true,
  };

  private globalState = getGlobalStateForReactComponent(this);

  public componentDidMount() {
    // console.log(this.globalState);
    // setTimeout(() => {
    //   console.log('----before 1----');
    //   this.globalState.objectProperty.child.value = 'veresdave 1';
    //   this.globalState.arrayArrayObjectProperty[0][2].value = 'ㅗㅜㅑ';
    //   console.log('after 1');
    // }, 1000);

    // setTimeout(() => {
    //   console.log('----before 2----');
    //   this.globalState.objectProperty = {
    //     child: {
    //       value: 'NybbleNaut 2',
    //     },
    //   };
    //   console.log('after 2');
    //   console.log(this.globalState);
    // }, 2000);

    // setTimeout(() => {
    //   console.log('----before 3----');
    //   this.globalState.arrayProperty = [];
    //   this.globalState.objectProperty.child.value = 'wtfblub 3';
    //   console.log('after 3');
    // }, 3000);

    // setTimeout(() => {
    //   console.log('----before 4----');
    //   this.setState({
    //     showTest: false,
    //   });
    //   console.log('after 4');
    // }, 4000);

    // setTimeout(() => {
    //   console.log('----before 5----');
    //   this.globalState.objectProperty.child.value = 'Black Morty 5';
    //   console.log('after 5');
    // }, 5000);

    // setTimeout(() => {
    //   console.log('----before 6----');
    //   this.setState({
    //     showTest: true,
    //   });
    //   console.log('after 6');
    // }, 6000);

    // setTimeout(() => {
    //   console.log('----before 7----');
    //   this.globalState.objectProperty.child.value = 'countoren 7';
    //   console.log('after 7');
    // }, 7000);

    // setTimeout(() => {
    //   console.log('----before 8----');
    //   this.globalState.arrayProperty[1] = '11';
    //   console.log('after 8');
    // }, 8000);
  }

  onPlusButtonClick(number: number) {
    CalculatorActions.inputNumber(number);
  }

  onClearButtonClick() {
    CalculatorActions.clear();
  }

  renderCalculatorButtons() {
    const calculatorButtons = [];
    for (let i = 1; i < 9; i += 1){
      const calculatorButton = <button onClick={() => this.onPlusButtonClick(i)}>{i}</button>;
      calculatorButtons.push(calculatorButton);
    }
    return calculatorButtons;
  }

  render() {
    const calculatorButtons = this.renderCalculatorButtons();
    return (
      <div className="App">
        <header className="App-header">
          <p>
            {this.globalState.objectProperty.child.value}
            <br></br>
            {this.globalState.arrayArrayObjectProperty[0][0].value}
            <br></br>
            {this.globalState.arrayProperty[0]}
          </p>
          {this.state.showTest ? <Hello testBoolean={false} testNumber={123} testString="test123"></Hello> : false}
          <OnlyOne></OnlyOne>

          {this.globalState.calculator.number}
          {calculatorButtons}
          <button onClick={() => this.onClearButtonClick()}>C</button>
        </header>
      </div>
    );
  }
}

export default App;
