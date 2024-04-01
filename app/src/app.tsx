
import ReactDOM from 'react-dom';
// import { BoardComponent } from './components/BoardComponent';
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client'
import zmq from 'zeromq';

const App: React.FC = () => {
    //onst [game, setGame] = React.useState<>(new Game(11));
    const [socket, setSocket] = React.useState<zmq.Socket>(null);

    useEffect(() => {
        async function connect() {
            const openSocket = zmq.socket("pair");
            openSocket.connect("tcp://127.0.0.1:5555");
        
            openSocket.on("message", (message) => {
                const msg = message.toString();
                console.log("Received:", msg);
            });

            setSocket(openSocket);
        }
        
        connect();
    
        return () => {
            if (socket)
                socket.close();
        };
    }, []);


    return (
        <h1>Hello</h1>
        // <BoardComponent 
            
        //     width={window.innerWidth}
        //     height={window.innerHeight}
        // />
    );
};
const root = createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);
//ReactDOM.render(<App />, document.getElementById('root'));