use std::env;
use std::sync::{Arc, Mutex};
use std::{thread, time::Duration};

use crate::game::{game::Game, move_result};
use crate::game::cell::CellValue;

use serde::{Serialize, Deserialize};

use std::process::{Command, Output};
use tokio::process::Command as AsyncCommand;
use tokio::runtime::Runtime;

mod game;
mod server;

#[derive(Serialize)]
struct GameMessage {
    board: Vec<Vec<CellValue>>,
    current_player: CellValue,
}

#[derive(Deserialize)]
struct MoveResult {
    m_type: String,
    data: Vec<usize>,
}

#[derive(Serialize, Deserialize)]
struct Message {
    m_type: String,
    data: Vec<String>,
}

fn main() {
    println!("Hello, world!");
    let server = server::server::HexServer::new();
    server.bind(None, None);
    let mut game = Game::new(11);

    println!("{}", env::current_dir().unwrap().to_str().unwrap());

    let front_end_connected: Message = serde_json::from_str(server.receive_request().as_str()).unwrap();
    let agents: Output = Command::new("python3")
        .current_dir("./../player/")
        .arg("main.py")
        .arg("agents")
        .arg("--quiet")
        .output()
        .unwrap();
    let agents: String = String::from_utf8(agents.stdout).unwrap();
    let mut agents: Vec<&str> = agents.trim().split(",").collect();
    agents.push("human");
    println!("Agents: {:?}", agents);

    if front_end_connected.m_type == "Players" {
        let message: Message = Message {
            m_type: "Players".to_string(),
            data: agents.iter().map(|x| x.to_string()).collect(),
        };
        server.send_reply(serde_json::to_string(&message).unwrap().as_str());
    }

    let reply: Message = serde_json::from_str(server.receive_request().as_str()).unwrap();
    println!("{} {} {}", reply.m_type, reply.data[0], reply.data[1]);
    server.send_reply("Ready");

    let runtime = Runtime::new().unwrap();
    runtime.spawn(async move {
        if reply.data[0] != "human" {
            let _ = AsyncCommand::new("python3")
                .current_dir("./../player/")
                .stdout(std::process::Stdio::inherit())
                .arg("main.py")
                .arg("start-agent")
                .arg(&(reply.data[0]))
                .arg("RED")
                .spawn()
                .unwrap();
        }
        if reply.data[1] != "human" {
            let _ = AsyncCommand::new("python3")
                .current_dir("./../player/")
                .stdout(std::process::Stdio::inherit())
                .arg("main.py")
                .arg("start-agent")
                .arg(&(reply.data[1]))
                .arg("BLUE")
                .spawn().unwrap();
        }
    });

    // cheeky sleep to allow agents to start (REPLACE WITH PROPER SYNCHRONISATION)
    thread::sleep(Duration::from_millis(150));

    loop {
        // publish state
        let state: GameMessage = GameMessage {
            board: game.get_board().get_board().clone(),
            current_player: game.get_current_player(),
        };
        let message: String = serde_json::to_string(&state).unwrap();
        server.publish_data(message.as_str());
        println!("Waiting for move...");


        // game moves
        let move_result: MoveResult = serde_json::from_str(server.receive_request().as_str()).unwrap();
        println!("Received move: row: {}, col: {}", move_result.data[0], move_result.data[1]);
        let result = game.play(move_result.data[0], move_result.data[1]);

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

    let state: GameMessage = GameMessage {
        board: game.get_board().get_board().clone(),
        current_player: CellValue::Empty,
    };
    let message: String = serde_json::to_string(&state).unwrap();
    server.publish_data(message.as_str());

    thread::sleep(Duration::from_millis(100));

}
