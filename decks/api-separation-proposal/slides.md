---
theme: ../../theme
title: Separating the Website API from the Platform
layout: cover
class: cover-wide
date: November, 2026
themeConfig:
  brand: appliance.io
  sections: Problem, Solution, Servers, Simulation, Impact, Plan, Decision
---

# Separating the Website API<br>from the Platform

<p class="aio-subtitle">Proposal for leadership approval</p>

---
section: Problem
class: fill
---

# One website spike can take POS down

Websites and POS run on the same servers, so a website spike uses up the capacity POS needs.

<div class="share mt-8">
  <div class="share-label">Requests to our shared servers</div>
  <div class="share-bar">
    <div class="share-web"><b>95%</b> Customer websites</div>
    <div class="share-pos"></div>
  </div>
  <div class="share-legend"><span class="dot"></span><b>5%</b> POS, Driver App and Customer Portal</div>
</div>

<div class="problem-stats grid grid-cols-3 mt-8">
  <Stat value="2" label="Incidents in one week" note="30 Sep and 5 Oct. Website floods slowed POS and the apps." color="purple" />
  <Stat value="35 min" label="POS degraded, 30 Sep" note="POS, Driver App and Customer Portal slowed down." color="amber" />
  <Stat value="~10×" label="Traffic spike, 30 Sep" note="2,912 requests/sec on 30 Sep vs ~300 on a normal peak." color="blue" />
</div>

<p class="problem-quote push-bottom">A problem on a customer's website should never stop a store from ringing up a sale.</p>

---
section: Solution
class: fill
---

# Give websites their own servers

Websites move to a separate set of servers. Same code, same database.

<SolutionDiagram class="mt-6" />

<div class="change-lists grid grid-cols-2 gap-10 push-bottom">
<div class="change-col changes">

### What changes

- Websites run on their own servers
- Each side can be sized for its own job
- Each side gets its own share of the database

</div>
<div class="change-col stays">

### What stays the same

- The application code: one release goes to both
- POS and the apps: same address, nothing to update
- The database: no changes

</div>
</div>

---
section: Servers
class: fill
---

# Right-sized servers for each side

Today everyone shares one set of large servers. After the change, each side gets servers sized for its own job.

<ServerSplit class="mt-4" />

<p class="spec-note push-bottom">
  One-off cost of <b>$75–260</b> while both setups overlap for 2 days to 1 week. If the load test falls short, websites stay on c6a.8xlarge.
</p>

---
section: Simulation
class: sim-slide
---

# The same traffic, before and after

<ApiSimulation scenario="normal" />

<!--
Opens on "Normal day": both sides are fine.
"Busy campaign day": before, POS already starts failing because it waits in the same line as websites.
"30 Sep traffic flood": before, everything fails. After, websites struggle but POS stays healthy.

Then turn on "Database overloaded": both setups still share one database, so POS is affected in both.
After the change POS is hit less (it has its own reserved database connections), but it is not immune.
The database load is a little higher after, because the website servers can serve more customers.
This is the limit of this change: POS can still go down if the database is overloaded.
-->

---
section: Impact
class: fill
---

# What it means for the business

<div class="grow-center">
<div class="impact-grid">
  <div class="impact-main">
    <div class="im-label">Reliability</div>
    <div class="im-title">Much lower risk of POS going down</div>
    <p>Website spikes no longer use up the servers POS, the Driver App and the Customer Portal run on.</p>
    <p>Only a flood big enough to overload the shared database can still affect them.</p>
  </div>
  <div class="impact-side">
    <div class="is-item cost">
      <div class="is-label">Cost</div>
      <div class="is-value">≈ $10,000<span> saved per year</span></div>
      <div class="is-text">$830 less per month (−29%), from ≈ $2,880 to ≈ $2,050.</div>
    </div>
    <div class="is-item growth">
      <div class="is-label">Headroom, to be confirmed by the load test</div>
      <div class="is-title">More room for website traffic</div>
      <div class="is-text">Websites add servers on their own. We aim for about 2.5× today's limit.</div>
    </div>
    <div class="is-item visibility">
      <div class="is-label">Visibility</div>
      <div class="is-title">Faster answers when something breaks</div>
      <div class="is-text">Separate dashboards and alerts show which side has the problem.</div>
    </div>
  </div>
</div>
</div>

<p class="impact-limit push-bottom">
  <b>Still shared: the database.</b> Even after this change, a very large website flood can overload
  the database and still take POS down with it.
</p>

<!--
Lead with the 30 Sep incident: POS and the apps were degraded for 35 minutes by a website problem.
This change makes that much less likely, but does not rule it out while the database is shared.
The yearly saving is $830 × 12 = $9,960.
-->

---
section: Plan
class: fill
---

# Build, prove, switch, downsize

No planned downtime. Each step must be proven before the next, and we can switch back.

<div class="grow-center">
  <MigrationFlow />
</div>

<p class="flow-note push-bottom">
  We switch back if POS or the websites slow down or show errors, or checkout problems are reported.
  The Change Owner and Engineering Lead make the call. Support is told at least 1 business day before each step.
</p>

---
section: Decision
class: fill
---

# What we need from you today

With your approval, we start on <b>2 December</b> and report the load test result before switching any website.

<div class="grow-center">
<div class="asks grid grid-cols-3 gap-5">
  <div class="ask purple">
    <div class="ask-head"><span class="ask-num">1</span><span class="ask-verb">Approve</span></div>
    <div class="ask-title">The four-step plan</div>
    <div class="ask-text">Build, prove, switch, downsize. No planned downtime, and we can switch back at every step.</div>
  </div>
  <div class="ask amber">
    <div class="ask-head"><span class="ask-num">2</span><span class="ask-verb">Approve</span></div>
    <div class="ask-title">$75–260 one-off cost</div>
    <div class="ask-text">Old and new servers run side by side for 2 days to 1 week while we switch.</div>
  </div>
  <div class="ask blue">
    <div class="ask-head"><span class="ask-num">3</span><span class="ask-verb">Agree</span></div>
    <div class="ask-title">A 3-hour load test</div>
    <div class="ask-text">On production systems while US stores are closed. Stopped at once if POS is affected.</div>
  </div>
</div>
</div>

<div class="in-return push-bottom">
  <div class="ir-label">In return</div>
  <div class="ir-item"><b>Much lower risk</b> of POS going down</div>
  <div class="ir-sep" />
  <div class="ir-item"><b>≈ $10,000</b> saved per year</div>
  <div class="ir-sep" />
  <div class="ir-item"><b>A tested way</b> to switch back</div>
</div>

---
layout: end
---
