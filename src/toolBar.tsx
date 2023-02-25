import { colorToString, stringToColor } from "./helpers";
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
  isPlaying: boolean;
  play: () => void;
  isBlocking: boolean;
  toggleBlocking: () => void;
  onClear: () => void;
}

const ToolBar = ({
  tick,
  ripple,
  updateRipple,
  msPerRipple,
  updateMPR,
  isPlaying,
  play,
  isBlocking,
  toggleBlocking,
  onClear,
}: ToolBarProps) => {
  const colorChoices = new Map([
    ["red", "#ff0000"],
    ["green", "#00ff00"],
    ["blue", "#0000ff"],
  ]);

  return (
    <div className="tool-bar">
      <div className="play-option">
        <div className="spread" style={{ margin: "0" }}>
          <button
            className={`option-button play-button toggle-button ${
              isPlaying ? "active" : ""
            }`}
            onClick={play}
          >{`${isPlaying ? "Pause" : "Play"}`}</button>
          <button className="option-button play-button" onClick={tick}>
            Ripple
          </button>
          <button className="option-button play-button" onClick={onClear}>
            Clear
          </button>
        </div>
      </div>
      <div className="options">
        <div className="horizontal-spread">
          <div
            className="horizontal-flexible"
            style={{ margin: 0, padding: 0 }}
          >
            <button onClick={() => updateMPR(msPerRipple - 100)}>-</button>
            <p style={{ minWidth: "3em" }}>{msPerRipple}</p>
            <button onClick={() => updateMPR(msPerRipple + 100)}>+</button>
          </div>
          <p>ms/ripple</p>
        </div>
        <div className="horizontal-spread">
          <button
            className={`toggle-button ${isBlocking ? "active" : ""}`}
            onClick={() => toggleBlocking()}
          >
            {`${isBlocking ? "Block" : "Ripple"}`}
          </button>
          <p>type</p>
        </div>
        <div className="fade-option horizontal-spread">
          <div className="horizontal-compressed">
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
            <p style={{ minWidth: "2em" }}>{ripple.fade}</p>
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
          <p>fade</p>
        </div>
      </div>
      {/* <button
          onClick={() =>
            updateRipple(ripple.color, ripple.fade, !ripple.bounce)
          }
          style={{
            backgroundColor: `${ripple.bounce ? activeColor : inactiveColor}`,
          }}
        >
          Bounce
        </button> */}
      <div className="color-pallet">
        {Array.from(colorChoices).map(([name, hexCode]) => (
          <button
            className={`${colorToString(ripple.color) === hexCode ?  "color-selected" : ""}`}
            style={{
              width: "4em",
              height: "2em",
              backgroundColor: `${hexCode}`,
            }}
            onClick={() => updateRipple(stringToColor(hexCode))}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ToolBar;
