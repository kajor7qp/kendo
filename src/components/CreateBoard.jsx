export const createBoard = (rows, cols, mines = 10) => {
    const board = Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => ({
            row: r,
            col: c,
            isMine: false,
            revealed: false,
            flagged: false,
            neighbors: 0,
            wrongFlag: false, // für GameOver falsche Flags
        }))
    );

    let placed = 0;
    while (placed < mines) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        if (!board[r][c].isMine) {
            board[r][c].isMine = true;
            placed++;
        }
    }

    const dirs = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1],
    ];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c].isMine) continue;
            let cnt = 0;
            dirs.forEach(([dr, dc]) => {
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    if (board[nr][nc].isMine) cnt++;
                }
            });
            board[r][c].neighbors = cnt;
        }
    }

    return board;
};