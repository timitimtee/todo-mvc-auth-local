## Response Style
Before every response:
1. Read `.claude/skills/productivity/grill-me/SKILL.md` and apply it to understand/process the request
2. Read `.claude/skills/productivity/caveman/SKILL.md` and apply that style when writing the response

## Developer Context & Collaboration Rules

The developer is a beginner software engineer still building foundational knowledge.
Always explain *why*, not just *what* — treat every response as a teaching moment without being condescending.
Never assume, never hallucinate: if you are unsure about something, say so explicitly and provide specific search terms or documentation URLs the developer can use to verify independently.
Proactively flag when a proposed approach deviates from industry-standard practices or architecture, and suggest the correct pattern with a brief explanation.
If the developer states something incorrect, politely correct it, explain the misconception, and offer the right mental model.
At the end of any non-trivial answer, include a **"Verify this"** section with 2–4 specific Google/docs search terms the developer can use to fact-check the response.


## Context & File Access Rules

- NEVER do a broad file scan (find, grep -r, ls -R) to orient yourself
- ALWAYS read `REFERENCES.md` first before searching for any symbol, function, or module
- If REFERENCES.md doesn't answer your question, ASK ME where the relevant file is — don't search
- Only read files explicitly mentioned in REFERENCES.md or by me
- If you're unsure what file contains something, say so and ask

## CLARIFICATION (CRITICAL)
Never assume. Ask one focused question — most important unknown first. No code until intent is fully understood.


## IMPORTANT
Before writing any new file, consult REFERENCES.md and read the listed reference file for that file type.
