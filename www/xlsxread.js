// Minimal .xlsx reader (no libraries). Returns {sheetName: string[][]}. Needs DecompressionStream('deflate-raw').
async function xlsxRead(buf){
const u8=new Uint8Array(buf),dv=new DataView(buf),td=new TextDecoder('utf-8');
let e=-1;for(let i=u8.length-22;i>=Math.max(0,u8.length-70000);i--){if(dv.getUint32(i,true)==0x06054b50){e=i;break}}
if(e<0)throw new Error('ఇది .xlsx file కాదు (.xls అయితే Excel లో "Save as .xlsx" చేయండి)');
const n=dv.getUint16(e+10,true);let p=dv.getUint32(e+16,true);const files={};
for(let k=0;k<n;k++){if(dv.getUint32(p,true)!=0x02014b50)break;const meth=dv.getUint16(p+10,true),cs=dv.getUint32(p+20,true),nl=dv.getUint16(p+28,true),el=dv.getUint16(p+30,true),cl=dv.getUint16(p+32,true),lo=dv.getUint32(p+42,true);
const name=td.decode(u8.subarray(p+46,p+46+nl));files[name]={meth,cs,lo};p+=46+nl+el+cl}
async function get(name){const f=files[name];if(!f)return null;const lh=f.lo,ds=lh+30+dv.getUint16(lh+26,true)+dv.getUint16(lh+28,true),raw=u8.subarray(ds,ds+f.cs);
if(f.meth==0)return td.decode(raw);
const st=new Blob([raw]).stream().pipeThrough(new DecompressionStream('deflate-raw'));return td.decode(await new Response(st).arrayBuffer())}
const dec=s=>s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&#(\d+);/g,(m,d)=>String.fromCharCode(+d)).replace(/&#x([0-9a-f]+);/gi,(m,h)=>String.fromCharCode(parseInt(h,16))).replace(/&amp;/g,'&');
const wb=await get('xl/workbook.xml'),rels=await get('xl/_rels/workbook.xml.rels');if(!wb||!rels)throw new Error('Workbook చదవలేకపోయాను');
const relMap={};for(const m of rels.matchAll(/<Relationship\b[^>]*>/g)){const id=/\bId="([^"]*)"/.exec(m[0]),t=/\bTarget="([^"]*)"/.exec(m[0]);if(id&&t)relMap[id[1]]=t[1]}
const sst=[];const ss=await get('xl/sharedStrings.xml');
if(ss)for(const m of ss.matchAll(/<si\b[^>]*>([\s\S]*?)<\/si>/g)){const body=m[1].replace(/<rPh\b[\s\S]*?<\/rPh>/g,'');let t='';for(const x of body.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g))t+=x[1];sst.push(dec(t))}
const fmts={};const sty=await get('xl/styles.xml');const xfs=[];
if(sty){for(const m of sty.matchAll(/<numFmt\b[^>]*>/g)){const i=/numFmtId="(\d+)"/.exec(m[0]),c=/formatCode="([^"]*)"/.exec(m[0]);if(i&&c)fmts[i[1]]=dec(c[1])}
const cx=/<cellXfs\b[^>]*>([\s\S]*?)<\/cellXfs>/.exec(sty);if(cx)for(const m of cx[1].matchAll(/<xf\b[^>]*>/g)){const i=/numFmtId="(\d+)"/.exec(m[0]);xfs.push(i?+i[1]:0)}}
const isDateFmt=id=>{if((id>=14&&id<=22)||(id>=27&&id<=36)||(id>=45&&id<=47)||(id>=50&&id<=58))return true;const c=fmts[id];if(!c)return false;return /[dmyh]/i.test(c.replace(/"[^"]*"/g,'').replace(/\[[^\]]*\]/g,'').replace(/\\./g,''))};
const fmtDate=sv=>{const d=new Date(Math.round((sv-25569)*86400000));if(isNaN(d))return String(sv);return String(d.getUTCDate()).padStart(2,'0')+'/'+String(d.getUTCMonth()+1).padStart(2,'0')+'/'+d.getUTCFullYear()};
const colIdx=r=>{let n=0;for(const ch of r.replace(/\d+/g,''))n=n*26+ch.charCodeAt(0)-64;return n-1};
const out={};
for(const m of wb.matchAll(/<sheet\b[^>]*>/g)){const nm=/\bname="([^"]*)"/.exec(m[0]),rid=/r:id="([^"]*)"/.exec(m[0]);if(!nm||!rid)continue;
let t=relMap[rid[1]];if(!t)continue;t=t.replace(/^\//,'');const path=t.startsWith('xl/')?t:'xl/'+t;const xml=await get(path);if(!xml)continue;
const rows=[];
for(const rm of xml.matchAll(/<row\b[^>]*?(?:\br="(\d+)")?[^>]*?(?:\/>|>([\s\S]*?)<\/row>)/g)){if(!rm[2])continue;const ri=rm[1]?+rm[1]-1:rows.length;const arr=[];
for(const cm of rm[2].matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)){const at=cm[1],r=/\br="([A-Z]+\d+)"/.exec(at),ty=/\bt="(\w+)"/.exec(at),sa=/\bs="(\d+)"/.exec(at);const body=cm[2]||'';
const ci=r?colIdx(r[1]):arr.length;let val='';const v=/<v>([\s\S]*?)<\/v>/.exec(body);
if(ty&&ty[1]=='s'&&v)val=sst[+v[1]]||'';
else if(ty&&ty[1]=='inlineStr'){let t2='';for(const x of body.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g))t2+=x[1];val=dec(t2)}
else if(ty&&(ty[1]=='str'||ty[1]=='e')&&v)val=dec(v[1]);
else if(ty&&ty[1]=='b'&&v)val=v[1]=='1'?'TRUE':'FALSE';
else if(v){val=v[1];if(sa&&isDateFmt(xfs[+sa[1]]||0)&&!isNaN(+val))val=fmtDate(+val)}
arr[ci]=val}
for(let i=0;i<arr.length;i++)if(arr[i]==null)arr[i]='';rows[ri]=arr}
for(let i=0;i<rows.length;i++)if(!rows[i])rows[i]=[];
while(rows.length&&!rows[rows.length-1].some(x=>String(x).trim()))rows.pop();
out[dec(nm[1])]=rows}
return out}
