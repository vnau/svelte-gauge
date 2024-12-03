<script lang="ts">
  import { onMount } from "svelte";
  import { tweened } from "svelte/motion";
  import { elasticOut } from "svelte/easing";
  import {
    calcCurvePath,
    getTitleAngle,
    polarToCartesian,
    valueToAngle,
  } from "./util.js";

  export let easing: (v: number) => number = elasticOut;
  export let value: number | undefined;
  export let width: number | string | undefined = undefined;
  export let start: number = 0;
  export let stop: number = 100;
  export let startAngle: number = 0;
  export let stopAngle: number = 2 * Math.PI;
  export let titleAngle: number = 0;
  let className: string | undefined = undefined;
  export let stroke: number = 20;
  export let titles: string[] = [];
  export let ranges: [number, number][] = [];
  export { className as class };
  let clientWidth: number;
  let clientHeight: number;
  let visible = false;

  // Check if any title is present
  const border = titles.some(Boolean) ? 16 : 0;
  const uuid = Math.random().toString(36).slice(-6);

  // Animated value with easing
  const animatedValue = tweened(start, { duration: 1000, easing: easing });
  $: animatedValue.set(value ?? 0);

  // Set visibility on mount for animations
  onMount(() => (visible = true));

  // Transition effect for spinning animation
  function spin(node: SVGGElement) {
    return {
      duration: 1000 + Math.random() * 300,
      css: (t: number) => {
        const eased = easing(t);
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
      valueToAngle($animatedValue, start, stop, startAngle, stopAngle)
    )}

    <svg class="gauge-svg" xmlns="http://www.w3.org/2000/svg">
      <!-- Background Circle -->
      <path
        class="gauge-circle"
        d={calcCurvePath(radius, borderAdjusted, startAngle, stopAngle)}
      />

      <!-- Value Background -->
      {#if value != undefined || $animatedValue != 0}
        <path
          class="gauge-range-bg"
          d={calcCurvePath(
            radius,
            borderAdjusted,
            startAngle,
            valueToAngle($animatedValue, start, stop, startAngle, stopAngle)
          )}
        />
      {/if}
      {#each ranges as range, index}
        {#each ["gauge-range-bg", "gauge-range"] as cls, index}
          <path
            id={`${cls}${index}`}
            class={cls}
            d={calcCurvePath(
              radius,
              borderAdjusted,
              valueToAngle(range[0], start, stop, startAngle, stopAngle),
              valueToAngle(range[1], start, stop, startAngle, stopAngle)
            )}
          />
        {/each}
      {/each}

      <!-- Handle -->
      {#if value != undefined || $animatedValue != 0}
        <circle
          class="gauge-handle"
          cx={handlePos.x}
          cy={handlePos.y}
          r={stroke / 2}
        />
      {/if}

      <!-- Titles -->
      {#if visible}
        <g in:spin class="titles-container">
          {#each titles as title, index}
            <path
              class="gauge-title-curve"
              id={`title-${uuid}-${index}`}
              d={calcCurvePath(
                radius,
                border - 2,
                titleAngle +
                  getTitleAngle(startAngle, stopAngle, index, titles.length) -
                  Math.PI / 2,
                titleAngle +
                  getTitleAngle(startAngle, stopAngle, index, titles.length) +
                  Math.PI / 2
              )}
            />
            <text>
              <textPath
                xlink:href={`#title-${uuid}-${index}`}
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
      <slot
        value={$animatedValue === 0 && value === undefined
          ? undefined
          : $animatedValue}
      >
        <span class="slot-content"
          >{$animatedValue === 0 && value === undefined
            ? "NaN"
            : Math.round($animatedValue)}</span
        >
      </slot>
    </div>
  {/if}
</div>

<style lang="scss">
  @use "./Gauge.scss";
</style>
