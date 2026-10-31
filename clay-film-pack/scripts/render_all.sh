#!/bin/sh
# Usage: render_all.sh <pack_root> [--full]; geometry test, proof+pilot, optional full render, validators.
cd "${1:?pack root}" || exit 1
node --test scripts/check_clay_geometry.mjs || exit 1
.venv/bin/python clay/full/render.py --proof --pilot || exit 1
[ "$2" = "--full" ] && { .venv/bin/python clay/full/render.py --render || exit 1; }
.venv/bin/python scripts/validate_pack.py && .venv/bin/python scripts/validate.py
