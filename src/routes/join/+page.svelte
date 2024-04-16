<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  let name = "";

  onMount(() => {
    name = localStorage.getItem("name") || "";
  });

  const joinChat = (e: SubmitEvent) => {
    e.preventDefault();

    localStorage.setItem("name", name);

    goto("/chat");
  };
</script>

<main class="h-screen flex justify-center items-center">
  <form class="max-w-xl w-full flex flex-col gap-4" on:submit={joinChat}>
    <h1 class="text-lg font-bold">Join the chat</h1>
    <input
      bind:value={name}
      placeholder="Enter a name"
      type="text"
      class="bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 p-3"
    />
    <button class="bg-green-100 hover:bg-green-200 p-3">Join</button>
  </form>
</main>
