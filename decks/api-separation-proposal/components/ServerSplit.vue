<script setup lang="ts">
/**
 * Server diagram: each square is one server, its area matches its computing
 * power (vCPU). Solid squares run all the time; dashed squares are added
 * automatically when traffic grows.
 *
 * Specs from website-infrastructure/api-instance-separation-proposal.md
 * (Instance specification) and the plan's cost section.
 */
const UNIT = 3.2 // rem, side of a 32 vCPU server square (a supporting visual; the specs lead)
const side = (vcpu: number) => `${(UNIT * Math.sqrt(vcpu / 32)).toFixed(2)}rem`

const today = { vcpu: 32, solid: 2, extra: 0, count: '2', type: 'c6a.8xlarge', cpu: '32 vCPU', mem: '64 GB memory' }
const after = [
  {
    key: 'web',
    name: 'Website API',
    who: 'All customer websites',
    vcpu: 16,
    solid: 2,
    extra: 2,
    count: '2 → 4',
    type: 'c6a.4xlarge',
    cpu: '16 vCPU',
    mem: '32 GB memory',
    traffic: '~95%',
  },
  {
    key: 'pos',
    name: 'Platform API',
    who: 'POS, Driver App and Customer Portal',
    vcpu: 4,
    solid: 2,
    extra: 1,
    count: '2 → 3',
    type: 'c6a.xlarge',
    cpu: '4 vCPU',
    mem: '8 GB memory',
    traffic: '~5%',
  },
]
</script>

<template>
  <div class="split">
    <!-- TODAY -->
    <section class="side today">
      <h3>Today</h3>
      <div class="group">
        <div class="name-row">
          <span class="name">One shared API</span>
          <span class="traffic">100% of traffic</span>
        </div>
        <div class="who">Websites, POS, Driver App and Customer Portal</div>
        <div class="row">
          <div class="spec-block">
            <div class="spec-hero">{{ today.count }} × {{ today.type }}</div>
            <div class="chips">
              <span class="chip">{{ today.cpu }}</span>
              <span class="chip">{{ today.mem }}</span>
              <span class="chip plain">each, fixed</span>
            </div>
          </div>
        </div>
        <div class="servers today-servers">
          <span v-for="n in today.solid" :key="n" class="sq ink" :style="{ width: side(today.vcpu), height: side(today.vcpu) }" />
        </div>
      </div>
    </section>

    <div class="divider" aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="M5,12 H18 M12,6 L18,12 L12,18" /></svg>
    </div>

    <!-- AFTER -->
    <section class="side after">
      <h3>After the change</h3>
      <div v-for="(g, gi) in after" :key="g.key" class="group" :class="g.key">
        <div class="name-row">
          <span class="name">{{ g.name }}</span>
          <span class="who-inline">{{ g.who }}</span>
          <span class="traffic">{{ g.traffic }} of traffic</span>
        </div>
        <div class="row">
          <div class="spec-block">
            <div class="spec-hero">{{ g.count }} × {{ g.type }}</div>
            <div class="chips">
              <span class="chip">{{ g.cpu }}</span>
              <span class="chip">{{ g.mem }}</span>
              <span class="chip plain">each, grows automatically</span>
            </div>
          </div>
          <div class="servers">
            <span
              v-for="n in g.solid + g.extra"
              :key="n"
              class="sq"
              :class="[g.key, { extra: n > g.solid }]"
              :style="{ width: side(g.vcpu), height: side(g.vcpu), animationDelay: `${0.2 + gi * 0.25 + n * 0.06}s` }"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- COSTS on one baseline, under the side they belong to -->
    <div class="cost today-cost">
      <span class="amount">≈ $2,880</span><span class="per">per month</span>
    </div>
    <div class="cost after-cost">
      <span class="amount">≈ $2,050</span><span class="per">per month for both</span>
      <span class="saving">$830 less per month (−29%)</span>
    </div>

    <div class="legend">
      <span><i class="sq-key" /> Each square is one server, sized by its computing power</span>
      <span><i class="sq-key extra" /> Added automatically when traffic grows</span>
    </div>
  </div>
</template>

