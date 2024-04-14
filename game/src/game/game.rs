use crate::game::cell::CellValue;
use crate::game::board::Board;
use crate::game::move_result::MoveResult;

use std::collections::HashMap;

pub struct Game {
    board: Board,
    current_player: CellValue,
    play_record: HashMap<CellValue, Vec<(usize, usize)>>,
}

impl Game {
    const INITIAL_PLAYER: CellValue = CellValue::Red;

    pub fn new(size: usize) -> Game {
        let board = Board::new(size);
        let current_player = Game::INITIAL_PLAYER;
        let mut play_record = HashMap::new();

        play_record.insert(CellValue::Red, Vec::new());
        play_record.insert(CellValue::Blue, Vec::new());

        Game { board, current_player, play_record }
    }

    pub fn get_board(&self) -> &Board {
        &self.board
    }

    pub fn get_current_player(&self) -> CellValue {
        self.current_player
    }

    pub fn play(&mut self, row: usize, col: usize) -> MoveResult {
        let cell: CellValue = self.board.get_cell(row, col);

        if cell != CellValue::Empty {
            return MoveResult::Invalid;
        }

        self.board.set_cell(row, col, self.current_player);
        self.play_record
            .get_mut(&self.current_player)
            .unwrap()
            .push(
                (row, col)
            );

        if self.check_winner() {
            match self.current_player {
                CellValue::Red => return MoveResult::RedWin,
                CellValue::Blue => return MoveResult::BlueWin,
                _ => return MoveResult::Invalid,
            }
        }

        self.swap_player();

        MoveResult::Valid
    }

    fn check_winner(&self) -> bool {
        if self.play_record.get(&self.current_player).unwrap().len() < self.board.get_size() {
            return false;
        }

        let mut visited: Vec<Vec<bool>> = vec![vec![false; self.board.get_size()]; self.board.get_size()];

        for (row, col) in self.play_record.get(&self.current_player).unwrap() {
            let red_start_edge: bool = self.current_player == CellValue::Red && *col == 0;
            let blue_start_edge: bool = self.current_player == CellValue::Blue && *row == 0;

            if visited[*row][*col] || !(red_start_edge || blue_start_edge) {
                continue;
            }

            if self.dfs_on_node(*row, *col, &mut visited) {
                return true;
            }
        }

        false
    }

    fn dfs_on_node(&self, row: usize, col: usize, visited: &mut Vec<Vec<bool>>) -> bool {
        visited[row][col] = true;
        let mut stack: Vec<(usize, usize)> = Vec::new();

        stack.push((row, col));

        while stack.len() > 0 {
            let (r, c) = stack.pop().unwrap();

            let neighbours = self.board.get_neighbours(r, c);
            for (nr, nc) in neighbours {
                if self.board.get_cell(nr, nc) != self.current_player {
                    continue;
                }

                let end_edge = match self.current_player {
                    CellValue::Red => nc == self.board.get_size() - 1,
                    CellValue::Blue => nr == self.board.get_size() - 1,
                    _ => false,
                };

                if end_edge {
                    return true;
                }

                if !visited[nr][nc] {
                    visited[nr][nc] = true;
                    stack.push((nr, nc));
                }
            }
        }

        false
    }

    pub fn reset(&mut self) -> () {
        self.board.reset();
        self.current_player = Game::INITIAL_PLAYER;

        self.play_record
            .get_mut(&CellValue::Red)
            .unwrap()
            .clear();
        self.play_record
            .get_mut(&CellValue::Blue)
            .unwrap()
            .clear();
    }

    fn swap_player(&mut self) -> () {
        match self.current_player {
            CellValue::Red => self.current_player = CellValue::Blue,
            CellValue::Blue => self.current_player = CellValue::Red,
            _ => (),
        }
    }
}