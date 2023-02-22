import { useEffect, useState } from "react";
import Board from "./board";
import Ripple from "./ripple";
import Grid from "./grid";
import ToolBar from "./toolBar";

const Simulator = () => {
  const defaultColor = "#000000";
  const numRows = 20;
  const rowLength = 20;
  const [rippleConfig, setRippleConfig] = useState(
    new Ripple([numRows, rowLength], [], "#FF0000")
  );
  const [ripples, setRipples] = useState(new Set([rippleConfig]));
  const [boardData, setBoardData] = useState([[new Grid()]]);

  // Set up
  useEffect(() => {
    const newBoardData = [];
    // Populate board and board data
    for (let i = 0; i < numRows; i++) {
      let dataRow = [];
      for (let j = 0; j < rowLength; j++) {
        dataRow.push(new Grid(i, j, defaultColor));
      }
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

    setBoardData(newBoardData);
  }, []);

  // Spread existing effects
  const tick = () => {
    const completedRipples: Ripple[] = []
    ripples.forEach(
      (ripple) => {
        if (!ripple.tick()) {
          completedRipples.push(ripple)
        }
      }
    )
    setBoardData(boardData.slice());
    // Removes ripples that have left the board
    if (completedRipples) {
      const newRipples = new Set(ripples)
      for (const i of completedRipples) {
        newRipples.delete(i);
      }
      setRipples(newRipples)
    }
  };

  // Adds current effect to grid at (x, y)
  const addEffect = (x: number, y: number) => {
    let newBoardData = boardData.slice();
    newBoardData[x][y].addColor(rippleConfig.color);
    setBoardData(newBoardData);

    // Duplicate current effect
    let newEffect = rippleConfig.clone();
    newEffect.current = [boardData[x][y]];

    let newEffects = new Set(ripples);
    newEffects.add(newEffect);
    setRipples(newEffects);
  }

  // update current effect
  const updateRipple = (color = rippleConfig.color, fade = rippleConfig.fade, bounce = rippleConfig.bounce) => {
    const newEffect = rippleConfig.clone();
    newEffect.color = color
    newEffect.fade = fade
    newEffect.bounce = bounce
    setRippleConfig(newEffect)
  }

  return (
    <div>
      <Board boardData={boardData} addEffect={addEffect}></Board>
      <ToolBar tick={tick} updateRipple={updateRipple}></ToolBar>
    </div>
  );
};

export default Simulator;
