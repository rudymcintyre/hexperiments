use zmq::{Context, Socket, SocketType::{PUB, REP}};

pub struct SocketManager {
    pub_socket: Socket,
    rep_socket: Socket,
}

impl SocketManager {
    const DEFAULT_HOST: &str = "127.0.0.1";
    const DEFAULT_PORT: i32 = 5555;

    pub fn new() -> SocketManager {
        let context: Context = Context::new();

        let pub_socket: Socket = context.socket(PUB).unwrap();
        let rep_socket: Socket = context.socket(REP).unwrap();
        SocketManager { pub_socket, rep_socket }
    }

    pub fn bind(&self, host: Option<&str>, port: Option<i32>) {
        let rep_address = SocketManager::port_format(host, port);
        let pub_address = SocketManager::port_format(host, 
            Some(port.unwrap_or(SocketManager::DEFAULT_PORT) + 1));

        self.rep_socket.bind(&rep_address).unwrap();
        self.pub_socket.bind(&pub_address).unwrap();
    }

    fn port_format(host: Option<&str>, port: Option<i32>) -> String {
        format!("tcp://{}:{}", host.unwrap_or(SocketManager::DEFAULT_HOST),
            port.unwrap_or(SocketManager::DEFAULT_PORT))
    }

    pub fn receive_request(&self) -> String {
        self.rep_socket.recv_string(0).unwrap().unwrap()
    }

    pub fn send_reply(&self, message: &str) {
        self.rep_socket.send(message, 0).unwrap();
    }

    pub fn publish_data(&self, message: &str) {
        self.pub_socket.send(message, 0).unwrap();
    }
}

