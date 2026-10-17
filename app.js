'use strict';
const NS='http://www.w3.org/2000/svg',root=document.getElementById('app');
const el=(t,o={},...k)=>{const e=document.createElement(t);for(const[a,v]of Object.entries(o)){if(a==='class')e.className=v;else if(a==='text')e.textContent=v;else if(a.startsWith('on'))e.addEventListener(a.slice(2),v);else if(v===true)e.setAttribute(a,'');else if(v!==false&&v!=null)e.setAttribute(a,v)}k.flat().forEach(c=>c!=null&&e.append(c));return e};
const ic=n=>{const s=document.createElementNS(NS,'svg'),u=document.createElementNS(NS,'use');s.setAttribute('class','ic');u.setAttribute('href','#'+n);s.append(u);return s};
const brl=n=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(n);
const uid=()=>crypto.randomUUID().slice(0,8);
let tt;const toast=m=>{const t=document.getElementById('toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),2600)};
/* armazenamento */
const dbp=new Promise((ok,no)=>{const r=indexedDB.open('doce-de-biscuit',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)});
const kv=async(m,k,v)=>{const d=await dbp;return new Promise((ok,no)=>{const s=d.transaction('kv',m==='get'?'readonly':'readwrite').objectStore('kv');const q=m==='get'?s.get(k):s.put(v,k);q.onsuccess=()=>ok(q.result);q.onerror=()=>no(q.error)})};
const DEF=()=>({cfg:{whats:'5511981727791',insta:'doce_de_biscuit',title:'Decoração assustadoramente linda para o seu Halloween',sub:'Peças artesanais em biscuit e crochê, feitas à mão com muito carinho. Catálogo Halloween 2026.'},
cats:[{id:'c1',name:'Cozinha'},{id:'c2',name:'Mesa e festa'},{id:'c3',name:'Portas e guirlandas'}],
prods:[
{id:'p1',name:'Colher de Pau Decorada Halloween',desc:'Colher de pau artesanal de 30 cm com topo em biscuit: modelo Abóbora laranja ou Caveira branca estilizada, cada uma com laço de veludo preto.',price:38,cat:'c1',img:'images/colher.jpg',on:true},
{id:'p2',name:'Caldeirão de Bruxa com Movimento',desc:'Caldeirão preto de 15 cm com alça dourada, fumaça de manta acrílica, aranhas decorativas e colher que mexe sozinha com motor.',price:100,cat:'c2',img:'images/caldeirao.jpg',on:true},
{id:'p3',name:'Abóbora Grande Iluminada em Crochê',desc:'Abóbora de crochê com fio de malha laranja (20 cm), carinha em feltro e pisca-pisca de LED por dentro. Serve de cesto para doces.',price:40,cat:'c2',img:'images/abobora.jpg',on:true},
{id:'p4',name:'Guirlanda Monstrinho Divertido',desc:'Guirlanda de pelúcia lilás com 35 cm, 5 olhinhos, boca com dentinhos em biscuit e laço preto de bolinhas brancas. Peça exclusiva para a porta.',price:200,cat:'c3',img:'images/monstro.jpg',on:true}]});
let S,A;const save=()=>kv('put','state',S);
const num=s=>String(s||'').replace(/\D/g,''),handle=s=>String(s||'').replace(/[^\w.]/g,'');
const waUrl=(t)=>`https://wa.me/${num(S.cfg.whats)}?text=${encodeURIComponent(t||'Olá! Vim pelo site da Doce de Biscuit.')}`;
const igUrl=()=>`https://instagram.com/${handle(S.cfg.insta)}`;
const ext=(href,cls,icon,txt)=>el('a',{class:'btn '+cls,href,target:'_blank',rel:'noopener noreferrer'},ic(icon),el('span',{text:txt}));
/* loja */
let filter='all',io;
function reveal(){io?.disconnect();io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});document.querySelectorAll('.rv').forEach(n=>io.observe(n))}
function tilt(c){c.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const r=c.getBoundingClientRect();c.style.setProperty('--ry',((e.clientX-r.left)/r.width-.5)*8+'deg');c.style.setProperty('--rx',(.5-(e.clientY-r.top)/r.height)*8+'deg')});c.addEventListener('pointerleave',()=>{c.style.setProperty('--rx','0deg');c.style.setProperty('--ry','0deg')})}
function store(){
 document.title='Doce de Biscuit · Catálogo Halloween 2026';
 const grid=el('ul',{class:'grid'}),chips=el('div',{class:'chips'});
 const draw=()=>{
  chips.replaceChildren(...[{id:'all',name:'Tudo'},...S.cats].map(c=>el('button',{class:'chip','aria-pressed':String(filter===c.id),onclick:()=>{filter=c.id;draw()}},c.name)));
  const ps=S.prods.filter(p=>p.on&&(filter==='all'||p.cat===filter));
  grid.replaceChildren(...(ps.length?ps.map(p=>{const card=el('article',{class:'card glass'},
    el('div',{class:'pic'},el('img',{src:p.img,alt:p.name,loading:'lazy'})),
    el('div',{class:'b'},el('h3',{text:p.name}),el('p',{text:p.desc}),el('div',{class:'price',text:brl(p.price)}),
     ext(waUrl(`Olá! Tenho interesse em: ${p.name} (${brl(p.price)}). Pode me ajudar?`),'wa','wa','Pedir no WhatsApp')));
   tilt(card);return el('li',{class:'rv'},card)}):[el('li',{class:'empty',text:'Nenhum produto nesta categoria por enquanto.'})]));
  grid.querySelectorAll('.rv').forEach((n,i)=>n.style.transitionDelay=i*90+'ms');reveal()};
 draw();
 root.replaceChildren(
  el('header',{class:'top glass'},el('img',{src:'logo.png',alt:'Doce de Biscuit'}),el('nav',{},ext(igUrl(),'ig sm','ig','Instagram'),ext(waUrl(),'wa sm','wa','WhatsApp'))),
  el('main',{class:'wrap'},
   el('section',{class:'hero intro'},el('img',{class:'logo',src:'logo.png',alt:'Doce de Biscuit - lembrancinhas personalizadas'}),el('h1',{text:S.cfg.title}),el('p',{text:S.cfg.sub}),
    el('div',{class:'row'},el('a',{class:'btn wa',href:'#catalogo',onclick:e=>{e.preventDefault();document.getElementById('catalogo').scrollIntoView({behavior:'smooth'})}},'Ver catálogo'),ext(igUrl(),'ig','ig','Seguir no Instagram'))),
   el('section',{class:'sec',id:'catalogo'},el('h2',{class:'rv',text:'Catálogo Halloween 2026'}),chips,grid),
   el('section',{class:'band glass rv'},el('h2',{text:'Quer uma peça personalizada?'}),el('p',{text:'Conte sua ideia e a gente cria uma lembrancinha só sua.'}),el('div',{class:'row crow',style:null},ext(waUrl(),'wa','wa','Falar no WhatsApp'),ext(igUrl(),'ig','ig','@'+handle(S.cfg.insta))))),
  el('footer',{class:'foot'},el('p',{text:'© 2026 Doce de Biscuit · Feito à mão'}),el('a',{class:'adm',href:'#admin'},'Área administrativa')),
  el('a',{class:'btn wa fab',href:waUrl(),target:'_blank',rel:'noopener noreferrer','aria-label':'Falar no WhatsApp'},ic('wa')));
 document.querySelector('.band .row').style.justifyContent='center';reveal()}
