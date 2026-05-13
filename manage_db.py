import sys
import json
import sqlite3
from db import DB_PATH, seed_db

def get_dashboard():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM transactions ORDER BY created_at DESC")
    transactions = [dict(row) for row in cursor.fetchall()]
    
    cursor.execute("SELECT * FROM agent_logs ORDER BY timestamp DESC LIMIT 50")
    logs = [dict(row) for row in cursor.fetchall()]
    
    conn.close()
    return {"transactions": transactions, "logs": logs}

if __name__ == "__main__":
    if len(sys.argv) > 1:
        cmd = sys.argv[1]
        if cmd == "seed":
            seed_db()
            print(json.dumps({"status": "seeded"}))
        elif cmd == "dashboard":
            print(json.dumps(get_dashboard()))
    else:
        print(json.dumps({"error": "No command provided"}))
