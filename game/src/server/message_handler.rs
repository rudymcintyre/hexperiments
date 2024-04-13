use core::str;

use serde::{Deserialize, Serialize};

use crate::game::{cell::CellValue, move_result::MoveResult};

use super::socket_manager::SocketManager;

/// Enum representing the type of message being sent
#[derive(Serialize, Deserialize, PartialEq)]
pub enum MessageType {
    PlayerRequest,
    PlayerReply,
    MoveRequest,
    MoveReply,
}

/// Enum representing the payload of the message according to the message type
#[derive(Serialize, Deserialize, PartialEq, Debug)]
#[serde(untagged)]
pub enum Payload {
    PlayerRequest(Vec<String>),
    PlayerReply(Vec<String>),
    MoveRequest(Vec<usize>),
    MoveReply(MoveResult),
}

impl Payload {
    pub fn into_player_request(self) -> Vec<String> {
        match self {
            Payload::PlayerRequest(data) => data,
            _ => panic!("Payload is not a PlayerRequest"),
        }
    }
    pub fn into_move_request(self) -> Vec<usize> {
        match self {
            Payload::MoveRequest(data) => data,
            _ => panic!("Payload is not a MoveRequest"),
        }
    }
}

/// Struct representing the game state message being sent on the PUB socket
#[derive(Serialize)]
struct GameStateMessage {
    board: Vec<Vec<CellValue>>,
    current_player: CellValue,
}

/// Struct representing the messages being sent or received
/// on the REQ-REP socket
#[derive(Serialize, Deserialize)]
struct Message {
    message_type: MessageType,
    payload: Payload,
}


/// Struct representing the message handler, a wrapper around the socket manager
/// specifically for handling hex messages
#[derive(Clone)]
pub struct MessageHandler<'a> {
    socket_manager: &'a SocketManager,
}

impl<'a> MessageHandler<'a> {
    pub fn new(socket_manager:  &'a SocketManager) -> Self {
        Self { socket_manager }
    }

    pub fn await_message(&self, message_type: MessageType) -> Payload {
        let message: String = self.socket_manager.receive_request();
        println!("{}", message.as_str());
        let deserialised_message: Message = serde_json::from_str(message.as_str()).unwrap();

        if deserialised_message.message_type != message_type {
            // handle error
        }
        deserialised_message.payload
    }

    pub fn acknowledge_player_connection(&self) {
        self.socket_manager.receive_request();
        self.socket_manager.send_reply("Ready");
    }

    /// Sends a message to the REP socket after serialising it
    pub fn send_message(&self, message_type: MessageType, payload: Payload) {
        let message = Message { message_type, payload };
        let serialised = serde_json::to_string(&message).unwrap();
        println!("{}", serialised.as_str());
        self.socket_manager.send_reply(
            serde_json::to_string(&message).unwrap().as_str()
        );
    }

    /// Serialise the game state and send it on the PUB socket
    pub fn send_game_state(&self, board: Vec<Vec<CellValue>>, current_player: CellValue) {
        let message = GameStateMessage { board, current_player };
        let serialised = serde_json::to_string(&message).unwrap();
        self.socket_manager.publish_data( serialised.as_str());
    }
}