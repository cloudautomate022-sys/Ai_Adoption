"""Run the API with ``python -m app``.

Honours HOST/PORT from the environment, which is exactly what Render, Fly.io
and similar platforms expect.
"""

from __future__ import annotations

import uvicorn

from .config import HOST, PORT


def main() -> None:
    uvicorn.run("app.main:app", host=HOST, port=PORT)


if __name__ == "__main__":
    main()
