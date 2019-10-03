### This software:
Cycles through thousands of images and moves them to an archive if they're unique.
If a dupe is supsected, it's marked and saved to the database for review (later, separately).


#### TODO
- ✓ Don't calculate hash is size is sufficiently large and entropic.
- Move suspected dupe to like {ARCHIVE}_likely_dupes/ and THEN save dupe doc to db w/ fullPath
- Determine when done
- Calculate statistics. Num dupes, num unique.
- Mongodump + backup for now? Or new mongo instance on another port.
- Atomic operation? Move + write or reverse.
- Prefer "better" name in files? (more descriptive, more human)

#### Front-end
- Use electron
- Generate thumbs (check if file(s) exist, may have since been moved)
- Easily resolve dupe



src
    size < max && existing docs in db ?
        for each existing doc
            getStoredHash (existing has hash ? use it : make hash & save)
                hashes match ?
                    insert dupe event (could be many)
        0 match?
            unique
    else
        unique