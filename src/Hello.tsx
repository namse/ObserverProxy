import React, { Component } from 'react';
import getGlobalState from './getGlobalState';

interface IHelloProps {
  testNumber: number;
  testString: string;
  testBoolean: boolean;
}

export default class Hello extends Component<IHelloProps, any> {
  private globalState = getGlobalState(this);

  render() {
    return (
      <div className="App">
        {this.globalState.abc}
      </div>
    );
  }
}
