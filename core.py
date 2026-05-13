import math
import random
from typing import List, Dict

class SwarmAgent:
    """Represents an intelligent agent in the trust swarm."""
    def __init__(self, agent_id: str, dimension: int):
        self.agent_id = agent_id
        self.position = [random.random() for _ in range(dimension)]
        self.velocity = [random.uniform(-0.1, 0.1) for _ in range(dimension)]
        self.best_position = list(self.position)
        self.best_score = float('-inf')

class SwarmIntelligenceEngine:
    """
    Implements a Trust Consensus Algorithm based on Particle Swarm Optimization (PSO).
    Used to reach consensus on transaction validity across 1000+ agents.
    """
    def __init__(self, num_agents: int = 12):
        self.num_agents = num_agents
        self.dimension = 3  # Sentiment, Behavioral, Metadata validity
        self.agents = [SwarmAgent(f"AGENT_{i:03}", self.dimension) for i in range(num_agents)]
        self.global_best_position = [0.5] * self.dimension
        self.global_best_score = float('-inf')

    def evaluate_fitness(self, position: List[float], data_vector: List[float]) -> float:
        """Calculates trust score based on distance from training centroids (simulated)."""
        # Simulated trust calculation algorithm
        dist = sum((p - d)**2 for p, d in zip(position, data_vector))
        return 1.0 / (1.0 + math.sqrt(dist))

    def run_consensus(self, data_vector: List[float], iterations: int = 10) -> Dict:
        """Runs the swarm to reach consensus on a Trust Score."""
        w, c1, c2 = 0.5, 1.5, 1.5  # PSO hyperparameters
        
        for _ in range(iterations):
            for agent in self.agents:
                score = self.evaluate_fitness(agent.position, data_vector)
                
                if score > agent.best_score:
                    agent.best_score = score
                    agent.best_position = list(agent.position)
                    
                if score > self.global_best_score:
                    self.global_best_score = score
                    self.global_best_position = list(agent.position)
            
            # Update velocities and positions
            for agent in self.agents:
                for i in range(self.dimension):
                    r1, r2 = random.random(), random.random()
                    agent.velocity[i] = (w * agent.velocity[i] + 
                                       c1 * r1 * (agent.best_position[i] - agent.position[i]) +
                                       c2 * r2 * (self.global_best_position[i] - agent.position[i]))
                    agent.position[i] += agent.velocity[i]
        
        return {
            "trust_score": round(self.global_best_score, 4),
            "consensus_position": self.global_best_position,
            "agent_count": self.num_agents,
            "iterations": iterations
        }
