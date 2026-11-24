<script setup lang="ts">
/**
 * Decorative brand shapes from the Canva deck: the purple swoosh,
 * the amber ring and the blue dot.
 *
 * Variants:
 *  - cover   : title slide (swoosh top-right, amber arc + blue dot bottom-right)
 *  - section : section divider (amber ring top-left, swoosh top-right, dot bottom-left)
 *  - end     : closing slide (swoosh top-right, large amber ring left, dot bottom-centre)
 *  - corner  : a small, quiet version for content slides (bottom-right)
 *  - header  : the cover's swoosh and dot, scaled down into the top-right corner
 *  - mirror  : the section layout flipped, for variety between dividers
 */
withDefaults(defineProps<{
  variant?: 'cover' | 'section' | 'end' | 'corner' | 'mirror' | 'header'
}>(), {
  variant: 'section',
})
</script>

<template>
  <svg
    class="aio-shapes"
    viewBox="0 0 1920 1080"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <!-- COVER -->
      <template v-if="variant === 'cover'">
        <path
          d="M1600,-60 C1575,110 1500,320 1560,385 C1615,445 1690,385 1770,315 L2010,110"
          stroke="var(--aio-purple)" stroke-width="104"
        />
        <path
          d="M1672,712 C1725,640 1815,612 1990,618"
          stroke="var(--aio-amber)" stroke-width="100"
        />
        <circle cx="1492" cy="889" r="90" fill="var(--aio-blue)" />
      </template>

      <!-- SECTION -->
      <template v-else-if="variant === 'section'">
        <circle cx="-20" cy="110" r="180" stroke="var(--aio-amber)" stroke-width="96" />
        <path
          d="M1600,-60 C1585,90 1535,240 1600,285 C1655,325 1760,245 2010,40"
          stroke="var(--aio-purple)" stroke-width="104"
        />
        <circle cx="40" cy="1028" r="88" fill="var(--aio-blue)" />
      </template>

      <!-- MIRROR (section, flipped) -->
      <template v-else-if="variant === 'mirror'">
        <g transform="translate(1920 0) scale(-1 1)">
          <circle cx="-20" cy="110" r="180" stroke="var(--aio-amber)" stroke-width="96" />
          <path
            d="M1600,-60 C1585,90 1535,240 1600,285 C1655,325 1760,245 2010,40"
            stroke="var(--aio-purple)" stroke-width="104"
          />
          <circle cx="40" cy="1028" r="88" fill="var(--aio-blue)" />
        </g>
      </template>

      <!-- END -->
      <template v-else-if="variant === 'end'">
        <path
          d="M1535,-60 C1515,80 1465,235 1530,282 C1590,325 1705,235 2010,0"
          stroke="var(--aio-purple)" stroke-width="104"
        />
        <circle cx="-20" cy="480" r="150" stroke="var(--aio-amber)" stroke-width="92" />
        <circle cx="934" cy="1085" r="92" fill="var(--aio-blue)" />
      </template>

      <!-- HEADER (cover motif, scaled down into the top-right corner of content slides) -->
      <template v-else-if="variant === 'header'">
        <path
          d="M1812,-40 C1800,30 1772,110 1800,140 C1826,166 1862,140 1902,108 L2010,20"
          stroke="var(--aio-purple)" stroke-width="46"
        />
        <circle cx="1716" cy="74" r="17" fill="var(--aio-blue)" />
        <path
          d="M1700,186 C1716,164 1744,156 1772,158"
          stroke="var(--aio-amber)" stroke-width="20"
        />
      </template>

      <!-- CORNER (subtle, bottom-right; clear of the presenter tag and footer) -->
      <template v-else-if="variant === 'corner'">
        <g transform="translate(0 940) scale(1 -1)">
          <path
            d="M1790,-40 C1782,40 1760,110 1795,135 C1825,155 1870,120 1990,30"
            stroke="var(--aio-purple)" stroke-width="44"
          />
        </g>
        <circle cx="1700" cy="930" r="20" fill="var(--aio-amber)" />
        <circle cx="1640" cy="985" r="12" fill="var(--aio-blue)" />
      </template>
    </g>
  </svg>
</template>

<style scoped>
.aio-shapes {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
</style>
