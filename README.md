# DE SQL Gym

**DE SQL Gym** is a browser-based SQL practice tool built specifically for **junior/entry-level Data Engineers** preparing for interviews. Instead of generic LeetCode-style SQL puzzles, every question is framed around the kind of problems data engineers actually get asked: incremental loads, slowly changing dimensions, data quality checks, sessionization, and more.

Run it locally with `node server.js` (progress saved to `progress.json`) or use the hosted version at Netlify, which supports per-user accounts so your progress follows you across devices.

## What's inside

- **123 SQL problems** — 23 Easy / 61 Medium / 39 Hard — each with a title, difficulty, pattern, and topic tags.
- **27 data-engineering-flavored topics**, including:
  - Core interview staples: Joins, Aggregation, Window Functions, Ranking, Subquery, CASE, Set Operations, NULL Handling, Dates, Strings, Type Casting
  - **DE-specific patterns rarely covered elsewhere**: SCD (Slowly Changing Dimensions), CDC (Change Data Capture), Incremental Load, Data Quality, Dedup, Gaps and Islands, Sessionization, Funnel, Cohort, Recursive CTE, Modeling, Streaming, Performance, Statistics, JSON
- **Company tags** on many questions (Amazon, Google, Meta, Microsoft, Uber, Airbnb, DoorDash, Walmart, JPMorgan, Deloitte, TCS, Infosys, and more), sourced/claimed from third-party lists, so you know what's actually been asked.
- **In-browser SQL editor** (CodeMirror + SQLite via sql.js/WASM) — write and run real SQL against a seeded dataset for each problem, right in the browser. No local database setup needed.
- **Instant answer checking** — your query's output is compared against the expected result set so you know immediately if you're right.
- **Hints and worked solutions** for every problem, revealed on demand (and tracked separately, so peeking is recorded — you can be honest with yourself about how you solved it).
- **Personal notes per question** — jot down the one-line insight or the thing that tripped you up, for review right before an interview.
- **Review-later bookmarking** — flag tricky questions to revisit instead of losing them in the list.
- **Progress tracking dashboard** — solved/attempted/untouched counts overall, broken down by difficulty and by topic, with **weak spots surfaced first** so you know exactly what to drill next.
- **Filtering and search** — by keyword, difficulty, status (solved/attempted/unsolved), topic, company, or flagged-only.
- **"Random unsolved"** button for spaced-practice-style drilling instead of grinding top-to-bottom.
- **Per-user accounts** (login/signup) on the hosted version, backed by Netlify Blobs, so progress, notes, and flags are saved to your account instead of just one browser's local storage.

## Why it helps junior data engineers specifically

Most SQL interview prep resources are written for generalist SQL/analyst interviews. DE SQL Gym instead targets the specific patterns that show up in **data engineering** interviews:

- **Pipeline-shaped problems** (incremental load, CDC, SCD Type 1/2, dedup) mirror what you'll actually be asked to design or debug on the job, not just abstract "top-N per group" puzzles.
- **Data quality and gaps/islands questions** build the kind of defensive, correctness-first thinking DE interviewers probe for.
- **Difficulty progression** (Easy → Medium → Hard) plus a weak-spot dashboard gives juniors a structured path instead of an unsorted question dump.
- **Company tags** help you prioritize practice toward the companies you're actually interviewing with.
- Because everything runs against a real embedded SQLite engine, you get the same "did my query actually work" feedback loop as a real take-home or live-coding round — not just a syntax checker.
