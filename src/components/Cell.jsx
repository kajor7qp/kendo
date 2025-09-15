import React from "react";
import { cellStyle } from "../utils/styles";

const Cell = ({ cell, onClick, onRightClick }) => {
    return (
        <div
            key={cell.id}
            style={cellStyle(cell)}
            onClick={onClick}
            onContextMenu={(e) => {
                e.preventDefault();
                onRightClick();
            }}
        >
            {cell.revealed && !cell.isMine && cell.neighbors > 0 && cell.neighbors}
            {cell.revealed && cell.isMine && "💣"}
            {!cell.revealed && cell.flagged && "🚩"}
        </div>
    );
};

export default Cell;
