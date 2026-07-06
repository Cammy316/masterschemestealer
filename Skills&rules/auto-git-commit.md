# Name: Autonomous Git Committer
# Description: Automates analyzing code diffs and writing formatted Conventional Commits.

## Guidelines
- Before committing, autonomously review and update the root `CHANGELOG.md` under the `[Unreleased]` heading to reflect the features, changes, and fixes being committed.
- When instructed to "commit changes", autonomously run `git status` and `git diff` to analyze the staged and unstaged changes in the workspace.
- Stage all relevant modified files automatically.
- Generate a precise commit message following the Conventional Commits standard (using prefixes like `feat:`, `fix:`, `refactor:`, `chore:`).
- Keep the commit title under 50 characters. 
- If the diff includes complex logic changes (like altering the CIEDE2000 math or Zustand state), provide a bulleted commit body explaining *why* the change was made.
- Execute the commit autonomously without asking for further confirmation.