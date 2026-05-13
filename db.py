import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "swarm_escrow.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Transactions table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        vertical TEXT,
        amount REAL,
        currency TEXT,
        status TEXT,
        buyer TEXT,
        seller TEXT,
        fraud_score REAL,
        trust_consensus REAL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Agent logs
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS agent_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tx_id TEXT,
        agent_id TEXT,
        verdict TEXT,
        score REAL,
        message TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    conn.commit()
    conn.close()

def seed_db():
    init_db()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Sample transactions
    sample_txs = [
        ('tx_9f2a', 'gig_platform', 15000.0, 'INR', 'locked', 'usr_abc', 'usr_xyz', 0.02, 0.98),
        ('tx_7b12', 'real_estate', 5000000.0, 'USD', 'disputed', 'prop_inv', 'dev_grp', 0.45, 0.65),
        ('tx_1a2c', 'ecommerce', 1250.0, 'EUR', 'released', 'buyer_88', 'shop_fast', 0.01, 0.99)
    ]
    
    for tx in sample_txs:
        cursor.execute("INSERT OR REPLACE INTO transactions (id, vertical, amount, currency, status, buyer, seller, fraud_score, trust_consensus) VALUES (?,?,?,?,?,?,?,?,?)", tx)
    
    conn.commit()
    print(f"Seeded {len(sample_txs)} transactions.")
    conn.close()

def log_agent_activity(tx_id, agent_id, verdict, score, message):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO agent_logs (tx_id, agent_id, verdict, score, message) VALUES (?, ?, ?, ?, ?)",
        (tx_id, agent_id, verdict, score, message)
    )
    conn.commit()
    conn.close()
