<script>
  import Gauge from "$lib/Gauge.svelte";
</script>

<h1>svelte.gauge</h1>
<p>Gauge component for Svelte</p>

<Gauge
  width={300}
  value={34}
  ranges={[[45, 55]]}
  titles={["Title 1", "Title 2", "Title 3"]}
  --stroke-color="#f2c894"
></Gauge>
