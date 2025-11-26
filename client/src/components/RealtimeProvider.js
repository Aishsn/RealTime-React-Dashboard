import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const WS_URL = 'ws://localhost:4000/v1/analytics'; 
// we can give the url if it is present in the env file, for ex:process.env.REACT_APP_URL - ASN
const DataContext = createContext(null);

export function RealtimeProvider({ children }){
  const wsRef = useRef(null);
  const [state, setState] = useState(null);
  const [connected, setConnected] = useState(false);
  const reconnectRef = useRef({ attempts:0, timer:null });

  useEffect(()=> {
    let mounted = true;

    function connect(){
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        reconnectRef.current.attempts = 0;
        setConnected(true);
        console.log('WS connected');
      };

      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          if(!msg || !msg.type) return;
          if(msg.type === 'snapshot'){
            setState(msg.payload);
            return;
          }
          if(msg.type === 'batch' && Array.isArray(msg.payload)){
            msg.payload.forEach(handleEvent);
            return;
          }
          handleEvent(msg);
        } catch(e){
          console.error('Invalid WS message', e);
        }
      };

      ws.onclose = () => {
        setConnected(false);
        console.log('WS closed, attempting reconnect');
        if(!mounted) return;
        reconnectRef.current.attempts += 1;
        const delay = Math.min(30000, 1000 * Math.pow(1.5, reconnectRef.current.attempts));
        reconnectRef.current.timer = setTimeout(connect, delay + Math.floor(Math.random()*500));
      };

      ws.onerror = (e) => { console.error('WS error', e); ws.close(); };
    }

    function handleEvent(msg){
      const t = msg.type;
      const p = msg.payload;
      setState(prev => {
        if(!prev) return prev;
        const copy = JSON.parse(JSON.stringify(prev)); 
        switch(t){
          case 'activeUsers':
            copy.users.totalActive = p.totalActive;
            copy.users.platforms = p.platforms;
            copy.trends.activeUsers = [...copy.trends.activeUsers.slice(1), { time: p.timestamp, value: p.totalActive }];
            return copy;
          case 'apiRejections':
            copy.trends.apiRejections = [...copy.trends.apiRejections.slice(1), { time: p.timestamp, value: p.count }];
            copy.apiRejectionsLast5Min = p.count;
            return copy;
          case 'sensorType':
            copy.sensorTypeObj.types = { ...copy.sensorTypeObj.types, ...p };
            return copy;
          case 'sensorStatus':
            copy.sensorTypeObj.activeCampaigns = p.active;
            copy.sensorTypeObj.inactiveCampaigns = p.inactive;
            return copy;
          case 'moduleUpdate':
            {
              const idx = copy.modules.findIndex(m=>m.name===p.name);
              if(idx>=0) copy.modules[idx] = { ...copy.modules[idx], ...p };
              else copy.modules.push(p);
            }
            return copy;
          case 'projectsWeeklyUpdate':
            {
              const last = copy.trends.projectsWeekly;
              copy.trends.projectsWeekly = [...last.slice(1), { week: p.week, value: p.value }];
            }
            return copy;
          // case 'systemHealth':
          //   copy._systemHealth = p;
          //   return copy;
          default:
            return copy;
        }
      });
    }

    connect();

    return ()=> {
      mounted = false;
      if(reconnectRef.current.timer) clearTimeout(reconnectRef.current.timer);
      try{ wsRef.current && wsRef.current.close(); }catch(e){}
    };
  }, []);

  return <DataContext.Provider value={{ state, connected }}>{children}</DataContext.Provider>
}

export const useRealtime = ()=> useContext(DataContext);