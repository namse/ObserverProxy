import React, { Component } from 'react';
import { getGlobalStateForReactComponent } from './GlobalState/getGlobalState';

interface IHelloProps {
  testNumber: number;
  testString: string;
  testBoolean: boolean;
}

export default class Hello extends Component<IHelloProps, any> {
  private globalState = getGlobalStateForReactComponent(this);

  public componentWillUnmount() {
    console.log('componentWillUnmount of Hello');
  }
  render() {
    return (
      <div className="App">
        {this.globalState.objectProperty.child.value}
        <br></br>
        {this.globalState.arrayArrayObjectProperty[0][0].value}
        <br></br>
        {this.globalState.arrayProperty[1]}
      </div>
    );
  }
}
