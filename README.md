# sisu-grade-distribution
This is a Firefox Extension which purpose is to show the grade distribution for courses in Sisu.

## Changes to original (Chrome) version

- User background script instead of Service Worker (Firefox doesn't support Service Workers)
- `.gitignore` file for excluding `web-ext` output files 
- Added custom ID (Firefox requirement)