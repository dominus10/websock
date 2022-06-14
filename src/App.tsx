import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';

const socket = io("http://localhost:8000");

function App() {
  const [username, setUsername] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [showChat, setShowChat] = useState<boolean>(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState<any>([]);

  const joinChannel = ()=>{
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  }

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          ((new Date(Date.now()).getMinutes() < 10)? '0'+ new Date(Date.now()).getMinutes(): new Date(Date.now()).getMinutes()),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list: any) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list: any) => [...list, data]);
    });
  }, []);

  return (
    <div>
      {
        !showChat ? (
          <div className='landing'>
            <h5>Join Channel</h5>
            <input
            type="text"
            placeholder="Choose ID"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Choose Channel"
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinChannel}>Join Channel</button>
          </div>
        ) : (
          <div>
            <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <div className="message-container">
          {messageList.map((messageContent: { author: string; message: string; time: string; },index:number) => {
            return (
              <div
                key={index}
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div className='message-data' style={{justifyContent: username === messageContent.author? 'flex-end': 'flex-start'}}>
                  <div className="message-meta">
                    <span id="author">{username === messageContent.author? 'You' : messageContent.author}</span>
                    <span id="time" style={{marginLeft:10}}>{messageContent.time}</span>
                  </div>
                  <div className="message-content">
                    <span>{messageContent.message}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Type here.."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
          </div>
        )
      }
    </div>
  );
}

export default App;
