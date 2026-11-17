// Meu Dia — funciona offline. Versão 2037a2a6c7
const CACHE="meudia-2037a2a6c7";
const CORE=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png"];
self.addEventListener("install",e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())); });
self.addEventListener("activate",e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&k!=="meudia-fonts").map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET") return;
  const u=new URL(r.url);
  if(u.hostname==="fonts.googleapis.com"||u.hostname==="fonts.gstatic.com"){
    e.respondWith(caches.open("meudia-fonts").then(c=>c.match(r).then(hit=>hit||fetch(r).then(res=>{ c.put(r,res.clone()); return res; }).catch(()=>hit))));
    return;
  }
  if(u.origin!==location.origin) return;
  // página: rede primeiro (pega atualização), cai pro cache sem internet
  if(r.mode==="navigate"){
    e.respondWith(fetch(r).then(res=>{ const cp=res.clone(); caches.open(CACHE).then(c=>c.put("index.html",cp)); return res; }).catch(()=>caches.match("index.html").then(x=>x||caches.match("./"))));
    return;
  }
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{ const cp=res.clone(); caches.open(CACHE).then(c=>c.put(r,cp)); return res; })));
});
