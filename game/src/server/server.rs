use zmq::{Context, Socket, SocketType::{PUB, REP}};

pub struct HexServer {
    pub_socket: Socket,
    rep_socket: Socket,
}

impl HexServer {
    const DEFAULT_HOST: &str = "127.0.0.1";
    const DEFAULT_PORT: i32 = 5555;

    pub fn new() -> HexServer {
        let context: Context = Context::new();

        let pub_socket: Socket = context.socket(PUB).unwrap();
        let rep_socket: Socket = context.socket(REP).unwrap();
        HexServer { pub_socket, rep_socket }
    }

    pub fn bind(&self, host: Option<&str>, port: Option<i32>) {
        let address = format!(
            "tcp://{}:{}",
            host.unwrap_or(HexServer::DEFAULT_HOST),
            port.unwrap_or(HexServer::DEFAULT_PORT),
        );
        let address_2 = format!(
            "tcp://{}:{}",
            host.unwrap_or(HexServer::DEFAULT_HOST),
            port.unwrap_or(HexServer::DEFAULT_PORT + 1),
        );
        self.rep_socket.bind(&address).unwrap();
        self.pub_socket.bind(&address_2).unwrap();
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

