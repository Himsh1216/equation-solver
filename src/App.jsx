import React, { useState } from 'react';

const styles = {
  container: {
    height: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    padding: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
    width: '100%',
    maxWidth: '800px',
    padding: '2rem',
    transition: 'transform 0.2s ease',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: 0,
  },
  backButton: {
    background: 'none',
    border: 'none',
    padding: '0.5rem',
    cursor: 'pointer',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s ease',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'border-color 0.2s ease',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'transform 0.1s ease, box-shadow 0.1s ease',
  },
  disabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  equationGrid: {
    display: 'grid',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  equationRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    alignItems: 'center',
  },
  coefficientInput: {
    width: '80px',
    padding: '0.5rem',
    border: '2px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '1rem',
    textAlign: 'center',
  },
  equationPreview: {
    marginTop: '0.5rem',
    color: '#4a5568',
    fontSize: '0.875rem',
  },
  solutionSection: {
    marginTop: '1.5rem',
    padding: '1rem',
    background: '#f8fafc',
    borderRadius: '8px',
  },
  solutionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#2d3748',
  },
  solutionItem: {
    fontSize: '1.125rem',
    color: '#4a5568',
    marginBottom: '0.5rem',
  }
};

// SVG for back arrow
const BackArrow = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const Home = ({ onSubmit }) => {
  const [variables, setVariables] = useState(0);

  return (
    <div style={styles.card}>
      <h1 style={styles.title}>System of Equations Solver</h1>
      <div style={{ marginTop: '2rem' }}>
        <input
          type="number"
          placeholder="Enter number of variables"
          value={variables || ''}
          onChange={(e) => setVariables(parseInt(e.target.value, 10) || 0)}
          style={styles.input}
        />
        <button
          onClick={() => variables > 0 && onSubmit(variables)}
          style={{
            ...styles.button,
            ...(variables <= 0 ? styles.disabled : {}),
            marginTop: '1rem'
          }}
          disabled={variables <= 0}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const Coefficients = ({ variables, onSolve, onBack }) => {
  const [coefficients, setCoefficients] = useState(
    Array(variables).fill().map(() => Array(variables + 1).fill(''))
  );

  const handleInputChange = (row, col, value) => {
    const updatedCoefficients = coefficients.map((equation, i) =>
      i === row
        ? equation.map((coeff, j) => (j === col ? value : coeff))
        : equation
    );
    setCoefficients(updatedCoefficients);
  };

  const formatEquation = (equation) => {
    let result = '';
    for (let i = 0; i < variables; i++) {
      const coeff = equation[i] || 0;
      if (i === 0) {
        result += `${coeff}x₁`;
      } else {
        result += ` ${coeff >= 0 ? '+' : ''} ${coeff}x${i + 1}`;
      }
    }
    result += ` = ${equation[variables] || 0}`;
    return result;
  };

  const handleSolve = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5001/solve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          equations: coefficients.map(eq => eq.map(val => parseFloat(val) || 0))
        }),
      });

      const data = await response.json();
      if (response.ok) {
        onSolve(data.solutions, coefficients);
      } else {
        alert(data.error || "An error occurred while solving the equations.");
      }
    } catch (error) {
      alert("Failed to connect to the server. Make sure the backend is running.");
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>
          <BackArrow />
        </button>
        <h1 style={styles.title}>Enter Coefficients</h1>
      </div>
      <div style={styles.equationGrid}>
        {coefficients.map((equation, rowIndex) => (
          <div key={rowIndex}>
            <div style={styles.equationRow}>
              {equation.map((coeff, colIndex) => (
                <input
                  key={colIndex}
                  type="number"
                  placeholder={colIndex < variables ? `x${colIndex + 1}` : '='}
                  value={coeff}
                  onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                  style={styles.coefficientInput}
                />
              ))}
            </div>
            <div style={styles.equationPreview}>
              {formatEquation(equation)}
            </div>
          </div>
        ))}
      </div>
      <button onClick={handleSolve} style={styles.button}>
        Solve System
      </button>
    </div>
  );
};

const Solution = ({ solutions, equations, onBack }) => {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>
          <BackArrow />
        </button>
        <h1 style={styles.title}>Solutions</h1>
      </div>
      <div style={styles.solutionSection}>
        <h3 style={styles.solutionTitle}>Original Equations:</h3>
        {equations.map((equation, index) => (
          <div key={index} style={styles.solutionItem}>
            {equation.slice(0, -1).map((coeff, i) => (
              <span key={i}>
                {i === 0 ? '' : coeff >= 0 ? ' + ' : ' '}
                {coeff || 0}x{i + 1}
              </span>
            ))}
            {' = '}{equation[equation.length - 1] || 0}
          </div>
        ))}
      </div>
      <div style={styles.solutionSection}>
        <h3 style={styles.solutionTitle}>Solutions:</h3>
        {solutions.map((solution, index) => (
          <div key={index} style={styles.solutionItem}>
            x{index + 1} = {solution}
          </div>
        ))}
      </div>
    </div>
  );
};

const App = () => {
  const [step, setStep] = useState(0);
  const [variables, setVariables] = useState(0);
  const [solutions, setSolutions] = useState([]);
  const [equations, setEquations] = useState([]);

  const handleVariableSubmit = (numVariables) => {
    setVariables(numVariables);
    setStep(1);
  };

  const handleSolve = (solutions, equations) => {
    setSolutions(solutions);
    setEquations(equations);
    setStep(2);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  return (
    <div style={styles.container}>
      {step === 0 && <Home onSubmit={handleVariableSubmit} />}
      {step === 1 && (
        <Coefficients 
          variables={variables} 
          onSolve={handleSolve}
          onBack={handleBack}
        />
      )}
      {step === 2 && (
        <Solution 
          solutions={solutions}
          equations={equations}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default App;