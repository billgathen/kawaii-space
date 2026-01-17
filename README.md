# Kawaii Space (still in development)
## by Bill Gathen @billgathen on GitHub

[Try it here!](https://billgathen.github.io/kawaii-space) 🚀 (works on both desktop and mobile)

This is a work in progress! Please be gentle with me: it's my first game.

This project would not have been possible without the excellent [JavaScript Game Design For Beginners - (Free Code Camp)](https://youtu.be/GFO_txvwK_c?si=aFi1dDkq4VmsbARB) by [Franks Laboratory](http://www.youtube.com/@Frankslaboratory)

Some of the sounds in this project were created by [ViRiX Dreamcore (David Mckee)](https://www.soundcloud.com/virix). I found them on [Open Game Art](https://opengameart.org).

NOTES

Use any basic HTTP server to serve index.html locally: I use Live Server (Ritwick Dey) in VSCode.

To get cache-busting, I use the following as a git pre-commit hook on my Mac:

```shell
#!/bin/sh

# Calculate the current time in millis
NOW=$(date +%s%3N)

# Use sed to replace existing IDs with the current time
sed -i '' "s/cache-busting=[^\"']*/cache-busting=$NOW/g" index.html
sed -i '' "s/cache-busting=[^\"']*/cache-busting=$NOW/g" *.js

# Add potentially-modified files to the staging area
git add index.html
git add *.js

# The commit will continue with the change included
```
