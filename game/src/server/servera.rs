
use zmq::{Context, Socket, SocketType::PUB, REP};
use std::thread;
use std::time::Duration;
pub fn do_some_sending() {
    let context: Context = Context::new();
    let socket: Socket = context.socket(PUB).unwrap();
    assert!(socket.bind("tcp://127.0.0.1:5556").is_ok());

    loop {
        println!("done");
        socket.send("things", 0).unwrap();
        thread::sleep(Duration::from_secs(1));
    }
}
