'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      try {
        const Solver = new SudokuSolver();
        const { puzzle: puzzleString, coordinate, value } = req.body;
        if(!puzzleString || !coordinate || !value) throw new Error(JSON.stringify({ error: 'Required field(s) missing' }));

        const check = Solver.validate(puzzleString, coordinate, value);
        if(!check.OK) throw new Error(JSON.stringify({ error: check.error }));

        const solved = Solver.solve(puzzleString);
        if(!solved.OK) throw new Error(JSON.stringify({ error: solved.error}));

        const [ x, y ] = [ coordinate.toLowerCase().charCodeAt(0) - 97, coordinate[1] - 1 ]; 

        const row = Solver.checkRowPlacement(puzzleString, x, y, value);
        const col = Solver.checkColPlacement(puzzleString, x, y, value);
        const region = Solver.checkRegionPlacement(puzzleString, x, y, value);
        if(!row.valid || !col.valid || !region.valid) {
          const conflict = [];
          if(row.conflict) conflict.push(row.conflict[0]);
          if(col.conflict) conflict.push(col.conflict[0]);
          if(region.conflict) conflict.push(region.conflict[0]);

          const errorMsg = JSON.stringify({ valid: false, conflict });
          throw new Error(errorMsg);
        }
        res.json({ valid: true });
      } catch (error) {
        res.send(error.message);
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      try {
        const puzzleString = req.body.puzzle;
        const Solver = new SudokuSolver();
        if(!puzzleString) throw new Error('Required field missing');
        
        const check = Solver.validate(puzzleString);
        if(!check.OK) throw new Error(check.error);

        const solved = Solver.solve(puzzleString);
        if(!solved.OK) throw new Error(solved.error);

        res.send(solved.OK);
      } catch (error) {
        res.json({ error: error.message });
      }
    });
};
