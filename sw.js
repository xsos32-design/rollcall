const C='rollcall-v12';
const CORE=['./','./rollcall.html','./art.png','./manifest.json'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>Promise.allSettled(CORE.map(u=>c.add(u)))))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
  const isDoc=r.mode==='navigate'||r.destination==='document'||r.url.endsWith('.html')||r.url.endsWith('/');
  if(isDoc){e.respondWith(fetch(r).then(resp=>{const cp=resp.clone();caches.open(C).then(c=>c.put('./rollcall.html',cp));return resp}).catch(()=>caches.match('./rollcall.html').then(m=>m||caches.match(r))))}
  else{e.respondWith(caches.match(r).then(m=>m||fetch(r).then(resp=>{const cp=resp.clone();caches.open(C).then(c=>c.put(r,cp));return resp}).catch(()=>m)))}
});
