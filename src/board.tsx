import "./App.css";
import React, { useEffect, useState } from "react";
import Grid from "./grid";
import Effect from "./effect";
import { colorToString, stringToColor } from "./helpers";

function Board() {
  const numRows = 20;
  const rowLength = 20;
  const defaultColor = "#000000";
  const [board, setBoard] = useState([<tr></tr>]);
  const [boardData, setBoardData] = useState([[new Grid()]]);
  const [effects, setEffects] = useState<typeof Effect[]>([]);
  const [currEffect, setCurrEffect] = useState(
    new Effect([numRows, rowLength], [], "#FF0000")
  );

  // Set up
  useEffect(() => {
    const newBoard = [];
    const newBoardData = [];
    for (let i = 0; i < numRows; i++) {
      let row = [];
      let dataRow = [];
      for (let j = 0; j < rowLength; j++) {
        dataRow.push(new Grid(i, j, defaultColor));
        row.push(
          <td key={`${i}:${j}`}>
            <button
              className="grid"
              style={{ backgroundColor: "#000000" }}
              onClick={(event) => {
                event.currentTarget.style.backgroundColor = colorToString(currEffect.color);
              }}
            ></button>
          </td>
        );
      }
      newBoard.push(<tr className="row">{row}</tr>);
      newBoardData.push(dataRow);
    }
    setBoard(newBoard);
    setBoardData(newBoardData);
  }, []);

  // Update page
  useEffect(() => {
    const newBoard = [];
    for (let i = 0; i < boardData.length; i++) {
      let row = [];
      for (let j = 0; j < boardData[0].length; j++) {
        row.push(
          <td key={`${i}:${j}`}>
            <button
              className="grid"
              style={{ backgroundColor: boardData[i][j].getColor() }}
              onClick={(event) => {
                let newBoardData = boardData.slice()
                newBoardData[i][j].addColor(currEffect.color)
                setBoardData(newBoardData);
                // event.currentTarget.style.backgroundColor = "#FFFF00"
              }}
            ></button>
          </td>
        );
      }
      newBoard.push(<tr className="row">{row}</tr>);
    }
    setBoard(newBoard);
    console.log("NOPE")
  }, [currEffect, effects, boardData]);

  return (
    <div>
      <table
        cellSpacing={0}
        style={{
          borderCollapse: "collapse",
          display: "block",
          borderSpacing: 0,
        }}
      >
        <tbody>{board}</tbody>
      </table>
      <button
        style={{ width: 60, height: 40 }}
        onClick={() =>
          setCurrEffect(
            new Effect([numRows, rowLength], [], "#00FF00")
          )
        }
      ></button>
    </div>
  );
}

export default Board;
