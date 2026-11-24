<script setup lang="ts">
/**
 * Before / after comparison of the API separation, for executives.
 * Both sides receive the same traffic, so the only difference is the setup.
 *
 * Simple model, numbers from website-infrastructure/api-instance-separation-proposal.md:
 *  - Before: one shared set of servers, ~400 requests/s before it fails (April stress test).
 *  - After:  website servers ~250 requests/s each, 2 → 4 automatically (~1,000 target,
 *            confirmed by the load test). POS servers: 70 workers each at ~0.5 s per
 *            request ≈ 140 requests/s per server, 2 servers ≈ 280 (from the plan).
 *  - Both setups share one database. Its load grows with the requests the servers
 *    pass on. Above 100% it fails requests for everyone, websites and POS alike.
 *
 * Values animate with Motion (motion.dev) springs: on slide enter they grow from
 * zero, and switching scenarios tweens every bar, gauge and percentage.
 */
import { computed, onUnmounted, reactive, ref, watch } from 'vue'
import { animate } from 'motion'
import { onSlideEnter } from '@slidev/client'

type ScenarioKey = 'normal' | 'campaign' | 'flood'

const props = withDefaults(defineProps<{
  scenario?: ScenarioKey
  dbOverloaded?: boolean
}>(), {
  scenario: 'flood',
  dbOverloaded: false,
})

const SCENARIOS: Record<ScenarioKey, { label: string, web: number, pos: number }> = {
  normal: { label: 'Normal day', web: 285, pos: 15 },
  campaign: { label: 'Busy campaign day (2×)', web: 600, pos: 15 },
  flood: { label: '30 Sep traffic flood', web: 2912, pos: 15 },
}

const scenario = ref<ScenarioKey>(props.scenario)
const dbOverloaded = ref(props.dbOverloaded)
function pick(name: string) {
  scenario.value = name as ScenarioKey
}

const SHARED_CAPACITY = 400
const WEB_PER_SERVER = 250
const WEB_MAX_SERVERS = 4
const POS_CAPACITY = 280 // 2 servers × 70 workers ÷ ~0.5 s per request
const DB_BASE_NORMAL = 45 // % load from everything else on a normal day
const DB_BASE_OVERLOADED = 95 // e.g. heavy reports or jobs already running
const DB_PER_REQUEST = 0.025 // % load per request/s the servers pass on
// After the change POS has its own reserved database connections, so an
// overloaded database hurts it less, but it is still affected
const POS_RESERVED_SHIELD = 0.5

function failRate(demand: number, capacity: number) {
  return demand > capacity ? 1 - capacity / demand : 0
}

function database(served: number) {
  const load = (dbOverloaded.value ? DB_BASE_OVERLOADED : DB_BASE_NORMAL) + served * DB_PER_REQUEST
  // Above 100% the database starts failing requests for everyone
  const penalty = load > 100 ? Math.min(0.6, 0.1 + (load - 100) / 25) : 0
  return { load, penalty }
}
function withDb(fail: number, penalty: number) {
  return fail + (1 - fail) * penalty
}

const beforeTarget = computed(() => {
  const { web, pos } = SCENARIOS[scenario.value]
  const serverFail = failRate(web + pos, SHARED_CAPACITY)
  const db = database((web + pos) * (1 - serverFail))
  return {
    load: (web + pos) / SHARED_CAPACITY,
    demand: web + pos,
    cap: SHARED_CAPACITY,
    db: db.load,
    webFail: withDb(serverFail, db.penalty),
    posFail: withDb(serverFail, db.penalty),
  }
})

const afterTarget = computed(() => {
  const { web, pos } = SCENARIOS[scenario.value]
  const servers = Math.min(WEB_MAX_SERVERS, Math.max(2, Math.ceil(web / WEB_PER_SERVER)))
  const webCap = servers * WEB_PER_SERVER
  const webServerFail = failRate(web, webCap)
  const posServerFail = failRate(pos, POS_CAPACITY)
  const db = database(web * (1 - webServerFail) + pos * (1 - posServerFail))
  return {
    servers,
    webLoad: web / webCap,
    posLoad: pos / POS_CAPACITY,
    webDemand: web,
    webCap,
    posDemand: pos,
    posCap: POS_CAPACITY,
    db: db.load,
    webFail: withDb(webServerFail, db.penalty),
    posFail: withDb(posServerFail, db.penalty * POS_RESERVED_SHIELD),
  }
})

