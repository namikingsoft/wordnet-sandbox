#!/bin/sh -eu

if [ "$1" = "server" ]; then
  exec yarn server:start
fi

if [ "$1" = "front" ]; then
  exec yarn front:start
fi

exec "$@"