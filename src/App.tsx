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
      console.log('before 1');
      this.globalState.objectProperty.child.value = 'veresdave 1';
      this.globalState.arrayProperty[0][0].value = 'ㅗㅜㅑ';
      console.log('after 1');
    }, 1000);

    setTimeout(() => {
      console.log('before set objectProperty');
      this.globalState.objectProperty = {
        child: {
          value: 'NybbleNaut 2',
        },
      };
      console.log('after set objectProperty');
    }, 2000);

    setTimeout(() => {
      console.log('before set objectProperty');
      this.globalState.objectProperty.child.value = 'wtfblub 3';
      console.log('after set objectProperty');
    }, 3000);

    setTimeout(() => {
      this.setState({
        showTest: false,
      });
    }, 4000);

    setTimeout(() => {
      console.log('before set objectProperty');
      this.globalState.objectProperty.child.value = 'Black Morty 5';
      console.log('after set objectProperty');
    }, 5000);

    setTimeout(() => {
      this.setState({
        showTest: true,
      });
    }, 6000);

    setTimeout(() => {
      console.log('before set objectProperty');
      this.globalState.objectProperty.child.value = 'countoren 7';
      console.log('after set objectProperty');
    }, 7000);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            {this.globalState.objectProperty.child.value}
            <br></br>
            {this.globalState.arrayProperty[0][0].value}
          </p>
          {this.state.showTest ? <Hello testBoolean={false} testNumber={123} testString="test123"></Hello> : false}
        </header>
      </div>
    );
  }
}

export default App;
