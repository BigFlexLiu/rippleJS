import Grid from "./grid";
import { colorToString, stringToColor } from "./helpers";


const Ripple = class {
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
    for (let affected of this.current) {
      for (let neighbour of affected.neighbours) {
        if (this.history[neighbour.x][neighbour.y] !== 0) {
          continue;
        }
        this.history[neighbour.x][neighbour.y] = 1;
        newCurrent.push(neighbour);
        neighbour.addColor(this.color);
      }
      // Remove effect from current
      this.history[affected.x][affected.y] = 2;
      affected.subColor(this.color);
    }
    this.current = newCurrent;
  }
  
  clone() {
    return new Ripple([this.history.length, this.history[0].length], this.current.slice(), colorToString(this.color), this.fade, this.bounce);
  }
}

export default Ripple;
