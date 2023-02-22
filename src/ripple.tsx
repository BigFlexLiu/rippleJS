import Grid from "./grid";
import { colorToString, stringToColor } from "./helpers";


class Ripple {
  // Stores numbers representing the state of grid
  // 0 for untouched by this riple
  // 1 for currently under this riple
  // 2 for previously under this riple
  history: number[][];
  // Stores the grids currently affected by the ripple
  current: Grid[];
  
  // Influence of ripple on grid and how it behaves
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

  // Apply ripple to neighbours
  // Remove ripple from currently affected
  // Returns whether ripple is ongoing
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
      // Remove riple from current
      this.history[affected.x][affected.y] = 2;
      affected.subColor(this.color);
    }
    this.current = newCurrent;

    return newCurrent.length > 0
  }
  
  clone() {
    return new Ripple([this.history.length, this.history[0].length], this.current.slice(), colorToString(this.color), this.fade, this.bounce);
  }
}

export default Ripple;
