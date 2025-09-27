import {useState, useEffect, useRef} from 'react';
import {createBoard, revealEmpty, checkWin} from '../utils/boardUtils.js';

const useGameLogic = (LEVELS, showNotification, addGameStat, currentUser) => {
    const [level, setLevel] = useState('easy');
    const [board, setBoard] = useState(() => createBoard(LEVELS.easy.rows, LEVELS.easy.cols, LEVELS.easy.mines));
    const [gameOver, setGameOver] = useState(false);
    const [win, setWin] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [elapsed, setElapsed] = useState(0);
    const [firstClick, setFirstClick] = useState(true);
    const [loading, setLoading] = useState(false);
    const [mouseButtons, setMouseButtons] = useState(0);
    const hasSavedStats = useRef(false);

    const {rows, cols, mines} = LEVELS[level];
    const flagsUsed = board.flat().filter(c => c.flagged).length;
    const minesLeft = mines - flagsUsed;

    let face = "😊";
    if (elapsed === 0) face = "😄";
    if (gameOver) face = "😵";
    else if (win) face = "😎";

    useEffect(() => {
        if (!startTime || gameOver || win) return;
        const id = setInterval(() => {
            setElapsed(Date.now() - startTime);
        }, 10);
        return () => clearInterval(id);
    }, [startTime, gameOver, win]);

    useEffect(() => {
        if ((gameOver || win) && !hasSavedStats.current) {
            if (!currentUser) {
                showNotification({
                    type: {style: 'warning', icon: true},
                    content: 'Please select a player first!'
                });
                return;
            }

            hasSavedStats.current = true;
            addGameStat({
                id: Date.now(),
                username: currentUser,
                level: level.charAt(0).toUpperCase() + level.slice(1),
                time: elapsed,
                result: gameOver ? 'Lose' : 'Win',
                date: new Date().toISOString().split('T')[0]
            });
        }
    }, [gameOver, win, currentUser, level, elapsed, showNotification, addGameStat]);

    useEffect(() => {
        const handleDown = (e) => setMouseButtons(e.buttons);
        const handleUp = () => setMouseButtons(0);

        window.addEventListener("mousedown", handleDown);
        window.addEventListener("mouseup", handleUp);

        return () => {
            window.removeEventListener("mousedown", handleDown);
            window.removeEventListener("mouseup", handleUp);
        };
    }, []);

    const resetGame = (newLevel = level) => {
        setLoading(true);
        setTimeout(() => {
            setLevel(newLevel);
            const {rows, cols, mines} = LEVELS[newLevel];
            setBoard(createBoard(rows, cols, mines));
            setGameOver(false);
            setWin(false);
            setStartTime(null);
            setElapsed(0);
            setFirstClick(true);
            setLoading(false);
            hasSavedStats.current = false;

            showNotification({
                type: {style: 'info', icon: true},
                content: `New ${newLevel} game started!`
            });
        }, 500);
    };

    const handleCellClick = (row, col) => {
        if (gameOver || win) return;

        setBoard(prev => {
            let newBoard = prev.map(r => r.map(c => ({...c})));
            let cell = newBoard[row][col];

            if (mouseButtons === 3 && cell.revealed && cell.neighbors > 0) {
                const dirs = [
                    [-1, -1], [-1, 0], [-1, 1],
                    [0, -1], [0, 1],
                    [1, -1], [1, 0], [1, 1],
                ];

                const neighbors = dirs
                    .map(([dr, dc]) => {
                        const nr = row + dr, nc = col + dc;
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                            return newBoard[nr][nc];
                        }
                        return null;
                    })
                    .filter(n => n);

                const flaggedCount = neighbors.filter(n => n.flagged).length;

                if (flaggedCount === cell.neighbors) {
                    neighbors.forEach(n => {
                        if (!n.revealed && !n.flagged) {
                            if (n.isMine) {
                                n.revealed = true;
                                setGameOver(true);
                            } else if (n.neighbors === 0) {
                                revealEmpty(newBoard, n.row, n.col);
                            } else {
                                n.revealed = true;
                            }
                        }
                    });
                }
            } else {
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

                if (cell.revealed && cell.neighbors > 0) {
                    const dirs = [
                        [-1, -1], [-1, 0], [-1, 1],
                        [0, -1], [0, 1],
                        [1, -1], [1, 0], [1, 1],
                    ];

                    const neighbors = dirs
                        .map(([dr, dc]) => {
                            const nr = row + dr, nc = col + dc;
                            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                                return newBoard[nr][nc];
                            }
                            return null;
                        })
                        .filter(n => n);

                    const flaggedCount = neighbors.filter(n => n.flagged).length;

                    if (flaggedCount === cell.neighbors) {
                        neighbors.forEach(n => {
                            if (!n.revealed && !n.flagged) {
                                if (n.isMine) {
                                    n.revealed = true;
                                    setGameOver(true);
                                } else if (n.neighbors === 0) {
                                    revealEmpty(newBoard, n.row, n.col);
                                } else {
                                    n.revealed = true;
                                }
                            }
                        });
                    }
                } else if (!cell.revealed && !cell.flagged) {
                    if (cell.isMine) {
                        cell.revealed = true;
                        setGameOver(true);
                    } else if (cell.neighbors === 0) {
                        revealEmpty(newBoard, row, col);
                    } else {
                        cell.revealed = true;
                    }
                }
            }
            if (checkWin(newBoard)) setWin(true);
            return newBoard;
        });
    };

    const handleCellRightClick = (row, col, e) => {
        e.preventDefault();
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

    return {
        level,
        board,
        gameOver,
        win,
        elapsed,
        firstClick,
        loading,
        minesLeft,
        face,
        resetGame,
        handleCellClick,
        handleCellRightClick
    };
};

export default useGameLogic;