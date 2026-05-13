import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import { exec } from 'child_process';
import path from 'path';

// Note: In a real test we'd import the app from server.ts
// But since server.ts calls its own startServer immediately and has side effects,
// we'll just mock the key endpoints or assume the dev server is running.
// However, vitest can handle async setup.

const API_URL = 'http://localhost:3000';

describe('SwarmEscrow API Verification', () => {
  it('GET /api/swarm/status returns correct metadata', async () => {
    const res = await fetch(`${API_URL}/api/swarm/status`);
    const data = await res.json();
    
    expect(res.status).toBe(200);
    expect(data.activeAgents).toBe(1024);
    expect(data.computeLayer).toContain('CUDA');
  });

  it('GET /api/dashboard returns database records', async () => {
    const res = await fetch(`${API_URL}/api/dashboard`);
    const data = await res.json();
    
    expect(res.status).toBe(200);
    expect(Array.isArray(data.transactions)).toBe(true);
    expect(data.transactions.length).toBeGreaterThan(0);
  });

  it('POST /api/swarm/analyze triggers python intelligence layer', async () => {
    const payload = { tx_id: 'test_api_tx', vector: [0.1, 0.9, 0.5] };
    const res = await fetch(`${API_URL}/api/swarm/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.status).toBe('success');
    expect(data.consensus.trust_score).toBeDefined();
    expect(data.cuda_acceleration.available).toBe(true);
  });
});
