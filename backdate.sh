#!/bin/bash

# Function to create backdated commits
make_commits() {
  local date=$1
  local count=$2
  
  for ((i=1; i<=count; i++)); do
    echo "" >> readme.md
    
    # Automatically stages and commits the modified file
    GIT_AUTHOR_DATE="${date} 12:00:0$i" GIT_COMMITTER_DATE="${date} 12:00:0$i" git commit -am "Backdated update for $date"
  done
}

# Execute the commits for February 1st
make_commits "2026-02-01" 5

echo "February 1st backdated commits have been created locally!"
