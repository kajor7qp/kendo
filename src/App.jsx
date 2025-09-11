// src/App.jsx
import React, { useState, useEffect } from "react";
import GameBoard from "./components/GameBoard";
import StatusBar from "./components/StatusBar";
import {createBoard} from "./components/CreateBoard.jsx";

const ROWS = 30;
const COLS = 30;
const MINES = 10;

export default function App() {
    const [board, setBoard] = useState(createBoard(ROWS, COLS));
    const [time, setTime] = useState(0);
    const [minesLeft, setMinesLeft] = useState(MINES);

    useEffect(() => {
        const timer = setInterval(() => setTime((t) => t + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    // src/App.jsx

    const handleCellClick = (row, col) => {
        console.log("click", row, col);
        setBoard((prev) =>
            prev.map((r) =>
                r.map((c) =>

                    c.row === row && c.col === col ? { ...c, revealed: true } : c
                )
            )
        );
    };

    const handleRightClick = (row, col) => {
        setBoard((prev) =>
            prev.map((r) =>
                r.map((c) =>
                    c.row === row && c.col === col
                        ? { ...c, flagged: !c.flagged }
                        : c
                )
            )
        );
        setMinesLeft((m) => m + (board[row][col].flagged ? 1 : -1));
    };

    const handleReset = () => {
        setBoard(createBoard(ROWS, COLS));
        setTime(0);
        setMinesLeft(MINES);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6 space-y-6">
            <h1 className="text-4xl font-extrabold flex items-center gap-2">
                💣 Minesweeper
            </h1>
            <StatusBar minesLeft={minesLeft} time={time} onReset={handleReset} />
            <GameBoard
                board={board}
                onCellClick={handleCellClick}
                onRightClick={handleRightClick}
            />
        </div>
    );
}
