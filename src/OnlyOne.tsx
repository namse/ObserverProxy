import React, { Component } from 'react';
import getGlobalState from './getGlobalState';

export default class OnlyOne extends Component {
  private globalState = getGlobalState(this);

  render() {
    return (
      <div className="App">
        {this.globalState.arrayProperty[1]}
      </div>
    );
  }
}
