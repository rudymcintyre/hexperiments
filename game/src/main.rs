use std::{thread, time};

use crate::game::{game::Game, move_result};
use crate::server::{message_handler, subprocess_manager};

use tokio::runtime::Runtime;

mod game;
mod server;

use::std::env;


fn main() {
    let server = server::socket_manager::SocketManager::new();
    server.bind(None, None);
    let message_handler = message_handler::MessageHandler::new(&server);

    let args: Vec<String> = env::args().collect();
    let mut board_size = 7;
    if args.len() == 1 {
        println!("No agents specified, you must be using the GUI. Waitng for player request...");
        // get agents and send to frontend
        let agents = subprocess_manager::get_agents();
        message_handler.await_message(message_handler::MessageType::PlayerRequest);
        println!("Received player request");
        message_handler.send_message(
            message_handler::MessageType::PlayerReply,
            message_handler::Payload::PlayerReply(agents.iter().map(|x| x.to_string()).collect()),
        );
    } else {
        board_size = args[1].parse().unwrap();
    }
    let runtime = Runtime::new().unwrap();
    
    let mut game = Game::new(board_size);

    let mut blue_wins = 0;
    let mut red_wins = 0;
    let mut game_durations: Vec<f32> = Vec::new();
    let mut game_count = 0;

    let mut start_time = time::Instant::now();

    loop {
        let mut selected_agents: Vec<String> = Vec::new();
        let mut handshakes;
        if args.len() == 1 {
            selected_agents = message_handler
                .await_message(message_handler::MessageType::PlayerReply)
                .into_player_request();
            message_handler.send_message(message_handler::MessageType::MoveReply,
                message_handler::Payload::MoveReply(move_result::MoveResult::Valid));
            handshakes = 0;
            for agent in &selected_agents {
                if agent != "human" {
                    handshakes += 1;
                }
            }
        } else {
            selected_agents.push(args[2].to_string());
            selected_agents.push(args[3].to_string());
            handshakes = 2;
        }
        
        println!("Selected agents: {:?}", selected_agents);
        println!("Staring game... #{}", game_count);
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
        game.reset();

        if game.get_current_player() == game::cell::CellValue::Red {
            blue_wins += 1;
        } else {
            red_wins += 1;
        }

        let duration = start_time.elapsed().as_secs_f32();
        game_durations.push(duration);
        
        thread::sleep(time::Duration::from_millis(100));

        start_time = time::Instant::now();
        game_count += 1;

        if args.len() != 1 {
            let total_matches: i32 = args[4].parse().unwrap();
            if game_count == total_matches {
                break;
            }
        }
    }

    println!("Red wins: {}, Blue wins: {}", red_wins, blue_wins);
    println!("Average game duration: {}", game_durations.iter().sum::<f32>() / game_durations.len() as f32);
}
