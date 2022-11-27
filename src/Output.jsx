import React from "react";
export function Output({
  previousOperand,
  operation,
  currentOperand
}) {
  return <div className="output">
        <div className="previous-operand">
          {previousOperand} {operation}
        </div>
        <div className="current-operand">{currentOperand}</div>
      </div>;
}
  