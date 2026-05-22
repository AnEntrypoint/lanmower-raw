# lanmower-raw

Portfolio site for [@lanmower](https://github.com/lanmower) — built as a static site and deployed to GitHub Pages.

**Live:** https://anentrypoint.github.io/lanmower-raw/

## Stack

Pure HTML + CSS + vanilla JS. No build step. Repository data is snapshotted to `repos.json` from the GitHub API and rendered client-side.

## Refresh repo data

```bash
gh api "users/lanmower/repos?per_page=100&sort=updated" --paginate > repos_raw.json
python build_repos.py   # see script header for details
```

## Deploy

Pushed to `main`; GitHub Pages serves directly from the repository root.
