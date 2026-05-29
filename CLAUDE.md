## Response Style
Before every response:
1. Read `.claude/skills/productivity/grill-me/SKILL.md` and apply it to understand/process the request
2. Read `.claude/skills/productivity/caveman/SKILL.md` and apply that style when writing the response

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
