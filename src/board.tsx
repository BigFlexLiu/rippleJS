import "./App.css";
import React, { useEffect, useState } from "react";
import Grid from "./grid";
import Ripple from "./effect";
import { colorToString } from "./helpers";

function Board() {
  const numRows = 20;
  const rowLength = 20;
  const defaultColor = "#000000";
  const [board, setBoard] = useState([<tr></tr>]);
  const [boardData, setBoardData] = useState([[new Grid()]]);
  const [currEffect, setCurrEffect] = useState(
    new Ripple([numRows, rowLength], [], "#FF0000")
  );
  const [effects, setEffects] = useState([currEffect]);

  // Set up
  useEffect(() => {
    const newBoard = [];
    const newBoardData = [];
    // Populate board and board data
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
                event.currentTarget.style.backgroundColor = colorToString(
                  currEffect.color
                );
              }}
            ></button>
          </td>
        );
      }
      newBoard.push(<tr className="row">{row}</tr>);
      newBoardData.push(dataRow);
    }
    // Populate neighbours of board data
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < rowLength; j++) {
        if (i > 0) newBoardData[i][j].neighbours.push(newBoardData[i - 1][j]);
        if (i < numRows-1) newBoardData[i][j].neighbours.push(newBoardData[i + 1][j]);
        if (j > 0) newBoardData[i][j].neighbours.push(newBoardData[i][j - 1]);
        if (j < rowLength-1) newBoardData[i][j].neighbours.push(newBoardData[i][j+1]);
      }
    }

    setBoard(newBoard);
    setBoardData(newBoardData);
    setEffects([]);
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
              onClick={() => {
                let newBoardData = boardData.slice();
                newBoardData[i][j].addColor(currEffect.color);
                setBoardData(newBoardData);

                let newEffects = effects.slice();
                let newEffect = currEffect.clone();
                newEffect.current = [boardData[i][j]];
                newEffects.push(newEffect);
                setEffects(newEffects);
              }}
            ></button>
          </td>
        );
      }
      newBoard.push(<tr className="row">{row}</tr>);
    }
    setBoard(newBoard);
    console.log(effects)
  }, [currEffect, effects, boardData]);

  const tick = () => {
    for (let effect of effects) {
      console.log(effect);
      effect.tick();
    }
    setBoardData(boardData.slice());
  };

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
          setCurrEffect(new Ripple([numRows, rowLength], [], "#00FF00"))
        }
      ></button>
      <button style={{ width: 60, height: 40 }} onClick={tick}></button>
    </div>
  );
}

export default Board;
