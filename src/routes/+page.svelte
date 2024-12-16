<script lang="ts">
  import Clock from "../components/Clock.svelte";
  import Indicator from "../components/Indicator.svelte";
  import Neon from "../components/Neon.svelte";
  import Progress from "../components/Progress.svelte";
  import Speedometer from "../components/Speedometer.svelte";
</script>

<div>
  <h1>svelte.gauge</h1>
  <div class="demo-container">
    <Neon />
    <Progress />
    <Indicator />
    <Speedometer />
    <Clock />
  </div>
</div>

<style lang="scss">
  .demo-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    font-family: "Calibri", sans-serif;
    font-weight: 100;
    color: white;
    fill: white;
  }

  h1 {
    text-align: center;
    font-weight: 100;
    font-style: normal;
    font-size: 4em;
  }
</style>
