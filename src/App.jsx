import React, {useState} from "react";
import Board from "./components/Board";
import Header from "./components/Header";
import Controls from "./components/Controls";
import Notifications from "./components/Notifications";
import HintCard from "./components/HintCard";
import {createBoard} from "./utils/boardUtils";

function App() {
    const [rows, setRows] = useState(9);
    const [cols, setCols] = useState(9);
    const [mines, setMines] = useState(10);
    const [board, setBoard] = useState(createBoard(rows, cols, mines));
    const [time, setTime] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [win, setWin] = useState(false);

    const resetGame = () => {
        setBoard(createBoard(rows, cols, mines));
        setTime(0);
        setGameOver(false);
        setWin(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <Header rows={rows} cols={cols} mines={mines} time={time} onReset={resetGame}/>
            <Controls onChange={({rows, cols, mines}) => {
                setRows(rows);
                setCols(cols);
                setMines(mines);
                resetGame();
            }}/>
            <Board
                board={board}
                onCellClick={(r, c) => console.log("Cell click", r, c)}
                onCellRightClick={(r, c) => console.log("Right click", r, c)}
            />
            <HintCard/>
            <Notifications win={win} gameOver={gameOver}/>
        </div>
    );
}

export default App;
