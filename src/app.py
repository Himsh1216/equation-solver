from flask import Flask, request, jsonify
from flask_cors import CORS
from sympy import Matrix

app = Flask(__name__)
CORS(app)

def solve_system(coefficients):
    """
    Solve a system of linear equations using SymPy's RREF method.
    """
    try:
        # Convert the coefficients into a SymPy matrix
        matrix = Matrix(coefficients)
        
        # Perform RREF
        rref_matrix, pivot_columns = matrix.rref()
        
        # Check for inconsistent or dependent systems
        rank = matrix.rank()
        num_rows = matrix.rows
        num_cols = matrix.cols
        
        # Check for inconsistent system (e.g., 0 = non-zero constant)
        for i in range(rank, num_rows):
            if any(matrix.row(i)) and matrix[i, -1] != 0:
                return {"error": "Inconsistent or dependent system, no unique solution"}
        
        # Check for dependent system (less pivots than variables)
        if rank < num_cols - 1:
            return {"error": "Inconsistent or dependent system, no unique solution"}

        # Extract solutions from the last column
        solutions = [rref_matrix[i, -1].evalf() for i in range(rank)]

        # Adjust for floating-point precision
        tolerance = 1e-7
        solutions = [float(s) if abs(s) > tolerance else 0.0 for s in solutions]

        return solutions

    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}


@app.route('/solve', methods=['POST'])
def solve():
    """
    API endpoint to solve a system of equations.
    """
    data = request.get_json()

    # Validate input data
    if not data or 'equations' not in data:
        return jsonify({"error": "Invalid input, please provide 'equations' key"}), 400

    coefficients = data['equations']

    # Check for empty payload or invalid dimensions
    if not coefficients:
        return jsonify({"error": "Matrix is empty"}), 400

    row_lengths = [len(row) for row in coefficients]
    if len(set(row_lengths)) != 1:
        return jsonify({"error": "Rows have inconsistent lengths"}), 400

    if len(coefficients[0]) - 1 != len(coefficients):
        return jsonify({"error": "Invalid matrix dimensions"}), 400

    # Check for zero rows
    if any(all(val == 0 for val in row[:-1]) for row in coefficients):
        return jsonify({"error": "Matrix contains a zero row, no unique solution"}), 400

    result = solve_system(coefficients)

    if isinstance(result, dict) and "error" in result:
        return jsonify(result), 400

    return jsonify({"solutions": result})

if __name__ == '__main__':
    app.run(debug=True, port=5001)