// Hier kommen deine Spiellogik-Funktionen rein
export const createBoard = (rows, cols, mines = 10) => {
    const board = Array.from({length: rows}, (_, r) =>
        Array.from({length: cols}, (_, c) => ({
            row: r,
            col: c,
            isMine: false,
            revealed: false,
            flagged: false,
            neighbors: 0,
            id: `${r}-${c}`
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
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1],
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

export const revealEmpty = (board, row, col) => {
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
                [0, -1], [0, 1],
                [1, -1], [1, 0], [1, 1],
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

export const checkWin = (board) => {
    return board.flat().every(c => (c.isMine ? true : c.revealed));
};
