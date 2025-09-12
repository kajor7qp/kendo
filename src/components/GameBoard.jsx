import React from "react";

/**
 * createBoard(rows, cols, mines)
 * liefert ein 2D-Array board[row][col]
 */


const numberColors = {
    1: "#0000ff", // blau
    2: "#008000", // grün
    3: "#ff0000", // rot
    4: "#000080",
    5: "#800000",
    6: "#008080",
    7: "#000000",
    8: "#808080",
};

const GameBoard = ({ board, onCellClick, onCellRightClick }) => {
    if (!board || board.length === 0) return null;
    const cols = board[0].length;

    return (
        <div
            className="board-container"
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${cols}, var(--cell-size))`,
                gap: "4px",
            }}
            onContextMenu={(e) => e.preventDefault()} // prevent default global menu
        >
            {board.flat().map(cell => {
                const { row, col, revealed, flagged, isMine, neighbors } = cell;

                let content = null;
                if (revealed) {
                    if (isMine) content = "💣";
                    else if (neighbors > 0) content = (
                        <span style={{ color: numberColors[neighbors] || "#000" }}>
              {neighbors}
            </span>
                    );
                    else content = null;
                } else if (flagged) {
                    content = "🚩";
                }

                const cellClass = [
                    "cell",
                    revealed ? "cell--revealed" : "cell--hidden",
                    revealed && isMine ? "cell--mine" : "",
                    flagged ? "cell--flagged" : ""
                ].join(" ");

                return (
                    <div
                        key={`${row}-${col}`}
                        className={cellClass}
                        onClick={() => onCellClick(row, col)}
                        onContextMenu={(e) => { e.preventDefault(); onCellRightClick(row, col); }}
                        role="button"
                        aria-label={`cell-${row}-${col}`}
                    >
                        {content}
                    </div>
                );
            })}
        </div>
    );
};

export default GameBoard;
