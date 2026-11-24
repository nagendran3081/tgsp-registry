// Parses HRMS "Personal Registry" PDF using positioned text items from pdf.js.
const SEC_HEADS={'Personal Details':'personal','Leave Balance':'lb','Education Details':'edu','Dependent Details':'dep','Posting Details':'pst','Attachment Details':'att','Promotions Details':'prm','Probation Details':'prb','Rewards Details':'rwd','Penalty Details':'pen','Training Details':'trn','Skills Details':'skl','Language Details':'lng','Payment Bank Details':'bnk','Earned Leave Details':'el','Half Pay Leave Details':'hpl','Surrender Leave Details':'sur','Extra Ordinary Leave Details':'eol','Leave Travel Concession Details':'ltc','Sick Settlement Details':'sick','Special Casual Leave Details':'scl','Grievance Details':'grv','Increment':'inc','TSGLI No Details':'tsg','Vaccination Details':'vac','PRC Details':'prc','Employee Absent Reporting Details':'abs'};
const IDXMAP={prc:[2,5,6,7,8,9,10,11,12,13]};

function pdfClean(v){return String(v||'').replace(/&#64;/g,'@').replace(/<br\s*\/?>/gi,' ').replace(/\s+/g,' ').trim()}
function joinPieces(pieces,isDate){let out='';
for(const p of pieces){const t=p.trim();if(!t)continue;if(!out){out=t;continue}
if(/[A-Za-z]\d{3,}$/.test(out)&&/^\d/.test(t)){const mm=/^(\d+)(.*)$/.exec(t);out+=mm[1]+(mm[2].trim()?' '+mm[2].trim():'');continue}
if(isDate||/[-\/]$/.test(out)||(/\d$/.test(out)&&/^\d+$/.test(t))||(/[A-Za-z]$/.test(out)&&(/^[a-z]$/.test(t)||/^[a-z]\)\.?$/.test(t)))||/^[.,;:]$/.test(t))out+=t;else out+=' '+t}
return out.replace(/\bConst able\b/g,'Constable').replace(/Spl\.P olice/g,'Spl.Police').replace(/TRANSF ER/g,'TRANSFER').replace(/Correcti on/g,'Correction')}
const dash=v=>/^[-\s]{1,8}$/.test(v)?'':v;

function parseRegistry(pages){
const all=[];pages.forEach((pg,pi)=>pg.forEach(it=>{if(it.s&&it.s.trim())all.push({s:it.s,x:it.x,w:it.w||0,g:it.y-pi*10000})}));
all.sort((a,b)=>b.g-a.g||a.x-b.x);
const heads=all.map((it,i)=>({it,i,key:SEC_HEADS[it.s.trim()]})).filter(h=>h.key&&(h.it.x<130));
const secs={};
heads.forEach((h,k)=>{const end=k+1<heads.length?heads[k+1].i:all.length;(secs[h.key]=secs[h.key]||[]).push(...all.slice(h.i+1,end))});
const out={personal:null,tables:{}};
// ---- personal ----
const ps=secs.personal||[];const labels=ps.filter(it=>it.x<120&&/^\d{1,2}\.\s*\S/.test(it.s)).sort((a,b)=>b.g-a.g);
const vals=ps.filter(it=>it.x>=150);
const byL=labels.map(l=>({n:+/^(\d{1,2})\./.exec(l.s)[1],g:l.g,pieces:[]}));
vals.forEach(v=>{let best=null;byL.forEach(l=>{if(l.g>=v.g-2&&(!best||l.g<best.g))best=l});if(best)best.pieces.push(v)});
const P0=SH[0][2],row=P0.map(()=>''),setv=(id,v)=>{const j=P0.findIndex(c=>c[0]==id);if(j>=0)row[j]=P0[j][2]=='d'?nd(v):v};
byL.forEach(l=>{l.pieces.sort((a,b)=>b.g-a.g||a.x-b.x);let v=pdfClean(joinPieces(l.pieces.map(p=>p.s),false)).replace(/^:\s*/,'').replace(/(\d)-\s+(\d)/g,'$1-$2');v=dash(v);
if(l.n==12){const m=v.split('&').map(x=>x.trim());setv('phone',m[0]||'');setv('cug',m[1]||'')}else{const f=P[l.n<12?l.n-1:l.n];if(f)setv(f[0],v)}});
if(!row[0])return out;out.personal=row;const id=row[0];
// ---- tables ----
for(const key of Object.keys(secs)){if(key=='personal')continue;const sh=SH.find(s=>s[0]==key);if(!sh)continue;
if(key=='vac'||key=='prc')continue;const items=secs[key];if(items.some(it=>/^No Data Available/i.test(it.s)))continue;
if(!items.length)continue;const m=Math.min(...items.map(i=>i.x));
const starts=items.filter(it=>Math.abs(it.x-m)<=3&&/^\d+$/.test(it.s.trim()));if(!starts.length)continue;
const hdr=items.filter(it=>it.g>starts[0].g+4);const topG=hdr.length?Math.max(...hdr.map(h=>h.g)):0;
const hdrTop=hdr.filter(h=>h.g>=topG-3).sort((a,b)=>a.x-b.x);let colX=hdrTop.map(h=>h.x);const colC=hdrTop.map(h=>h.x+h.w/2);
const dataItems=items.filter(it=>it.g<=starts[0].g+4);
const cols=sh[2].slice(1);const idxMap=IDXMAP[key]||cols.map((c,i)=>i);
const rows=[];
starts.forEach((st,k)=>{const lo=k+1<starts.length?starts[k+1].g+4:-1e9,hi=st.g+4;
const its=dataItems.filter(it=>it.g<=hi&&it.g>lo&&!(Math.abs(it.x-m)<=3&&it===st));
const cells={};
if(key=='lb'){const nums=its.filter(i=>/^\d+$/.test(i.s.trim())).sort((a,b)=>a.x-b.x).map(i=>i.s.trim());rows.push(nums);return}
its.forEach(it=>{let j;if(colX.length>=2){const ic=it.x+it.w/2;j=1;for(let c=1;c<colC.length-1;c++){if(ic>=(colC[c]+colC[c+1])/2)j=c+1}}else j=1;(cells[j]=cells[j]||[]).push(it)});
const vals=[];for(let c=1;c<=Math.max(colX.length-1,cols.length);c++){const arr=(cells[c]||[]).sort((a,b)=>b.g-a.g||a.x-b.x).map(i=>i.s);const ci=idxMap.indexOf(c-1);const isD=ci>=0&&cols[ci]&&cols[ci][2]=='d';vals[c-1]=dash(pdfClean(joinPieces(arr,isD)))}
const r=[id].concat(cols.map((c,i)=>{const src=IDXMAP[key]?IDXMAP[key][i]:i;let v=vals[src]||'';return c[2]=='d'?nd(v.replace(/\s*-+$/,'')):v}));
if(r.slice(1).some(v=>v))rows.push(r)});
if(key=='lb'){out.tables.lb=rows.filter(r=>r.length).map(n=>[id,n[0]||'',n[1]||'',n[2]||'',n[3]||'']);continue}
if(rows.length)out.tables[key]=rows}
return out}

async function pdfToPages(pdfjs,buf){const pdf=await pdfjs.getDocument({data:buf,isEvalSupported:false,verbosity:0}).promise;const pages=[];
for(let p=1;p<=pdf.numPages;p++){const c=await(await pdf.getPage(p)).getTextContent();pages.push(c.items.filter(i=>i.str&&i.str.trim()).map(i=>({s:i.str,x:Math.round(i.transform[4]),y:Math.round(i.transform[5]),w:Math.round(i.width)})))}
return pages}
