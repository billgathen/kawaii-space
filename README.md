# Kawaii Space (still in development)
## by Bill Gathen @billgathen on GitHub

[Try it here!](https://billgathen.github.io/kawaii-space) 🚀

This is a work in progress! Please be gentle with me: it's my first game.

Inspiration: [JavaScript Game Design For Beginners - (Free Code Camp)](https://youtu.be/GFO_txvwK_c?si=aFi1dDkq4VmsbARB) by [Franks Laboratory](http://www.youtube.com/@Frankslaboratory)

NOTES

Use any basic HTTP server to serve index.html locally: I use Live Server (Ritwick Dey) in VSCode.

To get cache-busting, I use the following as a git pre-push hook on my Mac:

```shell
#!/bin/sh

# Calculate the current commit ID
COMMIT_ID=$(git rev-parse --short=7 HEAD)

# Use sed to replace CACHEBUSTED with the commit ID in index.html
sed -i '' "s/style.css\?v=[^\"']*/style.css?v=$COMMIT_ID/" index.html
sed -i '' "s/script.js\?v=[^\"']*/script.js?v=$COMMIT_ID/" index.html

# Add the modified index.html to the staging area
git add index.html

# Amend the last commit without changing its message
git commit --amend --no-edit

# The push will proceed after this script finishes
```