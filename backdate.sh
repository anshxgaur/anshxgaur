#!/bin/bash

# Function to create backdated commits
make_commits() {
  local date=$1
  local count=$2
  
  for ((i=1; i<=count; i++)); do
    # Appends the invisible comment to the exact lowercase file Git is tracking
    echo "" >> readme.md
    
    # The -am flag automatically stages the modified file and commits it
    GIT_AUTHOR_DATE="${date} 12:00:0$i" GIT_COMMITTER_DATE="${date} 12:00:0$i" git commit -am "Backdated update for $date"
  done
}

# Execute the commits for your specified dates
make_commits "2025-11-30" 5
make_commits "2026-01-15" 7
make_commits "2026-01-16" 6
make_commits "2026-01-17" 8
make_commits "2026-01-20" 4
make_commits "2026-01-22" 6
make_commits "2026-01-25" 8
make_commits "2026-01-01" 7
make_commits "2026-02-22" 6

echo "All backdated commits have been created locally!"
