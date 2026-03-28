#!/bin/bash

# Trap SIGINT and SIGTERM to kill background processes on exit
trap 'kill 0' SIGINT SIGTERM

echo "Starting server and client..."

# Start the server in the background
(cd server && npm run dev) &

# Start the client in the background
(cd client && npm run dev) &

# Wait for all background processes to finish
wait
