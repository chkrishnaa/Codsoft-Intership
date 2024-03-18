let string = "";
let isOn = false;

function getPrecedence(operator) {
    if (operator === '+' || operator === '-') {
        return 1;
    } else if (operator === '*' || operator === '/' || operator === '%') {
        return 2;
    }
    return 0;
}

function isOperator(c) {
    return c === '+' || c === '-' || c === '*' || c === '/' || c === '%';
}

function isOperand(c) {
    return !isNaN(c) || c === '.';
}

function applyOperator(operator, operand1, operand2) {
    switch (operator) {
        case '+':
            return operand1 + operand2;
        case '-':
            return operand1 - operand2;
        case '*':
            return operand1 * operand2;
        case '/':
            if (operand2 === 0) {
                throw new Error("Division by zero is not allowed.");
            }
            return operand1 / operand2;
        case '%':
            return operand1 % operand2;
        default:
            throw new Error("Invalid operator: " + operator);
    }
}

function evaluateInfixExpression(infixExpression) {
    const operands = [];
    const operators = [];

    for (let i = 0; i < infixExpression.length; i++) {
        let c = infixExpression.charAt(i);

        if (c === 'x') {
            c = '*'; // Replace 'x' with '*'
        }

        if (/\s/.test(c)) {
            continue; // Skip whitespaces
        }

        if (isOperand(c)) {
            let operandBuilder = c;

            while (i + 1 < infixExpression.length && isOperand(infixExpression.charAt(i + 1))) {
                operandBuilder += infixExpression.charAt(++i);
            }

            operands.push(parseFloat(operandBuilder));
        } else if (c === '(') {
            operators.push(c);
        } else if (c === ')') {
            while (operators.length > 0 && operators[operators.length - 1] !== '(') {
                const operand2 = operands.pop();
                const operand1 = operands.pop();
                const operator = operators.pop();
                operands.push(applyOperator(operator, operand1, operand2));
            }
            operators.pop(); // Pop '('
        } else if (isOperator(c)) {
            if (c === '-' && (i === 0 || isOperator(infixExpression.charAt(i - 1)) || infixExpression.charAt(i - 1) === '(')) {
                // Handle negative numbers
                let operandBuilder = '-';
                while (i + 1 < infixExpression.length && isOperand(infixExpression.charAt(i + 1))) {
                    operandBuilder += infixExpression.charAt(++i);
                }
                operands.push(parseFloat(operandBuilder));
            } else {
                while (operators.length > 0 && getPrecedence(operators[operators.length - 1]) >= getPrecedence(c)) {
                    const operand2 = operands.pop();
                    const operand1 = operands.pop();
                    const operator = operators.pop();
                    operands.push(applyOperator(operator, operand1, operand2));
                }
                operators.push(c);
            }
        } else {
            throw new Error("Invalid character in the expression: " + c);
        }
    }

    while (operators.length > 0) {
        const operand2 = operands.pop();
        const operand1 = operands.pop();
        const operator = operators.pop();
        operands.push(applyOperator(operator, operand1, operand2));
    }

    if (operands.length !== 1 || operators.length > 0) {
        throw new Error("Invalid infix expression");
    }

    return operands.pop();
}

function updateCalculatorState(on) {
    isOn = on;
    const box = document.querySelector('.box');
    const window1 = document.querySelector('.window1');
    const window2 = document.querySelector('.window2');

    if (on) {
        window1.style.backgroundColor = 'rgb(160, 246, 218)';
        window2.style.backgroundColor = 'rgb(160, 246, 218)';
        window1.style.textAlign = 'left';
        window2.style.textAlign = 'right';
    } else {
        window1.style.backgroundColor = 'rgba(0, 0, 0, 0.643)';
        window2.style.backgroundColor = 'rgba(0, 0, 0, 0.643)';
        window1.style.textAlign = '';
        window2.style.textAlign = '';
    }

    window1.style.fontSize = on ? '25px' : '';
    window2.style.fontSize = on ? 'inherit' : '';
}

document.querySelectorAll('.Box2').forEach((button) => {
    button.addEventListener('click', (e) => {
        if (e.target.innerHTML === 'ON') {
            updateCalculatorState(true);
        } else if (e.target.innerHTML === 'OFF') {
            updateCalculatorState(false);
            string = '';
            document.querySelector('.window1').textContent = '';
            document.querySelector('.window2').textContent = '';
        }
    });
});

document.querySelectorAll('.Button').forEach((button) => {
    button.addEventListener('click', (e) => {
        if (isOn) {
            if (e.target.innerHTML === '=') {
                try {
                    const result = evaluateInfixExpression(string);
                    document.querySelector('.window2').textContent = result;
                } catch (error) {
                    document.querySelector('.window2').textContent = "Error";
                }
            } else if (e.target.innerHTML === 'AC') {
                string = '';
                document.querySelector('.window1').textContent = string;
                document.querySelector('.window2').textContent = string;
            } else if (e.target.innerHTML === 'DEL') {
                string = string.slice(0, -1);
                document.querySelector('.window1').textContent = string;
            } else {
                string += e.target.innerHTML;
                document.querySelector('.window1').textContent = string;
            }
        }
    });
});
