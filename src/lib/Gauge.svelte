<script lang="ts">
  import { onMount } from "svelte";
  import { tweened } from "svelte/motion";
  import { elasticOut } from "svelte/easing";
  import { calcCurvePath, polarToCartesian, valueToAngle } from "./util.js";

  export let value: number;
  export let width: number | string | undefined = undefined;
  export let start: number = 0;
  export let stop: number = 100;
  export let className: string = "";
  export let stroke: number = 20;
  export let titles: string[] = [];
  export let ranges: [number, number][] = [];

  let clientWidth: number;
  let clientHeight: number;
  let visible = false;

  // Check if any title is present
  const border = titles.some(Boolean) ? 16 : 0;

  // Animated value with easing
  const animatedValue = tweened(start, { duration: 1000, easing: elasticOut });
  $: animatedValue.set(value);

  // Set visibility on mount for animations
  onMount(() => (visible = true));

  // Transition effect for spinning animation
  function spin(node: SVGGElement) {
    return {
      duration: 1000 + Math.random() * 300,
      css: (t: number) => {
        const eased = elasticOut(t);
        return `transform: rotate(${eased * 360}deg); transform-origin: 50% 50%;`;
      },
    };
  }
</script>

<div
  class={`gauge-container ${className}`}
  bind:clientWidth
  bind:clientHeight
  style="
    {width ? `width: ${typeof width === 'string' ? width : width + 'px'};` : ''}
    --gauge-stroke: {stroke}px;
    --gauge-border: {border}px;
    --gauge-radius: {Math.min(clientWidth, clientHeight) / 2}px"
>
  {#if clientWidth > 0 && clientHeight > 0}
    {@const radius = Math.min(clientWidth, clientHeight) / 2}
    {@const borderAdjusted = border + stroke / 2}
    {@const handlePos = polarToCartesian(
      radius,
      borderAdjusted,
      valueToAngle($animatedValue, start, stop)
    )}

    <svg class="gauge-svg" xmlns="http://www.w3.org/2000/svg">
      <!-- Background Circle -->
      <circle
        class="gauge-circle"
        cx={radius}
        cy={radius}
        r={radius - stroke / 2 - border}
      />

      <!-- Value Background -->
      <path
        class="gauge-range-bg"
        d={calcCurvePath(
          radius,
          borderAdjusted,
          0,
          valueToAngle($animatedValue, start, stop)
        )}
      />

      {#each ranges as range, index}
        {#each ["gauge-range-bg", "gauge-range"] as cls, index}
          <path
            id={`${cls}${index}`}
            class={cls}
            d={calcCurvePath(
              radius,
              borderAdjusted,
              valueToAngle(range[0], start, stop),
              valueToAngle(range[1], start, stop)
            )}
          />
        {/each}
      {/each}

      <!-- Handle -->
      <circle
        class="gauge-handle"
        cx={handlePos.x}
        cy={handlePos.y}
        r={stroke / 2}
      />

      <!-- Titles -->
      {#if visible}
        <g in:spin class="titles-container">
          {#each titles as title, index}
            <path
              class="gauge-title-curve"
              id={`title${index}`}
              d={calcCurvePath(
                radius,
                border - 2,
                ((index + 1) / titles.length) * 2 * Math.PI,
                ((index + 2) / titles.length) * 2 * Math.PI
              )}
            />
            <text>
              <textPath
                xlink:href={`#title${index}`}
                startOffset="50%"
                text-anchor="middle"
              >
                {title}
              </textPath>
            </text>
          {/each}
        </g>
      {/if}
    </svg>

    <div class="slot-container">
      <slot />
    </div>
  {/if}
</div>

<style>
  @import "./Gauge.scss";
</style>
