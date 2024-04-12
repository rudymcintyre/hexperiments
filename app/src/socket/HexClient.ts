import * as zmq from 'zeromq';

class HexClient {

    private subSocket: zmq.Socket;
    private reqSocket: zmq.Socket;
    private host: string;
    private port: number;

    constructor(host: string='127.0.0.1', port: number=5555) {
        this.reqSocket = zmq.socket("req");
        this.subSocket = zmq.socket("sub");

        this.host = host;
        this.port = port;
    }

    async connect(sub_callback: any, req_callback: any) {
        await this.reqSocket.connect(`tcp://${this.host}:${this.port}`);
        await this.subSocket.connect(`tcp://${this.host}:${this.port + 1}`);
        
        console.log("Connected to server");
        
        this.subSocket.subscribe("");
        this.subSocket.on("message", sub_callback);
        this.reqSocket.on("message", req_callback);
    }

    async send_request(messageType: string, data: string[] | number[] | null) {
        const message = JSON.stringify({m_type: messageType, data: data});
        console.log("sending request");
        await this.reqSocket.send(message);
    }
}

export default HexClient;