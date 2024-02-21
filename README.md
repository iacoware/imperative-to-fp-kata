### Description 
Refactoring kata with the aim of practicing the transition of a imperative codebase to a functional one.

The application resize and compress all the images found in public/team-photos write them into public/team-photos/processed and generate a json file (`images.json`) with the list of the processed images within the same folder

### Incremental features
- Start from index.ts and wrap compress() and writeJson() with an Effect type and execute them in series
- Make the function return the Effect type and return two different errors in case of failure (CompressError, WriteJsonError)
- ... 

### Commands available through `npm run`
- `go`: compile and run index.ts
- `freshstart`: remove .git folder to clean up the git history
- The usual `test`
