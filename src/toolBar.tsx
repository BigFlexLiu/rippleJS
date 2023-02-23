import { stringToColor } from "./helpers";
import Ripple from "./ripple";

interface ToolBarProps {
  tick: () => void;
  ripple: Ripple;
  updateRipple: (
    color?: number[],
    fade?: number,
    bounce?: boolean,
    blocked?: boolean
  ) => void;
  msPerRipple: number;
  updateMPR: (newTPS: number) => void;
  play: () => void;
  isBlocking: boolean;
  toggleBlocking: () => void;
}

const ToolBar = ({
  tick,
  ripple,
  updateRipple,
  msPerRipple,
  updateMPR,
  play,
  isBlocking,
  toggleBlocking,
}: ToolBarProps) => {
  const inactiveColor = "#FF0000";
  const activeColor = "#00FF00";
  const colorChoices = new Map([
    ["red", "#FF0000"],
    ["green", "#00FF00"],
    ["blue", "#0000FF"],
  ]);

  return (
    <div className="tool-bar">
      <div className="play-option">
        <button onClick={play}>Play</button>
        <button onClick={tick}>Ripple</button>

        <button
          style={{
            backgroundColor: `${isBlocking ? activeColor : inactiveColor}`,
          }}
          onClick={() => toggleBlocking()}
        >
          Blocked
        </button>
        <div>
          <button onClick={() => updateMPR(msPerRipple - 100)}>-</button>
          <p style={{ display: "inline" }}>{msPerRipple}</p>
          <button onClick={() => updateMPR(msPerRipple + 100)}>+</button>
          <p style={{ display: "inline" }}>Ripple/second</p>
        </div>
      </div>

      <div className="fade-option">
        <button>Fade: </button>
        <button
          onClick={() =>
            updateRipple(
              ripple.color,
              Number(Math.max(ripple.fade - 0.1, 0).toFixed(1)),
              ripple.bounce
            )
          }
        >
          -
        </button>
        <p style={{ display: "inline" }}>{ripple.fade}</p>
        <button
          onClick={() =>
            updateRipple(
              ripple.color,
              Number(Math.min(ripple.fade + 0.1, 1).toFixed(1)),
              ripple.bounce
            )
          }
        >
          +
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <button
          onClick={() =>
            updateRipple(ripple.color, ripple.fade, !ripple.bounce)
          }
          style={{
            backgroundColor: `${ripple.bounce ? activeColor : inactiveColor}`,
          }}
        >
          Bounce
        </button>
        <div className="color-pallet" style={{ display: "block" }}>
          {Array.from(colorChoices).map(([name, hexCode]) => (
            <button
              style={{
                width: "4em",
                height: "2em",
                backgroundColor: `${hexCode}`,
              }}
              onClick={() => updateRipple(stringToColor(hexCode))}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolBar;
