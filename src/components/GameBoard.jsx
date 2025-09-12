import React from "react";

const numberColors = {
    1: "#0000ff",
    2: "#008000",
    3: "#ff0000",
    4: "#000080",
    5: "#800000",
    6: "#008080",
    7: "#000000",
    8: "#808080",
};

const GameBoard = ({ board, onCellClick, onCellRightClick, gameOver, win }) => {
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
            onContextMenu={(e) => e.preventDefault()}
        >
            {board.flat().map(cell => {
                const { row, col, revealed, flagged, isMine, neighbors } = cell;
                let content = null;

                if (revealed) {
                    if (isMine && gameOver) {
                        // Mine nur zeigen, wenn nicht geflaggt
                        if (!flagged) content = "💣";
                    } else if (neighbors > 0) {
                        content = <span style={{ color: numberColors[neighbors] }}>{neighbors}</span>;
                    }
                } else if (flagged) {
                    if (gameOver && !isMine) {
                        content = "❌"; // falsche Flag
                    } else {
                        content = "🚩";
                    }
                }

                const cellClass = [
                    "cell",
                    revealed ? "cell--revealed" : "cell--hidden",
                    revealed && isMine && gameOver ? "cell--mine" : "",
                ].join(" ");

                return (
                    <div
                        key={`${row}-${col}`}
                        className={cellClass}
                        onClick={() => onCellClick(row, col)}
                        onContextMenu={(e) => { e.preventDefault(); onCellRightClick(row, col); }}
                    >
                        {content}
                    </div>
                );
            })}
        </div>
    );
};

export default GameBoard;
