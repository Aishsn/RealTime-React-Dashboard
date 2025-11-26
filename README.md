# Realtime Platform Analytics Dashboard (Server + React client)

 Both the environments are required to run separately 

## Quick start (locally)
1. Start server:
   ```
   cd server
   npm install
   npm start
   ```
   Server listens on `ws://localhost:4000/v1/analytics`.

2. Start client (requires create-react-app environment):
   ```
   cd client
   npm install
   npm start
   ```
   The client uses `react-scripts` and will open `http://localhost:3000` by default.

## Notes
- The server sends an initial `snapshot` to the client and then periodic `batch` updates data every 5s to the client
- The client implements reconnection/backoff and handles `snapshot`, `batch`, and individual events.
- If there is a need for client to point to a different WS URL, set `REACT_APP_URL` in the env file and use it in place of WS_URL before starting the client.
