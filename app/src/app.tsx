
import ReactDOM from 'react-dom';
// import { BoardComponent } from './components/BoardComponent';
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client'
import * as zmq from 'zeromq';



const App: React.FC = () => {
    //const [game, setGame] = React.useState<>(new Game(11));
    const [socket, setSocket] = React.useState<zmq.Socket>(null);

    // async function send() {
    //     console.log(socket)
    //     if (socket) {
    //         await socket.send("hellowww")
    //         console.log("sent!")
    //     } else {
    //         console.log("socket not connected")
    //     }
    // }

    // const recieve = async (message: any) => {
    //     console.log(message);
    // }

    useEffect(() => {
        async function connect() {
            const newSocket = zmq.socket("sub");
            newSocket.connect("tcp://127.0.0.1:5556");
            newSocket.subscribe("");
            newSocket.on("message", function(topic, message) {
                console.log(Buffer.from(topic).toString());
            }
            );
        }  
        connect();
    }, []);


    return (
        <h1>asdasdas</h1>
    );
};
const root = createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);