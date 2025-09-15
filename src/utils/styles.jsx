// Farben für Zahlen
export const numberColors = {
    1: "#2563eb",
    2: "#16a34a",
    3: "#dc2626",
    4: "#7c3aed",
    5: "#ea580c",
    6: "#0891b2",
    7: "#000000",
    8: "#374151",
};

export const cellStyle = (cell) => ({
    width: "35px",
    height: "35px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    borderRadius: "4px",
    transition: "all 0.2s ease",
    backgroundColor: cell.revealed
        ? (cell.isMine ? "#dc2626" : "#f3f4f6")
        : (cell.flagged ? "#facc15" : "#6b7280"),
    color: cell.revealed
        ? (cell.isMine
            ? "#ffffff"
            : (cell.neighbors > 0 ? numberColors[cell.neighbors] : "#1f2937"))
        : "#f9fafb",
    border: `2px solid ${cell.revealed ? "#d1d5db" : "#4b5563"}`,
    boxShadow: cell.revealed
        ? "inset 0 2px 4px rgba(0,0,0,0.1)"
        : "0 2px 4px rgba(0,0,0,0.2)",
});
