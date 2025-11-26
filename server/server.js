const WebSocket = require('ws');

const PORT = 4000;
const PATH = '/v1/analytics';
const wss = new WebSocket.Server({ port: PORT, path: PATH }, () => {
  console.log(`WebSocket server on ws://localhost:${PORT}${PATH}`);     //creating server, allowing multiple clients to connect -ASN
});

function rand(min, max){ return Math.floor(Math.random()*(max-min+1))+min; } //helps generate random numbers to behave like realtime data - ASN

const SENSOR_TYPES = [
  "Temperature",
  "Humidity",
  "Motion",
  "Air Quality",
  "Wetness",
  "Bin Monitor",
  "Soap Level",
  "Paper Towel Monitor"
]; //metrics - ASN

function initialTimestamp(){ return Date.now(); }  //timestamp generator - ASN

function generateInitialLoadData(){     // function to generate data on first load - ASN
  const now = initialTimestamp();
  const types = {};
  SENSOR_TYPES.forEach(t => types[t] = rand(100, 1500));
  return {
    timestamp: now,
    users: {
      totalActive: rand(80,220),
      platforms: { web: rand(40,140), mobile: rand(20,80), tablet: rand(0,30) }
    },
    apiRejectionsLast5Min: rand(0,12),
    newProjectsLast7Days: rand(0,25),
    totalLiveProjects: rand(5,260),
    sensorTypeObj: {
      activeCampaigns: rand(10,80),
      inactiveCampaigns: rand(0,10),
      types
    },
    trends: {
      activeUsers: Array.from({length:30}).map((_,i)=>({ time: now - (29-i)*5000, value: rand(80,220) })),
      apiRejections: Array.from({length:30}).map((_,i)=>({ time: now - (29-i)*5000, value: rand(0,6) })),
      projectsWeekly: Array.from({length:4}).map((_,i)=>({ week: `W-${4-i}`, value: rand(0,15) }))
    },
    modules: [
      { name: 'Dashboard', currentVersion: '2.1.0', lastDeployed: '2025-11-18', upcomingVersion: '2.2.0', estimatedRelease: '2025-12-05' },
    ]
  };
}

let state = generateInitialLoadData();

function passData(type, payload){
  return JSON.stringify({
    type,
    meta: { version: "1.0", timestamp: Date.now() },
    payload
  });
}

function mutateState(s){        // real-time update - ASN

  const total = Math.max(0, s.users.totalActive + rand(-6,8));
  const platforms = {
    web: Math.max(0, s.users.platforms.web + rand(-4,6)),
    mobile: Math.max(0, s.users.platforms.mobile + rand(-3,5)),
    tablet: Math.max(0, s.users.platforms.tablet + rand(-2,3))
  };
  const newPoint = { time: Date.now(), value: total };
  const apiPoint = { time: Date.now(), value: Math.max(0, s.trends.apiRejections[s.trends.apiRejections.length-1].value + rand(-1,2)) };

  const types = { ...s.sensorTypeObj.types };
  const k = SENSOR_TYPES[rand(0, SENSOR_TYPES.length-1)];
  types[k] = Math.max(0, types[k] + rand(-10,40));

  const projectsWeekly = s.trends.projectsWeekly.map((p, idx) =>
    idx === s.trends.projectsWeekly.length - 1 ? { ...p, value: Math.max(0, p.value + rand(0,3)) } : p
  );

  return {
    ...s,
    timestamp: Date.now(),
    users: { totalActive: total, platforms },
    apiRejectionsLast5Min: Math.max(0, s.apiRejectionsLast5Min + rand(-1,2)),
    newProjectsLast7Days: Math.max(0, s.newProjectsLast7Days + rand(0,1)),
    totalLiveProjects: Math.max(0, s.totalLiveProjects + rand(0,2)),
    sensorTypeObj: { ...s.sensorTypeObj, types },
    trends: {
      ...s.trends,
      activeUsers: [...s.trends.activeUsers.slice(1), newPoint],
      apiRejections: [...s.trends.apiRejections.slice(1), apiPoint],
      projectsWeekly
    }
  };
}

function broadcast(msg){    // sends data to client - ASN
  wss.clients.forEach(c => {
    if(c.readyState === WebSocket.OPEN) c.send(msg);
  });

}

wss.on('connection', (ws, req) => {     
  // sends snapshot to the client as soon as connection is made, since there is no data, server sends the current full analytics - ASN
  console.log('Client connected to server');
  try {
    ws.send(passData('snapshot', state));
  } catch(e){ console.error('send snapshot err', e); }

  ws.on('message', (m) => {   // resync request from client, when server needs to send the data snapshot again - ASN
    try {
      const obj = JSON.parse(m.toString());
      if(obj && obj.type === 'resyncRequest'){
        ws.send(passData('snapshot', state));
      }
    } catch(e){}
  });

  ws.on('close', ()=> console.log('Client disconnected'));
});

setInterval(()=> {
  state = mutateState(state);
  const batch = [
    { type: 'activeUsers', meta: { version:'1.0', timestamp: Date.now() }, payload: { timestamp: Date.now(), totalActive: state.users.totalActive, platforms: state.users.platforms } },
    { type: 'sensorType', meta: { version:'1.0', timestamp: Date.now() }, payload: state.sensorTypeObj.types },
    { type: 'apiRejections', meta: { version:'1.0', timestamp: Date.now() }, payload: { timestamp: Date.now(), count: state.trends.apiRejections[state.trends.apiRejections.length-1].value } },
    { type: 'sensorStatus', meta: { version:'1.0', timestamp: Date.now() }, payload: { active: state.sensorTypeObj.activeCampaigns, inactive: state.sensorTypeObj.inactiveCampaigns } }
  ];
  broadcast(JSON.stringify({ type: 'batch', meta: { version:'1.0', timestamp: Date.now() }, payload: batch }));
}, 5000);   // after the connection is made, server sends updated data every 5 seconds - ASN

// setInterval(()=> {
//   broadcast(JSON.stringify({ type: 'systemHealth', meta: { version:'1.0', timestamp: Date.now() }, payload: { status: 'healthy', latencyMs: rand(20,200) } }));
// }, 30000);
