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
    labels={["∗", "we're doing something important", ""]}
    color="#d43008"
    {value}
  />

  <Gauge
    class="progress"
    stroke={10}
    displayValue={(v) => v.formattedValue + "%"}
    labels={["∗", "who knows, maybe it will take forever", ""]}
    color="#d43008"
    {value}
  />
</div>

<style lang="scss">
  :global(.progress) {
    width: 125px;

    :global(.gauge-slot-content) {
      color: var(--stroke-color);
    }
    :global(.gauge-indicator) {
      display: none;
    }
  }
</style>
