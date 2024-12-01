# Svelte Gauge

[![npm](https://img.shields.io/npm/v/svelte-gauge.svg)](https://www.npmjs.com/package/svelte-gauge)
[![License](https://img.shields.io/npm/l/svelte-gauge.svg)](LICENSE)

A customizable and animated gauge component built with Svelte, perfect for visualizing progress, performance metrics, or other numerical data.

## Installation

Install the package via npm:

```bash
npm install svelte-gauge
```

## Usage

Import the component and use it in your Svelte application:

```Svelte
<script>
  import Gauge from "svelte-gauge";
</script>

<Gauge
  value={value}
  start={0}
  stop={100}
  stroke={20}
  titles={["One", "Two", "Three"]}
  ranges={[
    [0, 33],
    [34, 66],
    [67, 100],
  ]}
  width="300px"
  className="custom-gauge"
/>

```
