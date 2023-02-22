import { stringToColor } from "./helpers";

interface ToolBarProps {
  tick: () => void,
  updateRipple: (color?: number[], fade?: number, bounce?: boolean) => void,
}

const ToolBar = ({tick, updateRipple} : ToolBarProps) => {
  return (
    <div>
      <button
        style={{ width: 60, height: 40 }}
        onClick={() =>
          updateRipple(stringToColor("#00FF00"))
        }
      ></button>
      <button style={{ width: 60, height: 40 }} onClick={tick}></button>
    </div>
  );
};

export default ToolBar;
