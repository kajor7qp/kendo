export const createBoard = (rows, cols, mines) => {
    const board = Array(rows).fill().map((_, row) =>
        Array(cols).fill().map((_, col) => ({
            id: `${row}-${col}`,
            row,
            col,
            isMine: false,
            revealed: false,
            flagged: false,
            neighbors: 0
        }))
    );

    // Place mines
    let placedMines = 0;
    while (placedMines < mines) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        if (!board[row][col].isMine) {
            board[row][col].isMine = true;
            placedMines++;
        }
    }

    // Calculate neighbors
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (!board[row][col].isMine) {
                let count = 0;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = row + dr;
                        const nc = col + dc;
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].isMine) {
                            count++;
                        }
                    }
                }
                board[row][col].neighbors = count;
            }
        }
    }

    return board;
};

export const revealEmpty = (board, row, col) => {
    if (row < 0 || row >= board.length || col < 0 || col >= board[0].length) return;
    const cell = board[row][col];
    if (cell.revealed || cell.flagged) return;

    cell.revealed = true;
    if (cell.neighbors === 0) {
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                revealEmpty(board, row + dr, col + dc);
            }
        }
    }
};

export const checkWin = (board) => {
    return board.every(row =>
        row.every(cell =>
            (cell.isMine && !cell.revealed) || (!cell.isMine && cell.revealed)
        )
    );
};