

export const colorToString = (color: number[]) => {
  let colorString = '#'
  for (let i of color) {
    colorString += `${i.toString(16).padEnd(2, '0')}`;
  }
  return colorString;
}

export const stringToColor = (hex: string) => {
  // Remove the "#" character from the beginning of the hex string
  hex = hex.replace("#", "");

  // Convert the hex string to an integer using base 16
  let hexInt = parseInt(hex, 16);

  // Extract the red, green, and blue components from the hexInt value
  let red = (hexInt >> 16) & 255;
  let green = (hexInt >> 8) & 255;
  let blue = hexInt & 255;

  // Return an array of the RGB values
  return [red, green, blue];

}