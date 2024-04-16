<script lang="ts">
  import { goto } from "$app/navigation";
  import Message from "$lib/components/Message.svelte";
  import { onMount, tick } from "svelte";
  import {
    PUBLIC_WEBSOCKET_HOST,
    PUBLIC_WEBSOCKET_PORT,
  } from "$env/static/public";

  type Message = {
    author: string;
    date: Date;
    content: string;
    isComing: boolean;
  };

  let name = "";
  let messages: Message[] = [];
  let logs: string[] = [];
  let message = "";
  let socket: WebSocket;

  onMount(async () => {
    name = localStorage.getItem("name") || "Anonymous";
    messages = JSON.parse(localStorage.getItem("messages") || "[]");

    await tick();

    window.scrollTo(0, document.body.scrollHeight);

    socket = new WebSocket(
      `${location.protocol === "https:" ? "wss" : "ws"}://${PUBLIC_WEBSOCKET_HOST}:${PUBLIC_WEBSOCKET_PORT}`
    );

    socket.addEventListener("open", () => {
      console.log("Connected to server");

      socket.send(JSON.stringify({ type: "join", content: name }));
    });

    socket.addEventListener("message", async (event) => {
      const { type, content } = JSON.parse(event.data);

      switch (type) {
        case "message":
          const { author, text, isComing } = JSON.parse(content);

          messages = [
            ...messages,
            {
              author,
              date: new Date(),
              content: text,
              isComing,
            },
          ];

          localStorage.setItem("messages", JSON.stringify(messages));

          await tick();

          window.scrollTo(0, document.body.scrollHeight);

          break;
        case "join":
          logs = [...logs.slice(-4), `${content} has joined the room`];

          break;
        case "leave":
          logs = [...logs.slice(-4), `${content} has left the room`];

          break;
      }
    });
  });

  const sendMessage = (e: SubmitEvent) => {
    e.preventDefault();

    socket.send(JSON.stringify({ type: "message", content: message }));

    message = "";
  };

  const leaveChat = () => {
    socket.close();

    goto("/join");
  };
</script>

<main class="h-screen flex flex-col items-center">
  <button
    class="fixed right-0 top-0 m-10 bg-red-100 p-3 hover:bg-red-200"
    on:click={leaveChat}>Leave the chat</button
  >

  <ul
    class="flex h-auto pt-10 flex-col gap-4 pb-40 items-start justify-end w-full max-w-3xl"
  >
    {#each messages as message}
      <Message
        author={message.author}
        content={message.content}
        date={message.date}
        isComing={message.isComing}
      />
    {/each}
  </ul>

  <ul class="fixed left-0 bottom-0 m-10 flex flex-col gap-3">
    {#each logs as log}
      <li>{log}</li>
    {/each}
  </ul>

  <form
    class="fixed bottom-0 pt-3 pb-10 max-w-3xl w-full flex gap-3 bg-white"
    on:submit={sendMessage}
  >
    <input
      bind:value={message}
      placeholder="Enter a message"
      type="text"
      class="w-full bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 p-3"
    />
    <button class="bg-green-100 hover:bg-green-200 p-3">Send</button>
  </form>
</main>
