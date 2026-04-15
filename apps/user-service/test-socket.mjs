/**
 * Socket Connection Test
 * ----------------------
 * 1. Logs in via API Gateway → gets access token
 * 2. Connects to User Service socket with that token
 * 3. Verifies connection and then disconnects
 */

import { io } from 'socket.io-client';

// ── Config ──────────────────────────────────────────────────────────────────
const LOGIN_URL   = 'http://localhost:7000/api/auth/login';
const SOCKET_URL  = 'http://localhost:7002';
const EMAIL       = 'admin@example.com';
const PASSWORD    = 'Admin@123';
const TIMEOUT_MS  = 8000;

// ── Step 1: Login ────────────────────────────────────────────────────────────
console.log('\n🔐  Logging in …');
console.log(`    POST ${LOGIN_URL}`);
console.log(`    Body: { email: "${EMAIL}", password: "****" }\n`);

let token;
try {
  const res = await fetch(LOGIN_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error(`❌  Login failed [${res.status}]:`, JSON.stringify(data, null, 2));
    process.exit(1);
  }

  // Accept either data.accessToken or data.data.accessToken
  token = data.accessToken ?? data.data?.accessToken ?? data.token ?? data.data?.token;

  if (!token) {
    console.error('❌  Could not find access token in response:', JSON.stringify(data, null, 2));
    process.exit(1);
  }

  console.log('✅  Login successful!');
  console.log(`    Token (first 40 chars): ${token.slice(0, 40)}…\n`);
} catch (err) {
  console.error('❌  Login request failed:', err.message);
  process.exit(1);
}

// ── Step 2: Connect to Socket ────────────────────────────────────────────────
console.log('🔌  Connecting to Socket.IO …');
console.log(`    URL:       ${SOCKET_URL}`);
console.log(`    Transport: websocket`);
console.log(`    Auth:      token = <access token from login>\n`);

const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  auth: { token },
  timeout: TIMEOUT_MS,
});

const timer = setTimeout(() => {
  console.error(`❌  Timed out after ${TIMEOUT_MS}ms — no connection established.`);
  socket.disconnect();
  process.exit(1);
}, TIMEOUT_MS);

socket.on('connect', () => {
  clearTimeout(timer);
  console.log('✅  Socket connected successfully!');
  console.log(`    Socket ID : ${socket.id}`);
  console.log(`    Transport : ${socket.io.engine.transport.name}\n`);
  console.log('👋  Disconnecting …');
  socket.disconnect();
});

socket.on('connect_error', (err) => {
  clearTimeout(timer);
  console.error('❌  Socket connection error:', err.message);
  process.exit(1);
});

socket.on('disconnect', (reason) => {
  console.log(`\n🔒  Socket disconnected. Reason: ${reason}`);
  console.log('\n✔  Test complete.\n');
  process.exit(0);
});
