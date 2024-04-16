import { WebSocketServer } from "ws";

const server = new WebSocketServer({
  port: process.env.PUBLIC_WEBSOCKET_PORT || 8080,
});

const clients = [];

server.on("connection", (socket) => {
  socket.on("message", (message) => {
    const { type, content } = JSON.parse(message);

    switch (type) {
      case "join":
        clients.push({
          name: content,
          socket,
        });

        for (const client of server.clients) {
          if (client !== socket) {
            client.send(JSON.stringify({ type: "join", content }));
          }
        }

        break;
      case "message":
        const name = clients.find((client) => client.socket === socket).name;

        for (const client of server.clients) {
          client.send(
            JSON.stringify({
              type: "message",
              content: JSON.stringify({
                author: name,
                text: content,
                isComing: client !== socket,
              }),
            })
          );
        }

        break;
      default:
        console.log("unknown message type", type);
    }
  });

  socket.on("close", () => {
    const name = clients.find((client) => client.socket === socket).name;

    for (const client of server.clients) {
      client.send(JSON.stringify({ type: "leave", content: name }));
    }
  });
});
