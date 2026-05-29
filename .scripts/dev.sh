#!/bin/bash
npm run start &
BACKEND_PID=$!
npm run client
kill $BACKEND_PID 2>/dev/null
