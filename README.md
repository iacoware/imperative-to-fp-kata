### Description 
Refactoring kata with the aim of practicing the transition of a imperative codebase to a functional one.

The application resize and compress all the images found in public/team-photos write them into public/team-photos/processed and generate a json file (`images.json`) with the list of the processed images within the same folder

### Incremental features
- Start from index.ts and wrap compress() and writeJson() with an Effect type and execute them in series
- Distinguish between two types of error, CompressError and WriteJsonError
- If the app generate an error we want to process.exit(1) so that the CLI knows something went wrong
- Make the two functions return an Effect type. Push it inside the functions instead of wrapping them. Can you do it incrementally? Try to always be shippable. Some suggestions:
    - Do one function at a time
    - 
- If there's an error during the compress() phase don't stop and report only the files where we experienced an error
- ... 
- Report the total time of execution
- Use Config to pass configuration values inside
- Make it a real CLI using the @effect/cli package

### Commands available through `npm run`
- `go`: run index.ts
- `freshstart`: remove .git folder to clean up the git history
- The usual `test`
