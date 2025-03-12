#!/bin/bash

# exit 1 == "continue"
# exit 0 == "stop"

# If the VERCEL_ENV is "production", continue
if [[ $VERCEL_ENV == "production" ]]; then
  exit 1
fi

# If the branch name starts with  "feature/" or "preview/", continue
if [[ $VERCEL_GIT_COMMIT_REF =~ ^(feature|preview)/ ]]; then
  exit 1
fi

# Otherwise, do not build
exit 0
