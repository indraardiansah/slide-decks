---
theme: ../theme
title: Appliance.io All Hands
layout: cover
date: November, 2026
themeConfig:
  brand: appliance.io
  # logo: /logo.svg      # put the file in this deck's public/ folder
---

# Appliance.io<br>All Hands

<!--
Speaker notes go in HTML comments at the end of a slide.
-->

---
layout: agenda
items:
  - Company Pulse
  - Appliance.io Design System
  - Appliance.io Platform Security
  - Website Builder Business Unit Plan
  - $10M AIO Pay goal
  - Q&A
---

# Today's Agenda

---
layout: section
---

# Website Builder<br>Business Unit Plan

Engineering Lead

---
eyebrow: Website Builder Business Unit Plan
---

# Why a dedicated Website Team

Our first step toward a modular platform.

<div class="grid grid-cols-3 gap-4 mt-8">
  <Card color="purple" eyebrow="1 · Company vision" title="A modular platform">
    We support the company vision of a modular platform. The website is the most feasible module to start with.
  </Card>
  <Card color="amber" eyebrow="2 · Today" title="A shared codebase">
    The website code lives in the platform codebase, so every website change depends on the platform team.
  </Card>
  <Card color="blue" eyebrow="3 · The change" title="Full ownership">
    We separate the codebase, so the website is fully owned by the Website Team.
  </Card>
</div>

<Card color="gray" title="The goal: one team owns the website end to end" class="mt-6">
  It changes and releases on its own schedule, while the platform team focuses on its own work.
</Card>

---
layout: two-cols-header
---

# Company Valuation

A measure of what the company is worth.

::left::

<Card color="purple" class="mt-4">
  <Stat value="$4.0M" label="August 2026 valuation" note="Formal third-party valuation" color="purple" />
</Card>

::right::

<Card color="amber" eyebrow="Why it matters" class="mt-4">

- Gives us a bigger-picture view of company progress.
- Connects reliability, customers, revenue and growth to the overall value.
- Gives us a benchmark we can track over time.

</Card>

::bottom::

<div class="text-sm text-aio-muted text-center">
  A formal assessment of the overall value of the business at a specific point in time.
</div>

---
---

# Company Growth Recap

Monthly growth across the client base, platform users, and active websites.

<div class="grid grid-cols-3 gap-8 mt-10">
  <Stat value="36" label="Active clients" delta="+5.6%" note="Aug–Oct 2026" color="purple" />
  <Stat value="327" label="Active users" delta="-0.3%" note="Aug–Oct 2026" color="amber" />
  <Stat value="33" label="Active websites" delta="Stable" note="Aug–Oct 2026" color="blue" />
</div>

---
layout: fact
eyebrow: August AIO Pay volume
---

# $6.86M

processed in August, $3.14M away from the $10M milestone

---
layout: center
shapes: corner
---

# Gradient text, three ways

<p class="mt-6 text-2xl font-700">
  <span class="text-gradient">warm (default)</span> ·
  <GradientText variant="cool">cool</GradientText> ·
  <GradientText variant="full">full</GradientText>
</p>

Use `class="text-gradient"` in Markdown or `<GradientText>` in a slide.

---
layout: section
shapes: mirror
---

# QnA Session

---
layout: end
---
