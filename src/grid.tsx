import { colorToString, stringToColor } from "./helpers";


class Grid {
  isBlocked: boolean;
  color: number[];
  x: number;
  y: number;
  public neighbours: Grid[] = []

  constructor(x = 0, y = 0, color = "#000000", isBlocked = false) {
    this.x = x;
    this.y = y
    this.color = stringToColor(color);
    this.isBlocked = isBlocked;
  }

  addColor(color: number[]) {
    for (let i = 0; i < color.length; i++) {
      this.color[i] += color[i];
    }
  }

  subColor(color: number[]) {
    for (let i = 0; i < color.length; i++) {
      this.color[i] -= color[i];
    }
  }

  // Limits each value of color to be between 0 to 255
  getColor() {
    const color = this.color;
    for (let i = 0; i < color.length; i++) {
      color[i] = Math.min(Math.max(0, color[i]), 255);
    }
    return colorToString(color);
  }
}

export default Grid;