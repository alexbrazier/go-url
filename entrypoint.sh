#!/usr/bin/env bash

# Inject env before starting server

vars=(
  "SENTRY_FRONTEND_DSN" 
)
targetPath="public/index.html"

script="<script>window.appConfig={"

for var in "${vars[@]}"
do
  script="$script\"$var\":\"$(printenv $var)\","
done

script="$script}</script>"

find="<script src=\"\/config.js\"><\/script>"
# escape special chars from script
replace=$(echo $script | sed -e 's/\\/\\\\/g; s/\//\\\//g; s/&/\\\&/g')
# Replace config.js import with inline variable in index.html
sed -ie "s/$find/$replace/" $targetPath

/go/bin/server
