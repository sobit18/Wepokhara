import subprocess
from datetime import datetime, timedelta
import random
import os
import tempfile

# Date range
start_date = datetime(2025, 11, 15)
end_date   = datetime(2026, 2, 15)

# Generate workdays (Mon–Fri only)
workdays = []
current = start_date
while current <= end_date:
    if current.weekday() < 5:
        workdays.append(current)
    current += timedelta(days=1)

# Get commits oldest → newest
commits = subprocess.check_output(
    ["git", "rev-list", "--reverse", "HEAD"]
).decode().strip().split("\n")

print(f"Workdays available : {len(workdays)}")
print(f"Commits to rewrite : {len(commits)}")

# Build commit → date mapping
commit_date_map = {}
for i, commit in enumerate(commits):
    if i >= len(workdays):
        break
    day = workdays[i]
    h = random.randint(9, 17)
    m = random.randint(0, 59)
    s = random.randint(0, 59)
    dt = day.replace(hour=h, minute=m, second=s)
    commit_date_map[commit] = dt.strftime("%Y-%m-%dT%H:%M:%S")

# Write the filter script to a TEMP FILE (fixes Windows quoting issues)
script_lines = ["#!/bin/sh"]
for commit, date_str in commit_date_map.items():
    script_lines.append(
        f'if [ "$GIT_COMMIT" = "{commit}" ]; then\n'
        f'  export GIT_AUTHOR_DATE="{date_str}"\n'
        f'  export GIT_COMMITTER_DATE="{date_str}"\n'
        f'fi'
    )

# Save to a file in the repo directory
script_path = os.path.join(os.getcwd(), "filter_script.sh").replace("\\", "/")
with open(script_path, "w", newline="\n") as f:  # newline="\n" forces Unix line endings!
    f.write("\n".join(script_lines))

print(f"\n⏳ Running filter-branch using script file...")

# Set env to suppress the warning
env = os.environ.copy()
env["FILTER_BRANCH_SQUELCH_WARNING"] = "1"

subprocess.run(
    ["git", "filter-branch", "-f", "--env-filter", f". '{script_path}'", "--", "--all"],
    check=True,
    env=env
)

# Cleanup
os.remove(script_path)

print("\n✅ Done! Now force push:")
print("   git push origin main --force")