/* segurança do admin */
const b64=b=>btoa(String.fromCharCode(...new Uint8Array(b))),ub=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function hash(pw,salt){const k=await crypto.subtle.importKey('raw',new TextEncoder().encode(pw),'PBKDF2',false,['deriveBits']);return b64(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt,iterations:210000},k,256))}
const logged=()=>Number(sessionStorage.getItem('s'))>Date.now(),touch=()=>sessionStorage.setItem('s',Date.now()+18e5);
function authForm(first){
 document.title='Administração · Doce de Biscuit';
 const em=el('input',{type:'email',required:true,autocomplete:'username',maxlength:'120'}),pw=el('input',{type:'password',required:true,minlength:first?'10':'1',autocomplete:first?'new-password':'current-password'}),pw2=el('input',{type:'password',required:true,autocomplete:'new-password'}),msg=el('p',{class:'msg'});
 const f=el('form',{class:'auth glass',onsubmit:async e=>{e.preventDefault();msg.textContent='';const mail=em.value.trim().toLowerCase();
  if(first){if(pw.value.length<10)return msg.textContent='A senha precisa ter pelo menos 10 caracteres.';if(pw.value!==pw2.value)return msg.textContent='As senhas não são iguais.';
   const salt=crypto.getRandomValues(new Uint8Array(16));A={email:mail,salt:b64(salt),hash:await hash(pw.value,salt),fails:0,lock:0};await kv('put','auth',A);touch();return admin()}
  if(A.lock>Date.now())return msg.textContent='Muitas tentativas. Aguarde alguns minutos.';
  const h=await hash(pw.value,ub(A.salt));
  if(mail===A.email&&h===A.hash){A.fails=0;await kv('put','auth',A);touch();return admin()}
  A.fails++;if(A.fails>=5){A.lock=Date.now()+3e5;A.fails=0}await kv('put','auth',A);await new Promise(r=>setTimeout(r,700));msg.textContent='E-mail ou senha incorretos.'}},
  el('img',{class:'logo',src:'logo.png',alt:''}),el('h1',{text:first?'Criar acesso de administrador':'Entrar na administração'}),
  first?el('p',{class:'note',text:'Primeiro acesso: cadastre o e-mail e a senha que só você vai usar.'}):null,
  el('label',{},'E-mail',em),el('label',{},'Senha',pw),first?el('label',{},'Repita a senha',pw2):null,msg,
  el('button',{class:'btn wa',type:'submit'},first?'Criar acesso':'Entrar'),el('a',{class:'btn',href:'#'},'← Voltar à loja'));
 root.replaceChildren(f);em.focus()}
