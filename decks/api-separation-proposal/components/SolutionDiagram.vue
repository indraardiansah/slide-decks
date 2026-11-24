<script setup lang="ts">
/**
 * The proposed setup at a glance: each client group gets its own servers,
 * both still use the same database. Static, with gently moving traffic dots.
 */
</script>

<template>
  <svg viewBox="0 0 860 200" class="solution">
    <!-- clients -->
    <rect x="0" y="22" width="190" height="52" rx="26" class="pill web" />
    <text x="95" y="53" class="pill-t" text-anchor="middle">Customer websites</text>

    <rect x="0" y="126" width="190" height="52" rx="26" class="pill pos" />
    <text x="95" y="149" class="pill-t" text-anchor="middle">POS · Driver App</text>
    <text x="95" y="166" class="pill-t" text-anchor="middle">Customer Portal</text>

    <!-- traffic -->
    <path d="M196,48 L318,48" class="flow web-flow" />
    <path d="M196,152 L318,152" class="flow pos-flow" />

    <!-- Website API -->
    <rect x="324" y="6" width="236" height="84" rx="12" class="box web-box" />
    <rect x="340" y="20" width="44" height="18" rx="4" class="tag-bg new" />
    <text x="362" y="33" class="tag-t new" text-anchor="middle">NEW</text>
    <text x="392" y="34" class="box-t">Website API</text>
    <text x="340" y="58" class="box-s">Its own servers, adds more</text>
    <text x="340" y="74" class="box-s">automatically when traffic grows</text>

    <!-- Platform API -->
    <rect x="324" y="110" width="236" height="84" rx="12" class="box pos-box" />
    <rect x="340" y="124" width="74" height="18" rx="4" class="tag-bg same" />
    <text x="377" y="137" class="tag-t same" text-anchor="middle">EXISTING</text>
    <text x="422" y="138" class="box-t">Platform API</text>
    <text x="340" y="162" class="box-s">Reserved for POS and apps.</text>
    <text x="340" y="178" class="box-s">Same address, no change for users</text>

    <!-- to database -->
    <path d="M560,48 C610,48 610,100 664,100" class="db-link" />
    <path d="M560,152 C610,152 610,100 664,100" class="db-link" />

    <!-- database -->
    <rect x="668" y="44" width="192" height="112" rx="12" class="box db-box" />
    <text x="684" y="74" class="box-t">Shared database</text>
    <text x="684" y="98" class="box-s">Unchanged. Each side gets</text>
    <text x="684" y="114" class="box-s">its own share of connections,</text>
    <text x="684" y="130" class="box-s">so POS keeps reserved room</text>
  </svg>
</template>

<style scoped>
.solution { width: 100%; height: auto; display: block; }
.pill.web { fill: var(--aio-purple-tint); }
.pill.pos { fill: var(--aio-blue-tint); }
.pill-t { font-size: 14px; font-weight: 700; fill: var(--aio-ink); }

.box { stroke-width: 1.5; }
.web-box { fill: #fff; stroke: var(--aio-purple); }
.pos-box { fill: #fff; stroke: var(--aio-blue); }
.db-box { fill: var(--aio-amber-tint); stroke: var(--aio-amber); }
.box-t { font-size: 16px; font-weight: 800; fill: var(--aio-ink); }
.box-s { font-size: 12px; fill: var(--aio-muted); }

.tag-bg.new { fill: var(--aio-purple); }
.tag-bg.same { fill: var(--aio-blue-tint); }
.tag-t { font-size: 10px; font-weight: 800; letter-spacing: 0.06em; }
.tag-t.new { fill: #fff; }
.tag-t.same { fill: var(--aio-blue); }

.flow {
  fill: none;
  stroke-width: 6;
  stroke-linecap: round;
  stroke-dasharray: 0.1 12;
  animation: flow 1s linear infinite;
}
.web-flow { stroke: var(--aio-purple); }
.pos-flow { stroke: var(--aio-blue); }
.db-link { fill: none; stroke: var(--aio-amber); stroke-width: 4; opacity: 0.8; }
@keyframes flow { to { stroke-dashoffset: -12.1; } }
</style>
