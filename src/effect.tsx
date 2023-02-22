import Grid from "./grid";
import { stringToColor } from "./helpers";


const Effect = class {
  // Stores numbers representing the state of grid
  // 0 for untouched by this effect
  // 1 for currently under this effect
  // 2 for previously under this effect
  history: number[][];
  // Stores the grids currently affected by this effect
  current: Grid[];
  
  // Influence of effect on grid and how it behaves
  color: number[];
  fade: number;
  bounce: boolean;

  constructor(boardSize: number[], current: Grid[], color = "#FFFFFF", fade = 1, bounce = false) {
    this.history = [];
    for (let i = 0; i < boardSize[0]; i++) {
      let row = [];
      for (let j = 0; j < boardSize[1]; j++) {
        row.push(0);
      }
      this.history.push(row)
    }
    this.current = current;

    this.color = stringToColor(color);
    this.fade = fade;
    this.bounce = bounce;
  }

  // Apply effect to neighbours
  // Remove effect from currently affected
  tick() {
    let newCurrent = []
    // Expand to neighbours who have never been affected
    for (let i of this.current) {
      for (let j of i.neighbours) {
        if (this.history[j.x][j.y] !== 0) {
          continue;
        }
        this.history[j.x][j.y] = 1;
        newCurrent.push(j);
        j.addColor(this.color);
      }
      // Remove effect from current
      this.history[i.x][i.y] = 2;
      i.subColor(this.color);
    }
    this.current = newCurrent;
  }
  
}

export default Effect;
