import Grid from "./grid";

interface BoardProps {
  boardData: Grid[][];
  addEffect: (x: number, y: number) => void;
  isBlocking: boolean;
  block: (x: number, y: number) => void;
}

const Board = ({ boardData, addEffect, isBlocking, block }: BoardProps) => {
  const board = [];
  // Generate board from board data
  for (let i = 0; i < boardData.length; i++) {
    let row = [];
    for (let j = 0; j < boardData[0].length; j++) {
      row.push(
        <td key={`${i}:${j}`}>
          <button
            className="grid"
            style={{ backgroundColor: boardData[i][j].getColor() }}
            onClick={() => {
              if (isBlocking) {
                block(i, j);
              } else {
                addEffect(i, j);
              }
            }}
          >{boardData[i][j].isBlocked ? "X" : ""}</button>
        </td>
      );
    }
    board.push(<tr className="row">{row}</tr>);
  }

  return (
    <div style={{flexGrow: "1", marginTop: "2em"}}>
      <table
        cellSpacing={0}
        style={{
          borderCollapse: "collapse",
          display: "flex",
          justifyContent: "center",
          borderSpacing: 0,
        }}
      >
        <tbody style={{textAlign: "center"}}>{board}</tbody>
      </table>
    </div>
  );
};

export default Board;
