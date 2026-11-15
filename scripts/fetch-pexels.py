#!/usr/bin/env python3
"""Download Pexels CDN images by photo id into a target directory.

Usage: python3 scripts/fetch-pexels.py <out-dir> <id> [<id> ...]
Only fetches images.pexels.com; writes <id>.jpg and skips existing valid files.
"""
import os
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
      "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36")
TPL = "https://images.pexels.com/photos/{i}/pexels-photo-{i}.jpeg?auto=compress&cs=tinysrgb&w=1400"


def fetch(out_dir: str, pid: str) -> str:
    path = os.path.join(out_dir, f"{pid}.jpg")
    if os.path.exists(path) and os.path.getsize(path) > 20000:
        return f"skip {pid}"
    req = urllib.request.Request(TPL.format(i=pid), headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()
        if len(data) < 5000:
            return f"small {pid} {len(data)}"
        with open(path, "wb") as f:
            f.write(data)
        return f"ok {pid} {len(data)}"
    except Exception as e:  # noqa: BLE001 - report and continue
        return f"ERR {pid} {e}"


def main() -> int:
    if len(sys.argv) < 3:
        print(__doc__)
        return 1
    out_dir = sys.argv[1]
    os.makedirs(out_dir, exist_ok=True)
    ids = sys.argv[2:]
    with ThreadPoolExecutor(max_workers=8) as pool:
        for line in pool.map(lambda i: fetch(out_dir, i), ids):
            print(line)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
