use std::{thread, time};

use crate::game::{game::Game, move_result};
use crate::server::{message_handler, subprocess_manager};

use tokio::runtime::Runtime;

mod game;
mod server;


fn main() {
    let server = server::socket_manager::SocketManager::new();
    server.bind(None, None);
    let message_handler = message_handler::MessageHandler::new(&server);

    // get agents and send to frontend
    let agents = subprocess_manager::get_agents();
    message_handler.await_message(message_handler::MessageType::PlayerRequest);
    println!("Received player request");
    message_handler.send_message(
        message_handler::MessageType::PlayerReply,
        message_handler::Payload::PlayerReply(agents.iter().map(|x| x.to_string()).collect()),
    );
    let runtime = Runtime::new().unwrap();

    let board_size = 5;
    let mut game = Game::new(board_size);

    loop {
        let selected_agents: Vec<String> = message_handler
            .await_message(message_handler::MessageType::PlayerReply)
            .into_player_request();
        
        message_handler.send_message(message_handler::MessageType::MoveReply,
            message_handler::Payload::MoveReply(move_result::MoveResult::Valid));

        let mut handshakes = 0;
        for agent in &selected_agents {
            if agent != "human" {
                handshakes += 1;
            }
        }

        
        runtime.spawn(async move {
            if selected_agents[0] != "human" {
                subprocess_manager::spawn_agent(&selected_agents[0], "Red", board_size);
            }
            if selected_agents[1] != "human" {
                subprocess_manager::spawn_agent(&selected_agents[1], "Blue", board_size);
            }
        });

        for _ in 0..handshakes {
            message_handler.acknowledge_player_connection();
        }

        loop {
            message_handler.send_game_state(
                game.get_board().get_board().clone(),
                game.get_current_player()
            );

            // game moves
            let requested_move = message_handler
                .await_message(message_handler::MessageType::MoveRequest)
                .into_move_request();

            println!("Received move: row: {}, col: {}", requested_move[0], requested_move[1]);
            let result = game.play(requested_move[0], requested_move[1]);

            message_handler.send_message(
                message_handler::MessageType::MoveReply,
                message_handler::Payload::MoveReply(result),
            );

            if result == move_result::MoveResult::BlueWin || result == move_result::MoveResult::RedWin {
                message_handler.send_game_state(
                    game.get_board().get_board().clone(),
                    game::cell::CellValue::Empty
                );
                break;
            }
        }
        println!("starting new game");
        game.reset();
        thread::sleep(time::Duration::from_millis(100));   
    }
}
