import { useEffect, useState } from "react";
import Board from "./board";
import Ripple from "./ripple";
import Grid from "./grid";
import ToolBar from "./toolBar";

const Simulator = () => {
  const defaultColor = "#000000";
  const [numRows, setNumRows] = useState(document.documentElement.clientHeight / 20 - 10);
  const [rowLength, setRowLength] = useState(document.documentElement.clientWidth * 0.70 / 20 - 20);
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

  useEffect(() => {
    const handleResize = () => {
      setNumRows(document.documentElement.clientHeight / 20 - 10);
      setRowLength(document.documentElement.clientWidth * 0.70 / 20 - 20);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Set up
  useEffect(() => {
    makeBoard();
  }, [numRows, rowLength]);

  const makeBoard = () => {
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
  };

  const play = () => {
    if (!ripples.size) {
      return;
    }
    if (!pause()) {
      setPlayTimout(setInterval(tick, msPerRipple));
    }
  };

  const pause = () => {
    if (playTimout) {
      clearInterval(playTimout);
      setPlayTimout(undefined);
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (!ripples.size) {
      pause();
      return;
    }
    if (playTimout && ripples.size) {
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
    bounce = rippleConfig.bounce
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
  };

  const block = (x: number, y: number) => {
    boardData[x][y].isBlocked = !boardData[x][y].isBlocked;
    setBoardData(boardData.slice());
  };

  const clear = () => {
    makeBoard();
    setRipples(new Set());
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <Board
        boardData={boardData}
        addEffect={addEffect}
        isBlocking={isBlocking}
        block={block}
      ></Board>
      <ToolBar
        tick={tick}
        ripple={rippleConfig}
        updateRipple={updateRipple}
        msPerRipple={msPerRipple}
        updateMPR={updateMPR}
        isPlaying={playTimout !== undefined}
        play={play}
        isBlocking={isBlocking}
        toggleBlocking={toggleBlock}
        onClear={clear}
      ></ToolBar>
    </div>
  );
};

export default Simulator;