function fileToData(f){return new Promise((ok,no)=>{if(!/^image\/(jpeg|png|webp)$/.test(f.type))return no(new Error('Use uma foto JPG, PNG ou WEBP.'));const im=new Image(),u=URL.createObjectURL(f);im.onload=()=>{const s=Math.min(1,1000/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);ok(c.toDataURL('image/jpeg',.86))};im.onerror=()=>no(new Error('Não consegui abrir essa imagem.'));im.src=u})}
function panel(){
 let tab='p',edit=null;const catName=id=>S.cats.find(c=>c.id===id)?.name||'Sem categoria';
 const persist=async m=>{await save();if(m)toast(m)};
 const plist=()=>el('div',{},el('section',{class:'panel glass'},el('div',{class:'crow'},el('h2',{text:'Produtos'}),el('button',{class:'btn wa sm',onclick:()=>{edit={id:uid(),name:'',desc:'',price:0,cat:S.cats[0]?.id||'',img:'',on:true,isNew:true};draw()}},'+ Novo produto')),
  el('div',{class:'rows'},...S.prods.map(p=>el('div',{class:'item'},p.img?el('img',{src:p.img,alt:''}):el('div'),el('div',{},el('strong',{text:p.name}),el('br'),el('small',{text:catName(p.cat)+(p.on?'':' · oculto')})),
   el('div',{class:'acts'},el('input',{type:'number',min:'0',step:'0.01',value:p.price,'aria-label':'Preço de '+p.name,onchange:async e=>{const v=parseFloat(e.target.value);if(!(v>=0))return;p.price=v;await persist('Preço atualizado')}}),el('button',{class:'btn sm',onclick:()=>{edit={...p};draw()}},'Editar')))))));
 const editor=()=>{const p=edit;let img=p.img;const prev=el('img',{class:'prev',alt:'',src:img||'logo.png'}),msg=el('p',{class:'msg'});
  const name=el('input',{value:p.name,maxlength:'90'}),desc=el('textarea',{rows:'4',maxlength:'400'}),price=el('input',{type:'number',min:'0',step:'0.01',value:p.price}),cat=el('select',{},...S.cats.map(c=>el('option',{value:c.id,selected:c.id===p.cat},c.name)),el('option',{value:'',selected:!p.cat},'Sem categoria')),on=el('input',{type:'checkbox',checked:p.on});desc.value=p.desc;
  const file=el('input',{type:'file',accept:'image/jpeg,image/png,image/webp',onchange:async()=>{try{img=await fileToData(file.files[0]);prev.src=img;msg.textContent=''}catch(e){msg.textContent=e.message}}});
  return el('section',{class:'panel glass'},el('h2',{text:p.isNew?'Novo produto':'Editar produto'}),el('div',{class:'form'},
   el('label',{class:'full'},'Título',name),el('label',{class:'full'},'Descrição',desc),el('label',{},'Preço (R$)',price),el('label',{},'Categoria',cat),
   el('div',{class:'full crow'},prev,el('label',{},'Foto (do seu celular ou computador)',file)),el('label',{class:'crow'},on,'Mostrar na loja')),msg,
   el('div',{class:'crow'},el('button',{class:'btn wa',onclick:async()=>{const v=parseFloat(price.value);if(!name.value.trim())return msg.textContent='Digite o título.';if(!(v>=0))return msg.textContent='Preço inválido.';if(!img)return msg.textContent='Envie uma foto.';
    const np={id:p.id,name:name.value.trim(),desc:desc.value.trim(),price:v,cat:cat.value,img,on:on.checked};const i=S.prods.findIndex(x=>x.id===p.id);i<0?S.prods.push(np):S.prods[i]=np;await persist('Produto salvo');edit=null;draw()}},'Salvar'),
    el('button',{class:'btn',onclick:()=>{edit=null;draw()}},'Cancelar'),
    p.isNew?null:el('button',{class:'btn dng',onclick:async()=>{if(!confirm('Excluir este produto?'))return;S.prods=S.prods.filter(x=>x.id!==p.id);await persist('Produto excluído');edit=null;draw()}},'Excluir')))};
 const clist=()=>{const n=el('input',{placeholder:'Nome da nova categoria',maxlength:'40'});return el('section',{class:'panel glass'},el('h2',{text:'Categorias'}),
  el('div',{class:'crow'},n,el('button',{class:'btn wa sm',onclick:async()=>{const v=n.value.trim();if(!v)return;S.cats.push({id:uid(),name:v});await persist('Categoria criada');draw()}},'Adicionar')),
  el('div',{class:'rows'},...S.cats.map(c=>el('div',{class:'item'},el('div'),el('input',{value:c.name,maxlength:'40','aria-label':'Nome da categoria',onchange:async e=>{if(e.target.value.trim()){c.name=e.target.value.trim();await persist('Categoria renomeada')}}}),
   el('button',{class:'btn dng sm',onclick:async()=>{if(!confirm('Remover a categoria? Os produtos ficam sem categoria.'))return;S.prods.forEach(p=>{if(p.cat===c.id)p.cat=''});S.cats=S.cats.filter(x=>x.id!==c.id);filter='all';await persist('Categoria removida');draw()}},'Remover')))))};
 const settings=()=>{const f={};const fld=(k,l,t='text')=>{f[k]=el('input',{type:t,value:S.cfg[k],maxlength:'200'});return el('label',{class:k==='title'||k==='sub'?'full':''},l,f[k])};const cur=el('input',{type:'password',autocomplete:'current-password'}),nw=el('input',{type:'password',minlength:'10',autocomplete:'new-password'}),m2=el('p',{class:'msg'});
  return el('div',{},el('section',{class:'panel glass'},el('h2',{text:'Textos e contatos'}),el('div',{class:'form'},fld('title','Título principal'),fld('sub','Texto de apoio'),fld('whats','WhatsApp (com 55 + DDD, só números)'),fld('insta','Instagram (sem o @)')),
   el('p',{}),el('button',{class:'btn wa',onclick:async()=>{for(const k in f)S.cfg[k]=f[k].value.trim();await persist('Configurações salvas')}},'Salvar')),
  el('section',{class:'panel glass'},el('h2',{text:'Trocar senha'}),el('div',{class:'form'},el('label',{},'Senha atual',cur),el('label',{},'Nova senha (mín. 10 caracteres)',nw)),m2,
   el('button',{class:'btn',onclick:async()=>{if(await hash(cur.value,ub(A.salt))!==A.hash)return m2.textContent='Senha atual incorreta.';if(nw.value.length<10)return m2.textContent='A nova senha precisa de 10+ caracteres.';const s=crypto.getRandomValues(new Uint8Array(16));A.salt=b64(s);A.hash=await hash(nw.value,s);await kv('put','auth',A);cur.value=nw.value='';m2.textContent='';toast('Senha alterada')}},'Alterar senha')))};
 const draw=()=>{touch();root.replaceChildren(el('header',{class:'abar glass'},el('img',{src:'logo.png',alt:''}),
  el('nav',{},...[['p','Produtos'],['c','Categorias'],['s','Ajustes']].map(([k,l])=>el('button',{class:'chip','aria-pressed':String(tab===k),onclick:()=>{tab=k;edit=null;draw()}},l))),
  el('a',{class:'btn sm',href:'#'},'← Voltar à loja'),el('button',{class:'btn sm',onclick:()=>{sessionStorage.removeItem('s');location.hash=''}},'Sair')),
  el('main',{class:'wrap'},tab==='p'?(edit?editor():plist()):tab==='c'?clist():settings()))};
 document.title='Administração · Doce de Biscuit';draw()}
function admin(){!A?authForm(true):!logged()?authForm(false):panel()}
function route(){scrollTo(0,0);location.hash==='#admin'?admin():store()}
(async()=>{S=await kv('get','state');if(!S){S=DEF();await save()}A=await kv('get','auth');navigator.storage?.persist?.();addEventListener('hashchange',route);route()})();
