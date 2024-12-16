<script lang="ts">
  import Gauge from "$lib/Gauge.svelte";

  let value: number | undefined = 25;
  setInterval(() => {
    value = Math.round(Math.random() * 100);
  }, 1000);

  const palette = ["#000000", "#d43008", "#aaaaaa"];
</script>

<div class="neon-container">
  <Gauge
    --stroke-color="greenyellow"
    titles={[" "]}
    stroke={10}
    class="gauge-dotted"
    width={150}
    displayValue={(v) => v.formattedValue + "dB"}
    {value}
    let:value
  ></Gauge>
  <Gauge
    --stroke-color="#5ad2f7"
    titles={[" "]}
    stroke={10}
    startAngle={270}
    stopAngle={90}
    class="gauge-dotted"
    width={125}
    {value}
    displayValue={(v) => v.formattedValue + "%"}
    let:value
  ></Gauge>
</div>

<style lang="scss">
  :global(.gauge-dotted) {
    color: var(--stroke-color);
    :global(.gauge-circle) {
      stroke: #777777;
      stroke-dasharray: 2, 4;
    }

    :global(.gauge-range-bg) {
      stroke-dasharray: 2, 4;
      stroke-linecap: butt;
    }

    :global(.slot-content),
    :global(.gauge-range-bg) {
      -webkit-filter: drop-shadow(0px 0px 3px var(--stroke-color));
      filter: drop-shadow(0px 0px 3px var(--stroke-color));
    }

    :global(.gauge-handle) {
      display: none;
    }

    :global(.gauge-circle) {
      stroke-linecap: butt;
    }
  }
</style>
