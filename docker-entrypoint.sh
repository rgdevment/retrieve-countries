#!/bin/sh
set -e

# Fix ownership of mounted volume (runs as root)
chown -R app:app /app/data

# Create indexes if needed (read-write, as app)
su -s /bin/sh app -c "node dist/database/ensure-indexes.js"

# Start server (readonly, as app)
exec su -s /bin/sh app -c "node dist/main"
