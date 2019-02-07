import React, { Component } from 'react';
import './App.css';
import Hello from './Hello';
import getGlobalState from './getGlobalState';

class App extends Component {
  state = {
    showTest: true,
  };

  private globalState = getGlobalState(this);

  public componentDidMount() {
    setTimeout(() => {
      console.log('before set abc');
      this.globalState.abc = 111;
      console.log('after set abc');
    }, 1000);
    setTimeout(() => {
      this.setState({
        showTest: false,
      });
    }, 2000);
    setTimeout(() => {
      console.log('before set abc');
      this.globalState.abc = 333;
      console.log('after set abc');
    }, 3000);
    setTimeout(() => {
      this.setState({
        showTest: true,
      });
    }, 4000);
    setTimeout(() => {
      console.log('before set abc');
      this.globalState.abc = 555;
      console.log('after set abc');
    }, 5000);

    // dom update test. dom shouldn't redraw if state is the same.
    setTimeout(() => {
      console.log('before set abc');
      this.globalState.abc = 123;
      console.log('after set abc');
    }, 6000);
    setTimeout(() => {
      console.log('before set abc');
      this.globalState.abc = 123;
      console.log('after set abc');
    }, 7000);
    setTimeout(() => {
      console.log('before set abc');
      this.globalState.abc = 123;
      console.log('after set abc');
    }, 8000);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            {this.globalState.abc}
          </p>
          {this.state.showTest ? <Hello testBoolean={false} testNumber={123} testString="test123"></Hello> : false}
        </header>
      </div>
    );
  }
}

export default App;
