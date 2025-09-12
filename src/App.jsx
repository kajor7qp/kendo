import React, { useState, useEffect } from "react";
import GameBoard from "./components/GameBoard";
import StatusBar from "./components/StatusBar";
import {createBoard} from "./components/CreateBoard.jsx";
import "./App.css";

const LEVELS = {
    easy: { rows: 9, cols: 9, mines: 10 },
    medium: { rows: 16, cols: 16, mines: 40 },
    hard: { rows: 16, cols: 30, mines: 99 },
};

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
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    stack.push([nr, nc]);
                }
            });
        }
    }

    return board;
};

function App() {
    const [level, setLevel] = useState("easy");
    const [board, setBoard] = useState(() =>
        createBoard(LEVELS.easy.rows, LEVELS.easy.cols, LEVELS.easy.mines)
    );
    const [gameOver, setGameOver] = useState(false);
    const [win, setWin] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [elapsed, setElapsed] = useState(0);
    const [firstClick, setFirstClick] = useState(true);

    const { rows, cols, mines } = LEVELS[level];

    // Timer
    useEffect(() => {
        if (!startTime || gameOver || win) return;
        const id = setInterval(() => {
            setElapsed(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);
        return () => clearInterval(id);
    }, [startTime, gameOver, win]);

    const checkWin = (board) => {
        return board.flat().every(c => (c.isMine ? true : c.revealed));
    };

    const handleCellClick = (row, col) => {
        if (gameOver || win) return;

        setBoard(prev => {
            let newBoard = prev.map(r => r.map(c => ({ ...c })));
            let cell = newBoard[row][col];

            // First click safe
            if (firstClick) {
                setFirstClick(false);
                setStartTime(Date.now());
                if (cell.isMine) {
                    do {
                        newBoard = createBoard(rows, cols, mines);
                        cell = newBoard[row][col];
                    } while (cell.isMine);
                }
            }

            // Chording
            if (cell.revealed && cell.neighbors > 0) {
                const dirs = [
                    [-1, -1], [-1, 0], [-1, 1],
                    [0, -1],           [0, 1],
                    [1, -1],  [1, 0],  [1, 1],
                ];
                const neighbors = dirs
                    .map(([dr, dc]) => [row + dr, col + dc])
                    .filter(([r, c]) => r >= 0 && r < rows && c >= 0 && c < cols)
                    .map(([r, c]) => newBoard[r][c]);

                const flagsAround = neighbors.filter(n => n.flagged).length;
                if (flagsAround === cell.neighbors) {
                    neighbors.forEach(n => {
                        if (!n.revealed && !n.flagged) {
                            if (n.isMine) {
                                setGameOver(true);
                                n.revealed = true; // getroffene Mine
                            } else if (n.neighbors === 0) {
                                revealEmpty(newBoard, n.row, n.col);
                            } else {
                                n.revealed = true;
                            }
                        }
                    });
                }
                if (!gameOver && checkWin(newBoard)) setWin(true);
                return newBoard;
            }

            if (cell.revealed || cell.flagged) return newBoard;

            if (cell.isMine) {
                cell.revealed = true;
                setGameOver(true);
                return newBoard;
            }

            if (cell.neighbors === 0) {
                revealEmpty(newBoard, row, col);
            } else {
                cell.revealed = true;
            }

            if (checkWin(newBoard)) setWin(true);
            return newBoard;
        });
    };

    const handleCellRightClick = (row, col) => {
        if (gameOver || win) return;
        if (firstClick) {
            setFirstClick(false);
            setStartTime(Date.now());
        }

        setBoard(prev => {
            const newBoard = prev.map(r => r.map(c => ({ ...c })));
            const cell = newBoard[row][col];
            if (!cell.revealed) {
                cell.flagged = !cell.flagged;
            }
            return newBoard;
        });
    };

    const resetGame = (newLevel = level) => {
        setLevel(newLevel);
        const { rows, cols, mines } = LEVELS[newLevel];
        setBoard(createBoard(rows, cols, mines));
        setGameOver(false);
        setWin(false);
        setStartTime(null);
        setElapsed(0);
        setFirstClick(true);
    };

    const flagsUsed = board.flat().filter(c => c.flagged).length;
    const minesLeft = mines - flagsUsed;

    return (
        <div className="app-root">
            <h1 className="title">💣 Minesweeper</h1>

            <StatusBar
                minesLeft={minesLeft}
                elapsed={elapsed}
                onReset={() => resetGame(level)}
                gameOver={gameOver}
                win={win}
            />

            <div className="level-buttons">
                <button onClick={() => resetGame("easy")}>Easy</button>
                <button onClick={() => resetGame("medium")}>Medium</button>
                <button onClick={() => resetGame("hard")}>Hard</button>
            </div>

            <div className="board-wrapper">
                <GameBoard
                    board={board}
                    onCellClick={handleCellClick}
                    onCellRightClick={handleCellRightClick}
                    gameOver={gameOver}
                    win={win}
                />
            </div>

            {gameOver && <div className="message message--danger">💥 Game Over!</div>}
            {win && <div className="message message--win">🎉 You Win!</div>}
        </div>
    );
}

export default App;
