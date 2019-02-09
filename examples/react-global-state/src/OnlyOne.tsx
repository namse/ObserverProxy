import React, { Component } from 'react';
import { getGlobalStateForReactComponent } from './GlobalState/getGlobalState';

export default class OnlyOne extends Component {
  private globalState = getGlobalStateForReactComponent(this);

  render() {
    return (
      <div className="App">
        {this.globalState.arrayProperty[1]}
      </div>
    );
  }
}
