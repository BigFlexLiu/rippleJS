import { useEffect, useState } from "react";
import Board from "./board";
import Ripple from "./ripple";
import Grid from "./grid";
import ToolBar from "./toolBar";

const Simulator = () => {
  const defaultColor = "#000000";
  const numRows = 20;
  const rowLength = 20;
  // MPR for milisecond per ripple
  const minMPR = 100;
  const maxMPR = 1000;
  const [rippleConfig, setRippleConfig] = useState(
    new Ripple([numRows, rowLength], [], "#FF0000")
  );
  const [ripples, setRipples] = useState<Set<Ripple>>(new Set());
  const [boardData, setBoardData] = useState<Grid[][]>([[]]);
  // Ticks per second when playing the simulator
  const [msPerRipple, setMsPerRipple] = useState(500);
  const [playTimout, setPlayTimout] = useState<NodeJS.Timeout>();
  const [isBlocking, setIsBlocking] = useState(false);

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
        if (i < numRows - 1)
          newBoardData[i][j].neighbours.push(newBoardData[i + 1][j]);
        if (j > 0) newBoardData[i][j].neighbours.push(newBoardData[i][j - 1]);
        if (j < rowLength - 1)
          newBoardData[i][j].neighbours.push(newBoardData[i][j + 1]);
      }
    }

    setBoardData(newBoardData);
  }, []);

  const play = () => {
    if (playTimout) {
      clearInterval(playTimout);
      setPlayTimout(undefined);
    } else {
      setPlayTimout(setInterval(tick, msPerRipple));
    }
  };

  useEffect(() => {
    if (playTimout) {
      clearInterval(playTimout);
      setPlayTimout(setInterval(tick, msPerRipple));
    }
  }, [msPerRipple, ripples]);

  // Spread existing effects
  const tick = () => {
    const completedRipples: Ripple[] = [];
    ripples.forEach((ripple) => {
      if (!ripple.tick()) {
        completedRipples.push(ripple);
      }
    });
    setBoardData(boardData.slice());
    // Removes ripples that have left the board
    if (completedRipples) {
      const newRipples = new Set(ripples);
      for (const i of completedRipples) {
        newRipples.delete(i);
      }
      setRipples(newRipples);
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
  };

  // update current effect
  const updateRipple = (
    color = rippleConfig.color,
    fade = rippleConfig.fade,
    bounce = rippleConfig.bounce,
  ) => {
    const newRippleConfig = rippleConfig.clone();
    newRippleConfig.color = color;
    newRippleConfig.fade = fade;
    newRippleConfig.bounce = bounce;
    setRippleConfig(newRippleConfig);
  };

  // Updates msPerRipple
  const updateMPR = (newMSPR: number) => {
    if (minMPR <= newMSPR && newMSPR <= maxMPR) {
      setMsPerRipple(newMSPR);
    }
  };

  const toggleBlock = () => {
    setIsBlocking(!isBlocking);
  }

  const block = (x: number, y: number) => {
    boardData[x][y].isBlocked = !boardData[x][y].isBlocked;
    setBoardData(boardData.slice());
  }

  return (
    <div style={{display: "flex", flexDirection:"row"}}>
      <Board boardData={boardData} addEffect={addEffect} isBlocking={isBlocking} block={block}></Board>
      <ToolBar
        tick={tick}
        ripple={rippleConfig}
        updateRipple={updateRipple}
        msPerRipple={msPerRipple}
        updateMPR={updateMPR}
        play={play}
        isBlocking={isBlocking}
        toggleBlocking={toggleBlock}
      ></ToolBar>
    </div>
  );
};

export default Simulator;
