import React, {useState, useEffect} from "react";
import GameBoard from "./components/GameBoard";
import StatusBar from "./components/StatusBar";
import {createBoard, revealEmpty} from "./components/CreateBoard.jsx";
import {LEVELS} from "./components/Levels.jsx";
import "./App.css";

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
            const newBoard = prev.map(r => r.map(c => ({...c})));
            const cell = newBoard[row][col];
            if (!cell.revealed) {
                cell.flagged = !cell.flagged;
            }
            return newBoard;
        });
    };

    const resetGame = (newLevel = level) => {
        setLevel(newLevel);
        const {rows, cols, mines} = LEVELS[newLevel];
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
            <StatusBar
                minesLeft={minesLeft}
                elapsed={elapsed}
                onReset={(event) => resetGame(event ? event : level)}
                gameOver={gameOver}
                win={win}
            />
            <div className="board-wrapper">
                <GameBoard
                    board={board}
                    onCellClick={handleCellClick}
                    onCellRightClick={handleCellRightClick}
                    gameOver={gameOver}
                    win={win}
                />
            </div>
        </div>
    );
}

export default App;
