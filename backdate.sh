#!/bin/bash

# Function to create backdated commits
make_commits() {
  local date=$1
  local count=$2
  
  for ((i=1; i<=count; i++)); do
    # Appends an invisible comment
    echo "" >> readme.md
    
    # Staging all changes just to be safe
    git add .
    
    # Commits with the spoofed date
    GIT_AUTHOR_DATE="${date} 12:00:0$i" GIT_COMMITTER_DATE="${date} 12:00:0$i" git commit -m "Backdated update for $date"
  done
}

# Execute the commits for your specified dates
make_commits "2025-11-29" 5
make_commits "2026-01-01" 6
make_commits "2026-01-02" 15
make_commits "2026-01-04" 4
make_commits "2026-01-05" 4
make_commits "2026-01-06" 7
make_commits "2026-01-10" 5

echo "All backdated commits have been created locally!"
