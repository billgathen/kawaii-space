# Kawaii Space (still in development)
## by Bill Gathen @billgathen on GitHub

[Try it here!](https://billgathen.github.io/kawaii-space) 🚀

This is a work in progress! Please be gentle with me: it's my first game.

Inspiration: [JavaScript Game Design For Beginners - (Free Code Camp)](https://youtu.be/GFO_txvwK_c?si=aFi1dDkq4VmsbARB) by [Franks Laboratory](http://www.youtube.com/@Frankslaboratory)

NOTES

Use any basic HTTP server to serve index.html locally: I use Live Server (Ritwick Dey) in VSCode.

To get cache-busting, I use the following as a git pre-commit hook on my Mac:

```shell
#!/bin/sh

# Calculate the current time in millis
NOW=$(date +%s%3N)

# Use sed to existing IDs with the current time
sed -i '' "s/cache-busting=[^\"']*/cache-busting=$NOW/g" index.html
sed -i '' "s/cache-busting=[^\"']*/cache-busting=$NOW/g" *.js

# Add the modified index.html to the staging area
git add index.html

# The commit will continue with the change included
```