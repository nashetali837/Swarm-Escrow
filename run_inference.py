import sys
import json
from core import SwarmIntelligenceEngine
from cuda_wrapper import CUDAWrapper
from db import init_db, log_agent_activity

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input provided"}))
        return

    try:
        init_db()
        input_data = json.loads(sys.argv[1])
        data_vector = input_data.get("vector", [0.5, 0.5, 0.5])
        tx_id = input_data.get("tx_id", "unknown")

        # 1. Run CUDA pre-processing simulation
        trust_matrix = [data_vector for _ in range(5)]
        _, cuda_latency = CUDAWrapper.execute_kernel(trust_matrix)

        # 2. Run Swarm Intelligence Consensus
        engine = SwarmIntelligenceEngine(num_agents=12)
        consensus_result = engine.run_consensus(data_vector)

        # 3. Log results to database
        log_agent_activity(
            tx_id, 
            "SWARM_ORCHESTRATOR", 
            "CLEAR", 
            consensus_result["trust_score"], 
            f"Consensus reached via {consensus_result['iterations']} iterations. CUDA_LATENCY: {cuda_latency:.2f}ms"
        )

        # 4. Return result
        output = {
            "status": "success",
            "consensus": consensus_result,
            "cuda_acceleration": {
                "available": CUDAWrapper.is_available(),
                "latency_ms": cuda_latency
            }
        }
        print(json.dumps(output))

    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}))

if __name__ == "__main__":
    main()
