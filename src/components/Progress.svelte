<script lang="ts">
  import Gauge from "$lib/Gauge.svelte";
  let value = 0;
  setInterval(() => {
    value = Math.min(100, Math.round((Date.now() % 12000) / 100));
  });
</script>

<div>
  <Gauge
    class="progress"
    stroke={10}
    displayValue={(v) => v.formattedValue + "%"}
    titles={["", "we're doing something important"]}
    {value}
  />

  <Gauge
    class="progress"
    stroke={10}
    displayValue={(v) => v.formattedValue + "%"}
    titles={["∗", "who knows, maybe it will take forever"]}
    {value}
  />
</div>

<style lang="scss">
  :global(.progress) {
    width: 125px;
    --stroke-color: #d43008;

    :global(.gauge-slot-content) {
      color: #d43008;
    }
    :global(.gauge-indicator) {
      display: none;
    }
  }
</style>
