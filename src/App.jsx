import React, { useState, useEffect } from "react";
import GameBoard from "./components/GameBoard";
import StatusBar from "./components/StatusBar";
import {createBoard} from "./components/CreateBoard.jsx";
import "./App.css";

const ROWS = 10;
const COLS = 10;
const MINES = 15;

// Reveal-empty (BFS) - arbeitet in-place auf dem übergebenen Board
const revealEmpty = (board, row, col) => {
    const rows = board.length;
    const cols = board[0].length;
    const stack = [[row, col]];
    const visited = new Set();

    while (stack.length > 0) {
        const [r, c] = stack.pop();
        const key = `${r}-${c}`;
        if (visited.has(key)) continue;
        visited.add(key);

        const cell = board[r][c];
        if (cell.revealed || cell.flagged) continue;
        cell.revealed = true;

        if (cell.neighbors === 0 && !cell.isMine) {
            [
                [-1, -1], [-1, 0], [-1, 1],
                [0, -1],           [0, 1],
                [1, -1],  [1, 0],  [1, 1],
            ].forEach(([dr, dc]) => {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    stack.push([nr, nc]);
                }
            });
        }
    }

    return board;
};

function App() {
    const [board, setBoard] = useState(() => createBoard(ROWS, COLS, MINES));
    const [gameOver, setGameOver] = useState(false);
    const [win, setWin] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [elapsed, setElapsed] = useState(0);

    // Timer
    useEffect(() => {
        if (!startTime || gameOver || win) return;
        const id = setInterval(() => {
            setElapsed(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);
        return () => clearInterval(id);
    }, [startTime, gameOver, win]);

    const revealAllMines = (newBoard) => {
        newBoard.forEach(row => row.forEach(cell => { if (cell.isMine) cell.revealed = true; }));
    };

    const handleCellClick = (row, col) => {
        if (gameOver || win) return;
        if (!startTime) setStartTime(Date.now());

        setBoard(prev => {
            const newBoard = prev.map(r => r.map(c => ({ ...c })));
            const cell = newBoard[row][col];

            if (cell.revealed || cell.flagged) return newBoard;

            if (cell.isMine) {
                // Game over: nur Mine auf die geklickt wurde (plus alle Minen aufdecken)
                cell.revealed = true;
                revealAllMines(newBoard);
                setGameOver(true);
                return newBoard;
            }

            if (cell.neighbors === 0) {
                revealEmpty(newBoard, row, col);
            } else {
                cell.revealed = true;
            }

            // Win prüfen: alle nicht-minen aufgedeckt
            const allSafeRevealed = newBoard.flat().every(c => (c.isMine ? true : c.revealed));
            if (allSafeRevealed) {
                setWin(true);
                // optional: reveal all mines on win (visual)
                revealAllMines(newBoard);
            }

            return newBoard;
        });
    };

    const handleCellRightClick = (row, col) => {
        if (gameOver || win) return;
        if (!startTime) setStartTime(Date.now());

        setBoard(prev => {
            const newBoard = prev.map(r => r.map(c => ({ ...c })));
            const cell = newBoard[row][col];
            if (!cell.revealed) {
                cell.flagged = !cell.flagged;
            }
            return newBoard;
        });
    };

    const resetGame = () => {
        setBoard(createBoard(ROWS, COLS, MINES));
        setGameOver(false);
        setWin(false);
        setStartTime(null);
        setElapsed(0);
    };

    const flagsUsed = board.flat().filter(c => c.flagged).length;
    const minesLeft = MINES - flagsUsed;

    return (
        <div className="app-root">
            <h1 className="title">💣 Minesweeper</h1>

            <StatusBar
                minesLeft={minesLeft}
                elapsed={elapsed}
                onReset={resetGame}
                gameOver={gameOver}
                win={win}
            />

            <div className="board-wrapper">
                <GameBoard
                    board={board}
                    onCellClick={handleCellClick}
                    onCellRightClick={handleCellRightClick}
                />
            </div>

            {gameOver && <div className="message message--danger">💥 Game Over!</div>}
            {win && <div className="message message--win">🎉 You Win!</div>}
        </div>
    );
}

export default App;
