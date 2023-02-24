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
    ["red", "#FF0000"],
    ["green", "#00FF00"],
    ["blue", "#0000FF"],
  ]);

  return (
    <div
      className="tool-bar"
      style={{ float: "right", backgroundColor: "#333", minHeight: "100vh", maxWidth: "30vw", minWidth: "15em"}}
    >
      <div className="play-option" style={{ marginTop: "5em" }}>
        <div className="horizontal-spread" style={{ margin: "0" }}>
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
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ margin: 0, padding: 0 }}>
            <button onClick={() => updateMPR(msPerRipple - 100)}>-</button>
            <p style={{ minWidth: "3em" }}>{msPerRipple}</p>
            <button onClick={() => updateMPR(msPerRipple + 100)}>+</button>
          </div>
          <p>ms/ripple</p>
        </div>
      </div>

      <div className="horizontal-spread">
        <p>Place:</p>
        <button
          className={`toggle-button ${isBlocking ? "active" : ""}`}
          onClick={() => toggleBlocking()}
        >
          {`${isBlocking ? "Block" : "Ripple"}`}
        </button>
      </div>
      <div className="fade-option horizontal-spread">
        <div>
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
      <div style={{ display: "flex", flexDirection: "column" }}>
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
        <div className="color-pallet" style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
          <p style={{textAlign: "center"}}>Color: </p>
          {Array.from(colorChoices).map(([name, hexCode]) => (
            <button
              style={{
                width: "4em",
                height: "2em",
                margin: "0.5em",
                backgroundColor: `${hexCode}`,
              }}
              onClick={() => updateRipple(stringToColor(hexCode))}
            >
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolBar;
