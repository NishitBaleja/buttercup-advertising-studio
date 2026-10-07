#!/bin/bash
# Script to restore the saved working state
set -e
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

echo "Restoring project to savepoint..."
if git rev-parse --verify savepoint-working >/dev/null 2>&1; then
    git checkout -f savepoint-working
    echo "Successfully restored via git tag 'savepoint-working'."
elif [ -f .backups/oddlymade_working_savepoint.tar.gz ]; then
    tar -xzf .backups/oddlymade_working_savepoint.tar.gz
    echo "Successfully restored via archive backup."
else
    echo "No savepoint found!"
    exit 1
fi
