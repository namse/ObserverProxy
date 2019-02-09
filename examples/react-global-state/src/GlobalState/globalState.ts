import { ICalculatorState, initialCalculatorState } from "./StateAndActions/CalculatorState";

export interface IGlobalState {
  abc: number,
  objectProperty: {
    child: {
      value: string,
    }
  },
  arrayArrayObjectProperty: { value: string }[][],
  arrayProperty: string[],
  calculator: ICalculatorState,
}

export const initialGlobalState: IGlobalState = {
  abc: 123,
  objectProperty: {
    child: {
      value: "namse is Messi of bed",
    },
  },
  arrayArrayObjectProperty: [
    [
      {
        value: '0, 0',
      },
      {
        value: '0, 1',
      },
      {
        value: '0, 2',
      },
    ],
    [
      {
        value: '1, 0',
      },
      {
        value: '1, 1',
      },
      {
        value: '1, 2',
      },
    ],
  ],
  arrayProperty: ['0'],
  calculator: initialCalculatorState,
};