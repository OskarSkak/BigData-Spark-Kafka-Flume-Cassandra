import React from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";



class WebsocketManager extends React.Component {

    constructor() {
        super(props)
    }

    componentDidMount() {
        const connection = new HubConnectionBuilder()
            .withUrl("url")
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