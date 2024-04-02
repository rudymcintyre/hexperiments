

use crate::game::cell::CellValue;

#[derive(Clone, PartialEq)]
pub struct Board {
    board: Vec<Vec<CellValue>>,
    size: usize,
}

impl Board {
    pub fn new(size: usize) -> Board {
        let board = vec![vec![CellValue::Empty; size]; size];
        Board { board, size }
    }

    pub fn reset(&mut self) -> () {
        self.board = vec![vec![CellValue::Empty; self.size]; self.size];
    }

    pub fn set_cell(&mut self, row: usize, col: usize, value: CellValue) -> () {
        self.board[row][col] = value;
    }

    pub fn get_board(&self) -> &Vec<Vec<CellValue>> {
        &(self.board)
    }

    pub fn get_cell(&self, row: usize, col: usize) -> CellValue {
        self.board[row][col]
    }

    pub fn get_size(&self) -> usize {
        self.size
    }

    pub fn get_neighbours(&self, row: usize, col: usize) -> Vec<(usize, usize)> {
        const DIRECTIONS: [(i32, i32); 6] = [
            (-1, 0), (-1, 1), (0, 1), (1, 0), (1, -1), (0, -1)
        ];

        let mut neighbours = Vec::new();
        for (drow, dcol) in DIRECTIONS {
            let new_row: i32 = row as i32 + drow;
            let new_col: i32 = col as i32 + dcol;

            let is_valid_space: bool =
                new_row >= 0 && 
                new_row < self.size as i32 && 
                new_col >= 0 && 
                new_col < self.size as i32;

            if is_valid_space {
                neighbours.push((new_row as usize, new_col as usize));
            }
        }

        neighbours
    }
}