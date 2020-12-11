import React from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";

class WebsocketManager extends React.Component {

    componentDidMount() {
        const connection = new HubConnectionBuilder()
            .withUrl("http://localhost:5000/api/hub")
            .build();

        connection
          .start()
          .then(() => {
              console.log("Websocket connected")
          })
          .catch(err => {
              console.log("Error connecting to websocket")
          })

        connection.onclose(async () => {
            console.log("Websocket closed")
        })

        connection.on("twitterraw", (response, a) => {
            console.log(response);
        })
    }

    render = () => {
        return <div></div>
    }
}

export default WebsocketManager;