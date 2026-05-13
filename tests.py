import unittest
import json
import os
import sqlite3
from core import SwarmIntelligenceEngine
from cuda_wrapper import CUDAWrapper
from db import DB_PATH, init_db, log_agent_activity

class TestSwarmEngine(unittest.TestCase):
    def setUp(self):
        # Ensure a clean state for DB tests
        if os.path.exists(DB_PATH):
            os.remove(DB_PATH)
        init_db()

    def test_swarm_consensus(self):
        engine = SwarmIntelligenceEngine(num_agents=5)
        data_vector = [0.1, 0.2, 0.3]
        result = engine.run_consensus(data_vector, iterations=5)
        
        self.assertIn("trust_score", result)
        self.assertIsInstance(result["trust_score"], float)
        self.assertEqual(result["agent_count"], 5)
        self.assertTrue(0 <= result["trust_score"] <= 1.0)

    def test_cuda_wrapper_sim(self):
        self.assertTrue(CUDAWrapper.is_available())
        data = [[0.1, 0.2], [0.3, 0.4]]
        processed, latency = CUDAWrapper.execute_kernel(data)
        self.assertEqual(len(processed), 2)
        self.assertGreater(latency, 0)

    def test_database_logging(self):
        log_agent_activity("tx_test", "AGENT_X", "CLEAR", 0.95, "Test Message")
        
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM agent_logs WHERE tx_id='tx_test'")
        row = cursor.fetchone()
        conn.close()
        
        self.assertIsNotNone(row)
        self.assertEqual(row[2], "AGENT_X")
        self.assertEqual(row[3], "CLEAR")

if __name__ == '__main__':
    unittest.main()
