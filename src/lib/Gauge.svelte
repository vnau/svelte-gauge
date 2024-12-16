<script lang="ts">
  import { onMount } from "svelte";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import {
    calcCurvePath,
    getTitleOffset,
    polarToCartesian,
    scale,
    type DisplayValueHandler,
  } from "./util.js";

  export let easing: (v: number) => number = cubicOut;
  export let value: number | undefined;
  export let displayValue: string | DisplayValueHandler = (v) =>
    v.formattedValue;
  export let width: number | string | undefined = undefined;
  export let start: number = 0;
  export let stop: number = 100;
  export let startAngle: number = 0;
  export let stopAngle: number = 360;
  export let titleAngle: number = 0;
  export let stroke: number = 20;
  export let titles: string[] = [];
  export let ranges: [number, number][] = [];
  let className: string | undefined = undefined;
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
      (scale($animatedValue, start, stop, startAngle, stopAngle) * Math.PI) /
        180
    )}

    <svg class="gauge-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {#each ranges as range, index}
          <path
            id={`range-${index}-${uuid}`}
            d={calcCurvePath(
              radius,
              borderAdjusted,
              scale(range[0], start, stop, startAngle, stopAngle),
              scale(range[1], start, stop, startAngle, stopAngle)
            )}
          />
        {/each}
        <path
          id="title-path-{uuid}"
          d={calcCurvePath(
            radius,
            border - 2,
            titleAngle + startAngle - (stopAngle - startAngle) / 2.001,
            titleAngle + stopAngle + (stopAngle - startAngle) / 2.001
          )}
        />
      </defs>

      <!-- Titles -->
      {#if visible}
        <text class="titles-container">
          {#each titles as title, index}
            <textPath
              xlink:href="#title-path-{uuid}"
              startOffset="{getTitleOffset(
                startAngle,
                stopAngle,
                index,
                titles.length
              )}%"
              text-anchor="middle"
            >
              {title}
            </textPath>
          {/each}
        </text>
        {#if !$$slots.default}
          <text
            class="slot-content"
            x="50%"
            y="50%"
            dominant-baseline="middle"
            text-anchor="middle"
            >{typeof displayValue === "string"
              ? displayValue
              : displayValue({
                  value: value,
                  animatedValue: $animatedValue,
                  formattedValue:
                    $animatedValue === 0 && value === undefined
                      ? "NaN"
                      : Math.round($animatedValue).toString(),
                })}</text
          >
        {/if}
      {/if}

      <!-- Background Circle -->
      <path
        class="gauge-circle"
        d={calcCurvePath(radius, borderAdjusted, startAngle, stopAngle)}
        stroke-linecap="round"
      />

      <!-- Value Background -->
      {#if value != undefined || $animatedValue != 0}
        <path
          class="gauge-range-bg"
          stroke-linecap="round"
          d={calcCurvePath(
            radius,
            borderAdjusted,
            startAngle,
            scale($animatedValue, start, stop, startAngle, stopAngle)
          )}
        />
      {/if}
      {#each ranges as range, index}
        <use href="#range-{index}-{uuid}" class="gauge-range-bg"></use>
        <use href="#range-{index}-{uuid}" class="gauge-range"></use>
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
    </svg>
    {#if !!$$slots.default}
      <div class="slot-container">
        <slot
          value={$animatedValue === 0 && value === undefined
            ? undefined
            : $animatedValue}
        />
      </div>
    {/if}
  {/if}
</div>

<style lang="scss">
  @use "./Gauge.scss";
</style>
