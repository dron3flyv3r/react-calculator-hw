import { Output } from "./Output";
import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./App.sass";
import { evaluate } from "./evaluate";

export const ACTION = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

const INTEGER_FORMATER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0
});

function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split(".")
  if (decimal == null) return INTEGER_FORMATER.format(integer)
  return `${INTEGER_FORMATER.format(integer)}.${decimal}`;
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTION.ADD_DIGIT:
      if (state.overwrite) {
        return {
          currentOperand: payload.digit,
          overwrite: false,
        };
      }

      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }

      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    case ACTION.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };
    case ACTION.CLEAR:
      return {};

    case ACTION.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: null,
          overwrite: false,
        };
      }
      if (state.currentOperand == null) {
        return state;
      }

      if (state.currentOperand.lenght === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };

    case ACTION.EVALUATE:
      if (state.operation == null || state.currentOperand == null || state.previousOperand == null) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };
    default:
      return state;
  }
}

export default function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {});

  return (
    <div className="calculator-grid">
      <Output previousOperand={formatOperand(previousOperand)} operation={operation} currentOperand={formatOperand(currentOperand)} />
      <button className="span-two" onClick={() => dispatch({ type: ACTION.CLEAR })}>
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTION.DELETE_DIGIT })}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />

      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />

      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />

      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />

      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({ type: ACTION.EVALUATE })}>
        =
      </button>
    </div>
  );
}
