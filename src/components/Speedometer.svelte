<script lang="ts">
  import Gauge from "$lib/Gauge.svelte";
  import { cubicIn, cubicOut } from "svelte/easing";
  const palette = ["#ffffff", "#d43008", "#666666"];

  let speed = 0;
  let rpm = 0;

  setInterval(() => {
    const time = (Date.now() % 6000) / 5000;
    speed = cubicIn(time) * 100;
    rpm = cubicOut(time) * 8000;
  });
</script>

<Gauge
  width={250}
  stop={200}
  titles={Array.from(Array(11), (_, i) => (i * 20).toString())}
  startAngle={45}
  stopAngle={360 - 45}
  stroke={10}
  value={speed}
  color={palette[1]}
>
  <Gauge
    titles={Array.from(Array(11), (_, i) => (i * 1).toString())}
    stop={10000}
    startAngle={45}
    stopAngle={360 - 45}
    stroke={10}
    ranges={[[8000, 10000]]}
    displayValue={Math.round(speed).toString()}
    value={rpm}
    color={palette[2]}
  ></Gauge>
</Gauge>
