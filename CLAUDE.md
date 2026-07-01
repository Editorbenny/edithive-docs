# Edithive — engineering policy (always in force)

**For ANY request to update, fix, change, build, package, sign, notarize, release, deploy, or hotfix
Edithive Select (app, installers/.pkg, Premiere/Resolve panels, licensing, updater) or the
myedithive.com site: FOLLOW THE `edithive-engineering` SKILL. Invoke it before acting.**

Non-negotiables (the skill has the full detail + commands):

- **Open every task with two lines:** `Task Risk: HIGH|MEDIUM|LOW` and `Verification Strategy: Full|Targeted|Verified Baseline`. Do only the verification that can change the decision.
- **Zero trust:** mark checks `PASS | FAIL | NOT VERIFIED | UNKNOWN`. PASS only from evidence obtained **this task**. Memory / prior sessions / user reports = NOT VERIFIED. Reuse a baseline only after lightweight validation proves it unchanged.
- **Never let production diverge from version control.**
- **A beta touches ONLY `myedithive-site/beta/version.json` + `downloads.html` — NEVER root `version.json`** (that is the release channel).
- **Evidence over prose** (`codesign/pkgutil/spctl/stapler/git/curl/shasum/lipo`). Never capture `$?` after a pipe for a verification command.
- **Stop-on-contradiction:** if evidence contradicts an assumption, stop and reassess — don't push the plan.
- **Protect production over completing the task.** Block a release without asking if any release gate is unverifiable. Fresh-account launch/activation is not automatable here → stays NOT VERIFIED, say so.
- **Default report:** one screen — Release Status · Task Risk · Verification · Confidence · Blocked Items · Engineering Summary (≤5 bullets) · Recommended Next Action. Expand only on failure/block/forensic request.
