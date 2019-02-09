import { getGlobalState } from "../getGlobalState";

const globalState = getGlobalState();

export const CalculatorActions = {
  inputNumber(number: number) {
    globalState.calculator.number = (globalState.calculator.number * 10) + number;
  },
  clear() {
    globalState.calculator.number = 0;
  }
}

