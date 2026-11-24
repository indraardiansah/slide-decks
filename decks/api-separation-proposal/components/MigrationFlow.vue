<script setup lang="ts">
/**
 * Migration sequence: build → prove → switch → downsize,
 * with today's shared servers kept as the fallback until the switch is proven.
 */
const steps = [
  {
    n: 1,
    name: 'Build',
    tone: 'gray',
    text: 'Set up the new Website API servers next to today\'s.',
    note: 'Nothing uses them yet',
  },
  {
    n: 2,
    name: 'Prove',
    tone: 'purple',
    text: 'Point staging websites to the new servers, then run a load test.',
    note: '3-hour load test',
  },
  {
    n: 3,
    name: 'Switch',
    tone: 'blue',
    text: 'Move customer websites to the new servers and watch for 2 days to 1 week.',
    note: 'Old servers on standby',
  },
  {
    n: 4,
    name: 'Downsize',
    tone: 'amber',
    text: 'Shrink the Platform API servers to the size POS needs.',
    note: 'Saves $830 per month',
  },
]
const gates = ['Ready', 'Load test passes', 'No issues']
</script>

<template>
  <div class="flow">
    <div class="row">
      <template v-for="(s, i) in steps" :key="s.n">
        <div class="step" :class="s.tone" :style="{ animationDelay: `${0.1 + i * 0.15}s` }">
          <div class="head">
            <span class="num">{{ s.n }}</span>
            <span class="name">{{ s.name }}</span>
          </div>
          <div class="text">{{ s.text }}</div>
          <div class="note">{{ s.note }}</div>
        </div>
        <div v-if="i < gates.length" class="gate" :style="{ animationDelay: `${0.2 + i * 0.15}s` }">
          <span class="gate-label">{{ gates[i] }}</span>
          <svg viewBox="0 0 60 12" class="arrow"><path d="M2,6 H50 M44,1 L52,6 L44,11" /></svg>
        </div>
      </template>
    </div>

    <!-- fallback lane: today's servers stay ready, websites can switch back from step 3 -->
    <div class="fallback" :style="{ animationDelay: '0.7s' }">
      <div class="lane">
        <span class="lane-dot" />
        <b>Today's shared servers stay running</b>
        <span class="lane-sub">until websites run smoothly on the new servers</span>
      </div>
      <div class="back">
        <svg viewBox="0 0 40 40" class="back-arrow"><path d="M34,4 V22 Q34,32 24,32 H8 M14,26 L6,32 L14,38" /></svg>
        <span><b>Something wrong?</b> Point websites back to today's servers</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flow { font-size: 0.78rem; }

.row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 3.8rem minmax(0, 1fr) 3.8rem minmax(0, 1fr) 3.8rem minmax(0, 1fr);
  align-items: stretch;
}
.step {
  border-radius: 12px;
  border: 1.5px solid var(--aio-line);
  background: #fff;
  padding: 0.8rem 0.9rem;
  display: flex;
  flex-direction: column;
  animation: rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.step.purple { border-color: var(--aio-purple); background: var(--aio-purple-tint); }
.step.blue { border-color: var(--aio-blue); background: var(--aio-blue-tint); }
.step.amber { border-color: var(--aio-amber); background: var(--aio-amber-tint); }
.step.gray { background: var(--aio-surface); }

.head { display: flex; align-items: center; gap: 0.45rem; margin-bottom: 0.45rem; }
.num {
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.72rem;
  color: #fff;
}
.gray .num { background: #8a8a8a; }
.purple .num { background: var(--aio-purple); }
.blue .num { background: var(--aio-blue); }
.amber .num { background: var(--aio-amber-strong); }
.name { font-weight: 800; font-size: 1.05rem; }
.text { line-height: 1.45; flex: 1; }
.note {
  margin-top: 0.6rem;
  align-self: flex-start;
  font-size: 0.6rem;
  font-weight: 700;
  padding: 0.22rem 0.6rem;
  border-radius: 999px;
  white-space: nowrap;
  max-width: 100%;
  background: #fff;
  color: var(--aio-muted);
  border: 1px solid var(--aio-line);
}

.gate {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  padding: 0 0.2rem;
  animation: fade 0.6s ease both;
}
.gate-label {
  font-size: 0.56rem;
  font-weight: 700;
  text-align: center;
  line-height: 1.25;
  color: #1f7a4a;
}
.arrow { width: 3.4rem; height: 0.8rem; }
.arrow path { fill: none; stroke: #2fa66a; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }

.fallback {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: center;
  margin-top: 0.9rem;
  animation: rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.lane {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1rem;
  border-radius: 999px;
  border: 1.5px dashed #9a9a9a;
  background: var(--aio-surface);
}
.lane-dot {
  position: relative;
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 999px;
  background: #2fa66a;
  flex: none;
}
/* "live" pulse: a soft ring that grows and fades out */
.lane-dot::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: #2fa66a;
  animation: pulse 1.8s ease-out infinite;
}
@keyframes pulse {
  from { transform: scale(1); opacity: 0.6; }
  to { transform: scale(2.8); opacity: 0; }
}
.lane-sub { color: var(--aio-muted); }
.back {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  max-width: 17rem;
  color: #c22f35;
  line-height: 1.35;
}
.back-arrow { width: 1.8rem; height: 1.8rem; flex: none; }
.back-arrow path { fill: none; stroke: #e5484d; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }

@keyframes rise {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
}
@keyframes fade { from { opacity: 0; } to { opacity: 1; } }
</style>
