### This software:
Cycles through thousands of images and moves them to an archive if they're unique.
If a dupe is supsected, it's marked and saved to the database for review (later, separately).


#### TODO
- ✓ Don't calculate hash is size is sufficiently large and entropic.
- Calculate statistics. Num dupes, num unique.
- Mongodump + backup for now? Or new mongo instance on another port.
- Atomic operation? Move + write or reverse.
- Prefer "better" name in files? (more descriptive, more human)

#### Front-end
- Use electron
- Generate thumbs (check if file(s) exist, may have since been moved)
- Easily resolve dupe