function status(fail: number, db: number) {
  if (fail >= 0.01) return { tone: 'bad', text: `Failing ${Math.round(fail * 100)}% of requests` }
  if (db >= 85) return { tone: 'warn', text: 'Slower than normal' }
  return { tone: 'good', text: 'Healthy' }
}
function dbStatus(load: number) {
  if (load > 100) return { tone: 'bad', text: 'Overloaded' }
  if (load >= 85) return { tone: 'warn', text: 'Busy' }
  return { tone: 'good', text: 'OK' }
}

function tone(load: number) {
  if (load > 1) return 'bad'
  if (load >= 0.8) return 'warn'
  return 'good'
}
// Server boxes show real traffic and what that setup can handle, never a
// percentage (a % reads like "servers 75% busy", which we did not measure)
const fmt = (n: number) => Math.round(n).toLocaleString('en-US')
function handles(cap: number) {
  return `handles up to ~${cap.toLocaleString('en-US')}`
}

// ---------- Animation (Motion springs) ----------
const webTraffic = computed(() => SCENARIOS[scenario.value].web)

// What the template renders: starts at the target, then tweens towards each new target
const before = reactive({ ...beforeTarget.value })
const after = reactive({ ...afterTarget.value })
const shown = reactive({ traffic: webTraffic.value })

// No bounce: numbers must never overshoot the real figure
const SPRING = { type: 'spring', bounce: 0, visualDuration: 0.8 } as const
let running: { stop: () => void }[] = []
const INSTANT = ['servers', 'cap', 'webCap', 'posCap']

function tween(state: Record<string, number>, target: Record<string, number>) {
  for (const key of Object.keys(target)) {
    if (INSTANT.includes(key)) {
      state[key] = target[key] // server counts and limits switch, they don't tween
      continue
    }
    running.push(animate(state[key], target[key], {
      ...SPRING,
      onUpdate: (v: number) => { state[key] = v },
    }))
  }
}
function stopAll() {
  running.forEach(a => a.stop())
  running = []
}
function play() {
  stopAll()
  tween(before, beforeTarget.value)
  tween(after, afterTarget.value)
  tween(shown, { traffic: webTraffic.value })
}

watch([beforeTarget, afterTarget], play)

// Each time the slide is shown, grow everything from zero
onSlideEnter(() => {
  stopAll()
  Object.assign(before, { load: 0, demand: 0, db: 0, webFail: 0, posFail: 0 })
  Object.assign(after, { webLoad: 0, posLoad: 0, webDemand: 0, posDemand: 0, db: 0, webFail: 0, posFail: 0 })
  shown.traffic = 0
  play()
})
onUnmounted(stopAll)

// Flow line width grows with traffic; dots stay evenly spaced
function flowStyle(width: number, duration: string) {
  const gap = width * 1.9
  return { strokeWidth: width, strokeDasharray: `0.1 ${gap}`, '--period': `-${gap + 0.1}`, animationDuration: duration }
}
const webFlow = computed(() => flowStyle(
  Math.min(11, 4 + shown.traffic / 320),
  `${Math.max(0.35, 1.1 - webTraffic.value / 3000)}s`,
))
const posFlow = flowStyle(5, '1.1s')

// Server box geometry (SVG units)
const BX = 196
const BW = 136
const BAR = 8
function barWidth(load: number) {
  return (BW - 24) * Math.min(1, load)
}

// Database cylinder geometry
const DB = { x: 372, y: 38, w: 68, h: 150 }
function dbFill(load: number) {
  return DB.h * Math.min(1, load / 110)
}
</script>

