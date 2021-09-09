#!/bin/bash

if [ "$#" -gt 1 ]; then
    echo "Usage: bash run_server.sh <mode> (where mode is production or dev or none for dev)"
    exit
elif [[ $1 == "production" ]]; then
    export GIN_MODE=release
fi

go run server.go