<style scoped>
.split {
  display: grid;
  grid-template-columns: 0.85fr 2.4rem 1.5fr;
  grid-template-areas:
    "today div after"
    "tcost .   acost"
    "legend legend legend";
  column-gap: 0.4rem;
  font-size: 0.8rem;
}
.today { grid-area: today; }
.divider { grid-area: div; }
.after { grid-area: after; }
.today-cost { grid-area: tcost; }
.after-cost { grid-area: acost; }
.legend { grid-area: legend; }

h3 { font-size: 0.78rem; font-weight: 800; color: var(--aio-muted); margin: 0 0 0.6rem; }
.after h3 { color: var(--aio-purple); }

.group + .group { margin-top: 0.85rem; }
.name-row { display: flex; align-items: baseline; gap: 0.55rem; flex-wrap: wrap; }
.name { font-size: 1.05rem; font-weight: 800; }
.who, .who-inline { font-size: 0.72rem; color: var(--aio-muted); }
.traffic { margin-left: auto; font-size: 0.78rem; font-weight: 800; }
.web .traffic { color: var(--aio-purple); }
.pos .traffic { color: var(--aio-blue); }

.servers { display: flex; align-items: flex-end; gap: 0.45rem; margin: 0.55rem 0 0.5rem; min-height: 0; }
.row { display: flex; align-items: flex-end; gap: 1.2rem; }
/* the spec leads; the squares sit at the end of the row as a supporting visual */
.row .servers { margin: 0 0 0 auto; flex: none; justify-content: flex-end; }
.today-servers { margin-top: 0.7rem; }
.spec-block { min-width: 0; }
.spec-hero {
  margin-top: 0.45rem;
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  line-height: 1.15;
  color: var(--aio-ink);
}
.web .spec-hero { color: var(--aio-purple); }
.pos .spec-hero { color: var(--aio-blue); }
.chips { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.4rem; }
.chip {
  font-size: 0.74rem;
  font-weight: 800;
  padding: 0.15rem 0.55rem;
  border-radius: 6px;
  background: #ececec;
  color: var(--aio-ink);
}
.web .chip { background: var(--aio-purple-tint); color: var(--aio-purple); }
.pos .chip { background: var(--aio-blue-tint); color: var(--aio-blue); }
.chip.plain, .web .chip.plain, .pos .chip.plain {
  background: none;
  padding-left: 0.1rem;
  font-weight: 500;
  color: var(--aio-muted);
}

/* the server squares */
.sq { display: block; border-radius: 6px; flex: none; }
.sq.ink { background: var(--aio-ink); border-radius: 8px; }
.sq.web { background: var(--aio-purple); animation: grow 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; transform-origin: bottom left; }
.sq.pos { background: var(--aio-blue); border-radius: 4px; animation: grow 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; transform-origin: bottom left; }
.sq.extra { background: transparent; border: 2px dashed currentColor; }
.sq.web.extra { color: var(--aio-purple); }
.sq.pos.extra { color: var(--aio-blue); }

.divider {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.divider::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  background: var(--aio-line);
}
.divider svg { position: relative; width: 1.5rem; height: 1.5rem; background: #fff; padding: 0.15rem 0; }
.divider path { fill: none; stroke: var(--aio-purple); stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }

/* costs: plain numbers on one baseline, separated from the specs by a rule */
.cost {
  display: flex;
  align-items: baseline;
  gap: 0.45rem;
  flex-wrap: wrap;
  margin-top: 0.75rem;
  padding-top: 0.55rem;
  border-top: 1px solid var(--aio-line);
}
.amount { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.01em; }
.per { font-size: 0.75rem; color: var(--aio-muted); }
.after-cost .amount { color: #1f7a4a; }
.saving {
  margin-left: auto;
  font-size: 0.78rem;
  font-weight: 800;
  color: var(--aio-ink);
  background: var(--aio-amber-tint);
  border-radius: 999px;
  padding: 0.2rem 0.7rem;
}

.legend {
  display: flex;
  gap: 1.6rem;
  margin-top: 0.55rem;
  font-size: 0.66rem;
  color: var(--aio-muted);
}
.legend span { display: inline-flex; align-items: center; gap: 0.4rem; }
.sq-key { display: inline-block; width: 0.7rem; height: 0.7rem; border-radius: 3px; background: var(--aio-muted); }
.sq-key.extra { background: transparent; border: 1.5px dashed var(--aio-muted); }

@keyframes grow {
  from { transform: scale(0.2); opacity: 0; }
  to { transform: none; opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .sq.web, .sq.pos { animation: none; }
}
</style>
