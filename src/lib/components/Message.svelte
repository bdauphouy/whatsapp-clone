<script lang="ts">
  import { format } from "date-fns";

  export let content = "";
  export let author = "John Doe";
  export let date = new Date();
  export let isComing = false;

  $: formattedDate = format(date, "hh:mm a");
</script>

<li class="flex flex-col gap-1" class:self-end={!isComing}>
  <span class="text-xs">{isComing ? author : "You"}</span>
  <span
    class="max-w-lg p-2"
    class:bg-orange-200={isComing}
    class:bg-gray-200={!isComing}>{content}</span
  >
  <span class="text-xs self-end">{formattedDate}</span>
</li>
