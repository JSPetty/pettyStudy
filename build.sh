#!/bin/bash
jnpm install  || exit 1
npm run build  || exit 1
mkdir output  || exit 1
ls |grep -v "^output" |xargs -I{} cp -r '{}' output  || exit 1
exit 0

