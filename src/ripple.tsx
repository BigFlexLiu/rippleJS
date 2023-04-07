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

  constructor(boardSize: number[], current: Grid[], color = "#FFFFFF", fade = 0, bounce = false) {
    this.history = [];
    for (let i = 0; i < boardSize[0]; i++) {
      const row = [];
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
    const newCurrent = []
    const newColor = this.color.map((value) => Math.floor(value * (1 - this.fade)));
    // Expand to neighbours who have never been affected
    for (const affected of this.current) {
      for (const neighbour of affected.neighbours) {
        if (this.history[neighbour.x][neighbour.y] !== 0 || neighbour.isBlocked) {
          continue;
        }
        this.history[neighbour.x][neighbour.y] = 1;
        newCurrent.push(neighbour);
        neighbour.addColor(newColor);
      }
      // Remove riple from current
      this.history[affected.x][affected.y] = 2;
      affected.subColor(this.color);
    }
    this.current = newCurrent;
    this.color = newColor;

    return newCurrent.length > 0
  }
  
  clone(boardSize = [this.history.length, this.history[0].length]) {
    return new Ripple(boardSize, this.current.slice(), colorToString(this.color), this.fade, this.bounce);
  }
}

export default Ripple;
