// ganz oben im File (bevor GameBoard-Component)
export const createBoard = (rows, cols) => {
    return Array.from({length: rows}, (_, r) =>
        Array.from({length: cols}, (_, c) => ({
            row: r,
            col: c,
            isMine: false,
            revealed: false,
            flagged: false,
            neighbors: 0,
        }))
    );
};