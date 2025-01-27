import requests

# Define the URL for the API
url = "http://127.0.0.1:5001/solve"

# Define test cases
test_cases = [
    # Valid cases
    {
        "description": "Test Case 1: Simple 3x3 system",
        "payload": {
            "equations": [
                [2, 1, -1, 8],
                [-3, -1, 2, -11],
                [-2, 1, 2, -3]
            ]
        },
        "expected_status": 200,
        "expected_result": [2.0, 3.0, -1.0]
    },
    {
        "description": "Test Case 2: Simple 2x2 system",
        "payload": {
            "equations": [
                [1, 2, 9],
                [3, 4, 19]
            ]
        },
        "expected_status": 200,
        "expected_result": [1.0, 4.0]
    },
    {
        "description": "Test Case 3: Unique solution with decimals",
        "payload": {
            "equations": [
                [1.5, 2.3, 7.4],
                [3.6, 4.9, 18.2]
            ]
        },
        "expected_status": 200,
        "expected_result": [6.02, -0.71]
    },
    {
        "description": "Test Case 4: 3x3 system with all zeros in one row",
        "payload": {
            "equations": [
                [1, 2, 3, 6],
                [4, 5, 6, 15],
                [0, 0, 0, 0]
            ]
        },
        "expected_status": 400,
        "expected_error": "Matrix contains a zero row, no unique solution"
    },
    {
        "description": "Test Case 5: Single equation (1x1 matrix)",
        "payload": {
            "equations": [
                [5, 25]
            ]
        },
        "expected_status": 200,
        "expected_result": [5.0]
    },
    {
        "description": "Test Case 6: 4x4 system",
        "payload": {
            "equations": [
                [1, 1, 1, 1, 10],
                [2, 3, 1, 5, 30],
                [1, 2, 2, 1, 20],
                [3, 1, 1, 1, 25]
            ]
        },
        "expected_status": 200,
        "expected_result": [2.0, 3.0, 4.0, 1.0]
    },
    # Invalid inputs
    {
        "description": "Test Case 7: Empty payload",
        "payload": {},
        "expected_status": 400,
        "expected_error": "Invalid input, please provide 'equations' key"
    },
    {
        "description": "Test Case 8: Missing 'equations' key",
        "payload": {
            "data": []
        },
        "expected_status": 400,
        "expected_error": "Invalid input, please provide 'equations' key"
    },
    {
        "description": "Test Case 9: Non-augmented matrix (missing constants column)",
        "payload": {
            "equations": [
                [1, 2],
                [3, 4]
            ]
        },
        "expected_status": 400,
        "expected_error": "Invalid matrix dimensions"
    },
    {
        "description": "Test Case 10: Augmented matrix with unequal row lengths",
        "payload": {
            "equations": [
                [1, 2, 3],
                [4, 5]
            ]
        },
        "expected_status": 400,
        "expected_error": "Rows have inconsistent lengths"
    },
    {
        "description": "Test Case 11: Matrix with non-numeric values",
        "payload": {
            "equations": [
                [1, 2, 3, "a"],
                [4, 5, 6, 7]
            ]
        },
        "expected_status": 400,
        "expected_error": "Matrix contains non-numeric values"
    },
    # Special cases
    {
        "description": "Test Case 12: Infinite solutions (dependent equations)",
        "payload": {
            "equations": [
                [1, 2, 3],
                [2, 4, 6]
            ]
        },
        "expected_status": 400,
        "expected_error": "Inconsistent or dependent system, no unique solution"
    },
    {
        "description": "Test Case 13: No solution (inconsistent equations)",
        "payload": {
            "equations": [
                [1, 1, 3],
                [1, 1, 4]
            ]
        },
        "expected_status": 400,
        "expected_error": "Inconsistent or dependent system, no unique solution"
    },
    # Large systems
    {
        "description": "Test Case 14: Large 5x5 system",
        "payload": {
            "equations": [
                [1, 2, 3, 4, 5, 35],
                [2, 3, 4, 5, 6, 50],
                [3, 4, 5, 6, 7, 65],
                [4, 5, 6, 7, 8, 80],
                [5, 6, 7, 8, 9, 95]
            ]
        },
        "expected_status": 200,
        "expected_result": [1.0, 2.0, 3.0, 4.0, 5.0]
    },
    # Edge cases
    {
        "description": "Test Case 15: Zero coefficients",
        "payload": {
            "equations": [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ]
        },
        "expected_status": 400,
        "expected_error": "Matrix contains a zero row, no unique solution"
    },
    {
        "description": "Test Case 16: Floating-point precision check",
        "payload": {
            "equations": [
                [0.1, 0.2, 0.3],
                [0.4, 0.5, 0.6]
            ]
        },
        "expected_status": 400,
        "expected_error": "Inconsistent or dependent system, no unique solution"
    },
    {
        "description": "Test Case 17: Negative coefficients",
        "payload": {
            "equations": [
                [-1, -2, -3, -6],
                [-4, -5, -6, -15],
                [-7, -8, -9, -24]
            ]
        },
        "expected_status": 400,
        "expected_error": "Inconsistent or dependent system, no unique solution"
    },
    {
        "description": "Test Case 18: Very large numbers in equations",
        "payload": {
            "equations": [
                [1e10, 2e10, 3e10, 6e10],
                [4e10, 5e10, 6e10, 15e10],
                [7e10, 8e10, 9e10, 24e10]
            ]
        },
        "expected_status": 400,
        "expected_error": "Inconsistent or dependent system, no unique solution"
    },
    {
        "description": "Test Case 19: System with all zero constants",
        "payload": {
            "equations": [
                [1, 1, 1, 0],
                [2, 2, 2, 0],
                [3, 3, 3, 0]
            ]
        },
        "expected_status": 400,
        "expected_error": "Inconsistent or dependent system, no unique solution"
    },
    {
        "description": "Test Case 20: Single-variable system with zero coefficient",
        "payload": {
            "equations": [
                [0, 5]
            ]
        },
        "expected_status": 400,
        "expected_error": "Matrix contains a zero row, no unique solution"
    }
]

# Test execution
for i, test in enumerate(test_cases, start=1):
    print(f"Running {test['description']}...")
    try:
        response = requests.post(url, json=test["payload"])
        if response.status_code == test["expected_status"]:
            print(f"Test {i} PASSED!")
            if "expected_result" in test:
                result = response.json().get("solutions")
                assert result == test["expected_result"], f"Expected {test['expected_result']}, got {result}"
                print("Solutions:", result)
            elif "expected_error" in test:
                error_message = response.json().get("error", "")
                assert test["expected_error"] in error_message, f"Expected error to contain '{test['expected_error']}', got '{error_message}'"
                print("Error:", error_message)
        else:
            print(f"Test {i} FAILED! Expected status {test['expected_status']}, got {response.status_code}")
            print("Response:", response.json())
    except Exception as e:
        print(f"Test {i} FAILED due to an exception: {e}")

print("All tests completed.")