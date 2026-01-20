import { useState } from "react";
import "./sudoku.css";
function Cell({ value, onChange }) {
  return (
    <input
      type="text"
      value={value === 0 ? "" : value}
      maxLength={1}
      inputMode="numeric"
      className="sudoku-cell"
      onChange={(e) => {
        const v = e.target.value;
        if (!/^[1-9]?$/.test(v)) return;
        onChange(v === "" ? 0 : Number(v));
      }}
    />
  );
}

function SudokuGrid() {
  const [grid, setGrid] = useState(
    Array.from({ length: 9 }, () => Array(9).fill(0))
  );

  const updateCell = (row, col, value) => {
    setGrid((prev) => {
      const copy = prev.map((r) => [...r]);
      copy[row][col] = value;
      return copy;
    });
  };

  const API_URL = process.env.REACT_APP_API_URL;
  const [errorMessage, setErrorMessage] = useState("");
const handleSolve = async () => {
  setErrorMessage("");

  try {
    const res = await fetch(`${API_URL}/solve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grid }),
    });

    const data = await res.json();

    if (data.error) {
      setErrorMessage("This sudoku cannot be solved");
      return;
    }

    setGrid(data.solution);
  } catch {
    setErrorMessage("Backend connection error, wait for a minute to reconnect the server");
  }
};
  
  const handleReset = () => {
  setGrid(
    Array.from({ length: 9 }, () => Array(9).fill(0))
  );
};

  return (
    
    <div className="sudoku-wrapper">
      {errorMessage && (
  <div className="error-message">
    {errorMessage}
  </div>
)}

      <div className="sudoku-grid">
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <Cell
              key={`${r}-${c}`}
              value={cell}
              onChange={(v) => updateCell(r, c, v)}
            />
          ))
        )}
      </div>

<div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
<p></p><button onClick={handleSolve}>Solve</button>
 <p></p><button onClick={handleReset}>Reset</button>
</div>
    </div>
  );
}

function SudokuPage() {
  return (
    <>
      <h1 className="h1 title">Sudoku Solver</h1>
      <SudokuGrid />
      
    </>
  );
}

export default SudokuPage;


