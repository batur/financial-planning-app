import { TableDataItem } from "@/hooks/useGetTableData";

/**
 * Calculator function that evaluates mathematical expressions with ID references
 * @param {string} input - The input expression, which may contain ID references like <id_39>
 * @param {TableDataItem[]} store - The data store containing items with values to substitute
 * @param {string} [targetId] - Optional ID of the item to update with the result
 * @returns {number} The calculated result
 */
function calculator(
  input: string,
  store: (TableDataItem & {
    result?: string;
  })[],
  targetId?: string
): number {
  // Replace all ID references with their corresponding values from the store
  const processedInput = replaceIdReferences(input, store);

  // Evaluate the processed expression
  const result = evaluateExpression(processedInput);

  // Update the result field if targetId is provided
  if (targetId) {
    const targetItem = store.find((item) => item.id === targetId);
    if (targetItem) {
      targetItem.result = result.toString();
    }
  }

  return result;
}

function replaceIdReferences(
  input: string,
  store: (TableDataItem & {
    result?: string;
  })[]
): string {
  // Match pattern <id_X> where X is a number
  const idRefPattern = /<id_(\d+)>/g;

  return input.replace(idRefPattern, (match, idStr) => {
    const id = parseInt(idStr, 10);
    const item = store.find((item) => item.id === id.toString());

    if (!item) {
      throw new Error(`Reference to non-existent ID: ${id}`);
    }

    return item.value.toString();
  });
}

/**
 * Evaluates a mathematical expression
 * @param {string} expression - The expression to evaluate
 * @returns {number} The result
 */
function evaluateExpression(expression: string): number {
  // Remove all spaces
  expression = expression.replace(/\s+/g, "");

  // Parse addition and subtraction
  return parseAddSubtract(expression);
}

/**
 * Parses addition and subtraction operations
 */
function parseAddSubtract(expression: string): number {
  let result = parseMultiplyDivide(expression);
  let remaining = "";

  for (let i = 0; i < expression.length; i++) {
    if (expression[i] === "+") {
      remaining = expression.substring(i + 1);
      result += parseMultiplyDivide(remaining);
      break;
    } else if (expression[i] === "-") {
      remaining = expression.substring(i + 1);
      result -= parseMultiplyDivide(remaining);
      break;
    }
  }

  return result;
}

/**
 * Parses multiplication and division operations
 */
function parseMultiplyDivide(expression: string): number {
  let result = parsePower(expression);
  let remaining = "";

  for (let i = 0; i < expression.length; i++) {
    if (expression[i] === "*") {
      remaining = expression.substring(i + 1);
      result *= parsePower(remaining);
      break;
    } else if (expression[i] === "/") {
      remaining = expression.substring(i + 1);
      result /= parsePower(remaining);
      break;
    }
  }

  return result;
}

/**
 * Parses exponentiation operations
 */
function parsePower(expression: string): number {
  let result = parseParentheses(expression);
  let remaining = "";

  for (let i = 0; i < expression.length; i++) {
    if (expression[i] === "^") {
      remaining = expression.substring(i + 1);
      result = Math.pow(result, parseParentheses(remaining));
      break;
    }
  }

  return result;
}

/**
 * Parses expressions within parentheses
 */
function parseParentheses(expression: string): number {
  if (expression[0] === "(") {
    let parenCount = 1;
    let closeIndex = 1;

    while (parenCount > 0 && closeIndex < expression.length) {
      if (expression[closeIndex] === "(") parenCount++;
      if (expression[closeIndex] === ")") parenCount--;
      closeIndex++;
    }

    const innerExpr = expression.substring(1, closeIndex - 1);
    return parseAddSubtract(innerExpr);
  }

  return parseNumber(expression);
}

/**
 * Parses a number from the beginning of the expression
 */
function parseNumber(expression: string): number {
  const match = expression.match(/^(-?\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

export default calculator;
