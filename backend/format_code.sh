#!/bin/bash

find . | egrep ".go$" | xargs gofmt -s -w
