use std::{thread, time::Duration};

use crate::game::{game::Game, move_result};
use crate::game::cell::CellValue;

use serde::{Serialize, Deserialize};

mod game;
mod server;

#[derive(Serialize)]
struct GameMessage {
    board: Vec<Vec<CellValue>>,
    current_player: CellValue,
}

#[derive(Deserialize)]
struct MoveResult {
    row: usize,
    col: usize,
}

fn main() {
    println!("Hello, world!");
    let server = server::server::HexServer::new();
    server.bind(None, None);
    let mut game = Game::new(11);
    thread::sleep(Duration::from_millis(50));
    loop {
        // publish state
        let state: GameMessage = GameMessage {
            board: game.get_board().get_board().clone(),
            current_player: game.get_current_player(),
        };
        let message: String = serde_json::to_string(&state).unwrap();
        
        server.publish_data(message.as_str());


        println!("Waiting for move...");

        let move_result: MoveResult = serde_json::from_str(server.receive_request().as_str()).unwrap();
        println!("Received move: row: {}, col: {}", move_result.row, move_result.col);
        let result = game.play(move_result.row, move_result.col);

        match result {
            move_result::MoveResult::Valid => {
                server.send_reply("Valid");
            }
            move_result::MoveResult::Invalid => {
                server.send_reply("Invalid");
            }
            move_result::MoveResult::RedWin => {
                server.send_reply("RedWin");
                break;
            }
            move_result::MoveResult::BlueWin => {
                server.send_reply("BlueWin");
                break;
            }
        }
    }
}
