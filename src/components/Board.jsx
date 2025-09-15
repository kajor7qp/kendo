import React from "react";
import Cell from "./Cell";

const Board = ({ board, onCellClick, onCellRightClick }) => {
    return (
        <div className="flex flex-col gap-0.5">
            {board.map((row, rIdx) => (
                <div key={rIdx} className="flex gap-0.5">
                    {row.map((cell, cIdx) => (
                        <Cell
                            key={`${rIdx}-${cIdx}`}
                            cell={cell}
                            onClick={() => onCellClick(rIdx, cIdx)}
                            onRightClick={() => onCellRightClick(rIdx, cIdx)}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Board;
