import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { exec } from "child_process";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import firebaseConfig from "./firebase-applet-config.json";

// Initialize Firebase Admin
let db: any;
try {
  const app = admin.initializeApp({
    projectId: firebaseConfig.projectId,
  });
  // Prefer the provided database ID, fall back to (default)
  const dbId = firebaseConfig.firestoreDatabaseId || "(default)";
  db = getFirestore(app, dbId);
  console.log(`Firebase Admin initialized with DB: ${dbId}`);
} catch (e) {
  console.error("Firebase Admin init failed:", e);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API: Get Swarm Status
  app.get("/api/swarm/status", (req, res) => {
    res.json({
      activeAgents: 1024,
      regions: ["ap-south-1", "eu-west-1", "us-east-1", "br-1", "sg-1"],
      tps: 10240,
      fraudScore: 0.002,
      lastSync: new Date().toISOString(),
      computeLayer: "CUDA_ACTIVE (92.4% UTIL)",
    });
  });

  // API: Run Swarm Inference (Calls Python Swarm Engine)
  app.post("/api/swarm/analyze", (req, res) => {
    const inputData = JSON.stringify(req.body);
    const pythonScript = path.join(process.cwd(), "swarm_engine", "run_inference.py");
    
    const command = `PYTHONPATH=${path.join(process.cwd(), "swarm_engine")} python3 ${pythonScript} '${inputData.replace(/'/g, "'\\''")}'`;

    exec(command, async (error, stdout, stderr) => {
      if (error) {
        console.error(`Exec error: ${error}`);
        return res.status(500).json({ error: "Intelligence Layer Failure", details: stderr });
      }
      try {
        const result = JSON.parse(stdout);
        
        // Persist to Firestore
        if (result.status === "success" && req.body.tx_id) {
          const txId = req.body.tx_id;
          
          await db.collection("agent_logs").add({
            txId: txId,
            agentId: "SWARM_ORCHESTRATOR",
            verdict: result.consensus.trust_score > 0.8 ? "CLEAR" : "ALERT",
            score: result.consensus.trust_score,
            message: result.message,
            timestamp: new Date().toISOString()
          });

          // Update transaction trust consensus if it exists
          try {
             await db.collection("transactions").doc(txId).update({
               trustConsensus: result.consensus.trust_score,
               updatedAt: new Date().toISOString()
             });
          } catch (e) {
            // Transaction might not exist, that's fine for simple logs
          }
        }

        res.json(result);
      } catch (e) {
        res.status(500).json({ error: "Mismatched Logic Output", raw: stdout });
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SwarmEscrow Server running on http://localhost:${PORT}`);
  });
}

startServer();
