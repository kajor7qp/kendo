// src/components/GameBoard.jsx
import React from "react";

const cellStyle = (cell) => {
    if (cell.revealed) {
        return {
            backgroundColor: "#e5e7eb",
            border: "1px solid #9ca3af",
            color: cell.isMine ? "red" : "black",
        };
    }
    return {
        backgroundColor: "#374151",
        border: "1px solid #4b5563",
        color: "#d1d5db",
    };
};

// src/components/GameBoard.jsx

const GameBoard = ({board, onCellClick, onRightClick}) => {
    return (
        <div
            className="grid gap-0"
            style={{
                gridTemplateColumns: `repeat(${board[0].length}, 40px)`,
                justifyContent: "center",
                width: 660,
                height: 660
            }}
        >
            {board.flat().map((cell) => {
                let content = "";
                if (cell.revealed) {
                    content = cell.isMine ? "💣" : cell.neighbors || "";
                } else if (cell.flagged) {
                    content = "🚩";
                }

                return (
                    <div
                        key={`${cell.row}-${cell.col}`}
                        style={{
                            ...cellStyle(cell),
                            width: 20,
                            height: 20,
                            display: "flex",
                            padding: 0,
                            justifyContent: "center",
                            alignItems: "center",
                            fontWeight: "bold",
                            cursor: "pointer",
                            userSelect: "none",
                            float: "left"
                        }}
                        onClick={() => onCellClick(cell.row, cell.col)}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            onRightClick(cell.row, cell.col);
                        }}
                    >
                        {content}
                    </div>
                );
            })}
        </div>
    );
};

export default GameBoard;