<template>
  <div class="sim">
    <div class="chips">
      <button
        v-for="(s, key) in SCENARIOS"
        :key="key"
        :class="{ on: scenario === key }"
        @click="pick(key)"
      >
        {{ s.label }}
      </button>
      <button class="db-toggle" :class="{ on: dbOverloaded }" @click="dbOverloaded = !dbOverloaded">
        {{ dbOverloaded ? '✓ ' : '+ ' }}Database overloaded
      </button>
      <span class="traffic"><b>{{ Math.round(shown.traffic).toLocaleString('en-US') }}</b> website requests/sec</span>
    </div>

    <div class="panels">
      <!-- ================= BEFORE ================= -->
      <div class="panel">
        <div class="panel-head"><span class="tag">Before</span> One shared set of servers</div>
        <svg viewBox="0 0 440 210">
          <rect x="0" y="38" width="96" height="36" rx="18" class="pill web" />
          <text x="48" y="61" class="pill-t" text-anchor="middle">Websites</text>
          <rect x="0" y="138" width="96" height="36" rx="18" class="pill pos" />
          <text x="48" y="161" class="pill-t" text-anchor="middle">POS &amp; apps</text>

          <path d="M98,56 C150,56 150,92 192,92" class="flow" :class="{ fail: before.webFail >= 0.01 }" :style="webFlow" />
          <path d="M98,156 C150,156 150,120 192,120" class="flow pos-flow" :class="{ fail: before.posFail >= 0.01 }" :style="posFlow" />

          <!-- shared servers -->
          <g :class="`srv ${tone(before.load)}`">
            <rect :x="BX" y="16" :width="BW" height="180" rx="12" class="srv-box" />
            <text :x="BX + BW / 2" y="94" class="big" text-anchor="middle">{{ fmt(before.demand) }}</text>
            <text :x="BX + BW / 2" y="112" class="small" text-anchor="middle">requests/sec</text>
            <text :x="BX + BW / 2" y="128" class="tiny" text-anchor="middle">{{ handles(before.cap) }}</text>
            <rect :x="BX + 12" :y="196 - 22" :width="BW - 24" :height="BAR" rx="4" class="bar-bg" />
            <rect :x="BX + 12" :y="196 - 22" :width="barWidth(before.load)" :height="BAR" rx="4" class="bar" />
          </g>

          <!-- to database -->
          <path :d="`M${BX + BW},106 L${DB.x - 2},106`" class="db-link" :class="{ fail: before.db > 100 }" />

          <!-- database -->
          <g :class="`db ${dbStatus(before.db).tone}`">
            <text :x="DB.x + DB.w / 2" :y="DB.y - 14" class="small strong" text-anchor="middle">Database</text>
            <rect :x="DB.x" :y="DB.y" :width="DB.w" :height="DB.h" rx="10" class="db-body" />
            <rect :x="DB.x" :y="DB.y + DB.h - dbFill(before.db)" :width="DB.w" :height="dbFill(before.db)" rx="10" class="db-fill" />
            <line :x1="DB.x - 4" :x2="DB.x + DB.w + 4" :y1="DB.y + DB.h * (10 / 110)" :y2="DB.y + DB.h * (10 / 110)" class="db-limit" />
          </g>
        </svg>
        <div class="status">
          <div><span class="who">Websites</span><span class="chip" :class="status(before.webFail, before.db).tone">{{ status(before.webFail, before.db).text }}</span></div>
          <div><span class="who">POS &amp; apps</span><span class="chip" :class="status(before.posFail, before.db).tone">{{ status(before.posFail, before.db).text }}</span></div>
          <div><span class="who">Database</span><span class="chip" :class="dbStatus(before.db).tone">{{ dbStatus(before.db).text }}</span></div>
        </div>
      </div>

      <!-- ================= AFTER ================= -->
      <div class="panel">
        <div class="panel-head"><span class="tag after">After</span> Separate servers, same database</div>
        <svg viewBox="0 0 440 210">
          <rect x="0" y="38" width="96" height="36" rx="18" class="pill web" />
          <text x="48" y="61" class="pill-t" text-anchor="middle">Websites</text>
          <rect x="0" y="138" width="96" height="36" rx="18" class="pill pos" />
          <text x="48" y="161" class="pill-t" text-anchor="middle">POS &amp; apps</text>

          <path d="M98,56 L192,56" class="flow" :class="{ fail: after.webFail >= 0.01 }" :style="webFlow" />
          <path d="M98,156 L192,156" class="flow pos-flow" :class="{ fail: after.posFail >= 0.01 }" :style="posFlow" />

          <!-- website servers -->
          <g :class="`srv ${tone(after.webLoad)}`">
            <rect :x="BX" y="8" :width="BW" height="96" rx="12" class="srv-box" />
            <text :x="BX + BW / 2" y="38" class="big" text-anchor="middle">{{ fmt(after.webDemand) }}</text>
            <text :x="BX + BW / 2" y="54" class="small" text-anchor="middle">requests/sec</text>
            <text :x="BX + BW / 2" y="70" class="tiny" text-anchor="middle">{{ after.servers }} servers · up to ~{{ after.webCap.toLocaleString('en-US') }}</text>
            <rect :x="BX + 12" y="82" :width="BW - 24" :height="BAR" rx="4" class="bar-bg" />
            <rect :x="BX + 12" y="82" :width="barWidth(after.webLoad)" :height="BAR" rx="4" class="bar" />
          </g>

          <!-- POS servers -->
          <g :class="`srv ${tone(after.posLoad)}`">
            <rect :x="BX" y="112" :width="BW" height="90" rx="12" class="srv-box" />
            <text :x="BX + BW / 2" y="142" class="big" text-anchor="middle">{{ fmt(after.posDemand) }}</text>
            <text :x="BX + BW / 2" y="158" class="small" text-anchor="middle">requests/sec</text>
            <text :x="BX + BW / 2" y="173" class="tiny" text-anchor="middle">{{ handles(after.posCap) }}</text>
            <rect :x="BX + 12" y="182" :width="BW - 24" :height="BAR" rx="4" class="bar-bg" />
            <rect :x="BX + 12" y="182" :width="barWidth(after.posLoad)" :height="BAR" rx="4" class="bar" />
          </g>

          <!-- to database: both sides meet at the same database -->
          <path :d="`M${BX + BW},56 C${BX + BW + 24},56 ${DB.x - 22},106 ${DB.x - 2},106`" class="db-link" :class="{ fail: after.db > 100 }" />
          <path :d="`M${BX + BW},157 C${BX + BW + 24},157 ${DB.x - 22},106 ${DB.x - 2},106`" class="db-link" :class="{ fail: after.db > 100 }" />

          <!-- database -->
          <g :class="`db ${dbStatus(after.db).tone}`">
            <text :x="DB.x + DB.w / 2" :y="DB.y - 14" class="small strong" text-anchor="middle">Database</text>
            <rect :x="DB.x" :y="DB.y" :width="DB.w" :height="DB.h" rx="10" class="db-body" />
            <rect :x="DB.x" :y="DB.y + DB.h - dbFill(after.db)" :width="DB.w" :height="dbFill(after.db)" rx="10" class="db-fill" />
            <line :x1="DB.x - 4" :x2="DB.x + DB.w + 4" :y1="DB.y + DB.h * (10 / 110)" :y2="DB.y + DB.h * (10 / 110)" class="db-limit" />
          </g>
        </svg>
        <div class="status">
          <div><span class="who">Websites</span><span class="chip" :class="status(after.webFail, after.db).tone">{{ status(after.webFail, after.db).text }}</span></div>
          <div><span class="who">POS &amp; apps</span><span class="chip" :class="status(after.posFail, after.db).tone">{{ status(after.posFail, after.db).text }}</span></div>
          <div><span class="who">Database</span><span class="chip" :class="dbStatus(after.db).tone">{{ dbStatus(after.db).text }}</span></div>
        </div>
      </div>
    </div>

    <div class="note">
      Simplified model. "Handles up to": today ~400 requests/sec (April stress test, outage at 450);
      website servers ~250 each, ~1,000 with 4 (target, confirmed by the load test); POS servers ~280 (70 workers each).
      The database gauge is illustrative: both setups share one database, and if it is overloaded everyone is affected.
    </div>
  </div>
