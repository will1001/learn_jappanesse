#!/bin/bash

echo "========================================"
echo "  Japanese Text Parser - Quick Start"
echo "========================================"
echo ""
echo "Starting servers..."
echo ""
echo "1. Backend Server: http://localhost:3001"
echo "2. Frontend GUI:   http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    jobs -p | xargs kill
    exit 0
}

# Set trap for cleanup
trap cleanup SIGINT SIGTERM

# Start backend server
node src/server.js &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend server
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 5

# Open browser
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:3000
elif command -v open > /dev/null; then
    open http://localhost:3000
elif command -v start > /dev/null; then
    start http://localhost:3000
fi

echo ""
echo "✅ Both servers are running!"
echo "🌐 Browser should open automatically"
echo ""
echo "Keep this terminal open. Press Ctrl+C to stop all servers."
echo ""

# Wait for background jobs
wait