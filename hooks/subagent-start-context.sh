#!/bin/bash
# SubagentStart Hook: Remind subagent to use environment variables

cat << EOFOUT
{
  "hookSpecificOutput": {
    "hookEventName": "SubagentStart",
    "additionalContext": "Read .claude/settings.local.json and use the environment variables defined in the env section."
  }
}
EOFOUT

exit 0