</template>

<style scoped>
.sim {
  --good: #2fa66a;
  --bad: #e5484d;
  font-size: 0.75rem;
}

.chips { display: flex; gap: 0.4rem; align-items: center; }
.chips button {
  border: 1px solid var(--aio-line);
  background: #fff;
  border-radius: 999px;
  padding: 0.25rem 0.8rem;
  font-weight: 600;
  color: var(--aio-ink);
  cursor: pointer;
}
.chips button.on { background: var(--aio-purple-tint); border-color: var(--aio-purple); color: var(--aio-purple); }
.chips .db-toggle { border-style: dashed; margin-left: 0.4rem; }
.chips .db-toggle.on { background: #fde7e8; border-color: var(--bad); border-style: solid; color: #c22f35; }
.traffic { margin-left: auto; color: var(--aio-muted); }
.traffic b { color: var(--aio-ink); }

.panels { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-top: 0.7rem; }
.panel { border: 1px solid var(--aio-line); border-radius: 12px; padding: 0.6rem 0.9rem 0.7rem; }
.panel-head { font-weight: 700; font-size: 0.85rem; margin-bottom: 0.35rem; }
.tag {
  display: inline-block;
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.1rem 0.5rem;
  border-radius: 4px;
  background: var(--aio-surface);
  color: var(--aio-muted);
  margin-right: 0.35rem;
  vertical-align: 2px;
}
.tag.after { background: var(--aio-purple-tint); color: var(--aio-purple); }

svg { width: 100%; height: auto; display: block; }
.pill.web { fill: var(--aio-purple-tint); }
.pill.pos { fill: var(--aio-blue-tint); }
.pill-t { font-size: 12px; font-weight: 700; fill: var(--aio-ink); }
.big { font-size: 24px; font-weight: 800; fill: var(--aio-ink); }
.mid { font-size: 14px; font-weight: 800; fill: var(--aio-ink); }
.small { font-size: 10.5px; fill: var(--aio-muted); }
.tiny { font-size: 9.5px; fill: var(--aio-muted); }
.small.strong { font-weight: 700; fill: var(--aio-ink); font-size: 12px; }

/* colour changes fade instead of snapping */
.srv-box, .bar, .db-fill, .db-body, .db-link, .flow, .big, .mid {
  transition: fill 0.45s ease, stroke 0.45s ease;
}
.chip, .chips button { transition: background-color 0.45s ease, color 0.45s ease, border-color 0.45s ease; }

/* server boxes: neutral box, coloured load bar; red tint when full */
.srv-box { fill: var(--aio-surface); stroke: var(--aio-line); }
.bar-bg { fill: #e9e9e9; }
.srv.good .bar { fill: var(--good); }
.srv.warn .bar { fill: var(--aio-amber); }
.srv.bad .bar { fill: var(--bad); }
.srv.bad .srv-box { fill: #fde7e8; stroke: var(--bad); }
.srv.bad .big { fill: #c22f35; }

/* database */
.db-body { fill: #fff; stroke: var(--aio-line); }
.db.good .db-fill { fill: var(--good); }
.db.warn .db-fill { fill: var(--aio-amber); }
.db.bad .db-fill { fill: var(--bad); }
.db.bad .db-body { stroke: var(--bad); }
.db.bad .mid { fill: #c22f35; }
.db-limit { stroke: var(--bad); stroke-width: 1.5; stroke-dasharray: 4 3; }
.db-link { fill: none; stroke: var(--aio-amber); stroke-width: 4; opacity: 0.75; }
.db-link.fail { stroke: var(--bad); }

.flow {
  fill: none;
  stroke: var(--aio-purple);
  stroke-linecap: round;
  animation: flow 0.8s linear infinite;
}
.pos-flow { stroke: var(--aio-blue); }
.flow.fail { stroke: var(--bad); }
@keyframes flow { to { stroke-dashoffset: var(--period); } }

.status { display: grid; gap: 0.3rem; margin-top: 0.45rem; }
.status > div { display: flex; justify-content: space-between; align-items: center; }
.who { font-weight: 600; }
.chip { border-radius: 999px; padding: 0.05rem 0.6rem; font-weight: 700; }
.chip.good { background: #e3f5ea; color: #1f7a4a; }
.chip.warn { background: var(--aio-amber-tint); color: var(--aio-amber-strong); }
.chip.bad { background: #fde7e8; color: #c22f35; }

.note { margin-top: 0.5rem; font-size: 0.6rem; color: var(--aio-muted); }
</style>
