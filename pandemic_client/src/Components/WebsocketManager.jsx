import React from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";

class WebsocketManager extends React.Component {

    componentDidMount() {
        const connection = new HubConnectionBuilder()
            .withUrl("https://localhost:5001/api/hub")
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
            try { 
                let res = JSON.parse(response.value);
                if(this.props.subscribeWebsocket)this.props.subscribeWebsocket(res);
            } catch(err) {
                console.log(err)
            }
        })
    }

    render = () => {
        return <div></div>
    }
}

export default WebsocketManager;