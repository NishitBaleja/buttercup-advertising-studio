#!/bin/bash
# Script to restore a saved working state
set -e
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

TARGET="${1:-latest}"

echo "Restoring project to savepoint: $TARGET..."

if [ "$TARGET" = "oddlymade" ] || [ "$TARGET" = "original" ]; then
    if git rev-parse --verify savepoint-working >/dev/null 2>&1; then
        git checkout -f savepoint-working
        echo "Successfully restored via git tag 'savepoint-working' (Oddly Made replica)."
    elif [ -f .backups/oddlymade_working_savepoint.tar.gz ]; then
        tar -xzf .backups/oddlymade_working_savepoint.tar.gz
        echo "Successfully restored via archive backup 'oddlymade_working_savepoint.tar.gz'."
    fi
else
    # Default to latest (Buttercup Advertising Studio)
    if git rev-parse --verify savepoint-latest >/dev/null 2>&1; then
        git checkout -f savepoint-latest
        echo "Successfully restored via git tag 'savepoint-latest' (Buttercup Advertising Studio with BAS hero)."
    elif [ -f .backups/latest_savepoint.tar.gz ]; then
        tar -xzf .backups/latest_savepoint.tar.gz
        echo "Successfully restored via archive backup 'latest_savepoint.tar.gz'."
    else
        echo "No savepoint found!"
        exit 1
    fi
fi

