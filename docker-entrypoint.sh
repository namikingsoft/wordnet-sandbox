#!/bin/sh -eu

if [ "$1" = "server" ]; then
  exec yarn server:dev
fi

if [ "$1" = "front" ]; then
  exec yarn front:dev
fi

exec "$@"