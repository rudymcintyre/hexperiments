use std::{thread, time::Duration};

use crate::game::game::Game;
use crate::game::cell::CellValue;

use serde::{Serialize};

mod game;
mod server;

#[derive(Serialize)]
struct GameMessage {
    board: Vec<Vec<CellValue>>,
    current_player: CellValue,
}

fn main() {
    println!("Hello, world!");
    let server = server::server::HexServer::new();
    server.bind(None, None);
    
    let game = Game::new(11);
    loop {
        let state: GameMessage = GameMessage {
            board: game.get_board().get_board().clone(),
            current_player: game.get_current_player(),
        };
        let message: String = serde_json::to_string(&state).unwrap();
        server.publish_data(message.as_str());
        thread::sleep(Duration::from_secs(1));
    }
}
