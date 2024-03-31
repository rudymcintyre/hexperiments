use zmq::{Context, Socket, REP};

fn main() {
    let context = Context::new();
    let responder = context.socket(REP).unwrap();
    responder.bind("tcp://127.0.0.1:5555").unwrap();

    loop {
        let _request = responder.recv_msg(0).unwrap();
        // Process the request and generate a response
        let response = "Response from Rust backend";
        responder.send(response.as_bytes(), 0).unwrap();
    }
}
