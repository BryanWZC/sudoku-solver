class SudokuSolver {

  validate(puzzleString, coordinate, value) {
    if(puzzleString.match(/[^0-9\.]/g)) return { error: 'Invalid characters in puzzle' };
    if(puzzleString.length !== 81) return { error: 'Expected puzzle to be 81 characters long' };
    if(value) {
      const val = value.charCodeAt(0) - 48;
      if(value.length > 1 || val < 1 || val > 9) return { error: 'Invalid value' };
    }
    if(coordinate) {
      const x = Number(coordinate[0].toLowerCase().charCodeAt(0) - 96);
      const y = Number(coordinate[1].toLowerCase().charCodeAt(0) - 48);
      if(coordinate.length > 2 ||
        x < 1 ||
        x > 9 ||
        y < 1 || 
        y > 9
      ) return { error: 'Invalid coordinate' };
    }
    return { OK: 'OK'};
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const board = this.convertToBoard(puzzleString);
    for(let i = 0; i < 9; i++) {
      if(board[row][i] == value) return { valid: false, conflict: [ 'row' ]};
    }
    return { valid: true };
  }

  checkColPlacement(puzzleString, row, column, value) {
    const board = this.convertToBoard(puzzleString);
    for(let i = 0; i < 9; i++) {
      if(board[i][column] == value) return { valid: false, conflict: [ 'column' ]};
    }
    return { valid: true };
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const board = this.convertToBoard(puzzleString);
    for(let i = 0; i < 9; i++) {
      const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      const n = 3 * Math.floor(column / 3) + i % 3;
      if(board[m][n] == value) return { valid: false, conflict: [ 'region' ]};
    }
    return { valid: true };
  }

  solve(puzzleString) {
    const board = this.convertToBoard(puzzleString);
    const solved = this.isSolution(board);
    if(!solved || !this.checkResults(board)) return { error: 'Puzzle cannot be solved' };
    
    const results = String(board).replace(/\,/g, '');
    return { OK: { solution: results } };
  }

  convertToBoard(puzzleString) {
    const board = [];
    for(let i = 0; i < 9; i++) {
      const boardRow = puzzleString.slice(i * 9, i * 9 + 9).split('');
      board.push(boardRow);
    }
    return board;
  }

  isValid(board, row, col, k) {
    for (let i = 0; i < 9; i++) {
        const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
        const n = 3 * Math.floor(col / 3) + i % 3;
        if (board[row][i] == k || board[i][col] == k || board[m][n] == k) {
          return false;
        }
    }
    return true;
}

  isSolution(data) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (data[i][j] == '.') {
          for (let k = 1; k <= 9; k++) {
            if (this.isValid(data, i, j, k)) {
              data[i][j] = `${k}`;
            if (this.isSolution(data)) {
              return true;
              } else {
              data[i][j] = '.';
              }
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  checkResults(board) {
    for(let i = 0; i < 9; i++) {
      for(let j = 0; j < 9; j++) {
        const temp = board[i][j];
        board[i][j] = 0;
        if(!this.isValid(board, i, j, temp)) return false;
        board[i][j] = temp;
      }
    }
    return true;
  }
}

module.exports = SudokuSolver;

