

export const colorToString = (color: number[]) => {
  let colorString = '#'
  for (const i of color) {
    colorString += `${i.toString(16).padStart(2, '0')}`;
  }
  return colorString;
}

export const stringToColor = (hex: string) => {
  // Remove the "#" character from the beginning of the hex string
  hex = hex.replace("#", "");

  // Convert the hex string to an integer using base 16
  const hexInt = parseInt(hex, 16);

  // Extract the red, green, and blue components from the hexInt value
  const red = (hexInt >> 16) & 255;
  const green = (hexInt >> 8) & 255;
  const blue = hexInt & 255;

  // Return an array of the RGB values
  return [red, green, blue];

}