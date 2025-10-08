// js/ui/modal.multiclass.js
(function(){
  const STORAGE_KEY = 'pk.characters';

  // === справочник классов (id → русское имя) ===
  const CLASS_RU = {
    barbarian:'Варвар', bard:'Бард', cleric:'Жрец', druid:'Друид', fighter:'Воин',
    monk:'Монах', paladin:'Паладин', ranger:'Следопыт', rogue:'Плут',
    sorcerer:'Чародей', warlock:'Колдун', wizard:'Маг', artificer:'Изобретатель'
  };
  const ALL_CLASS_IDS = Object.keys(CLASS_RU);

  // подсказки: у большинства архетип с 3 уровня
  const SUBCLASS_LEVEL_REQ = {
    barbarian:3,bard:3,cleric:1,druid:2,fighter:3,monk:3,paladin:3,ranger:3,rogue:3,
    sorcerer:1,warlock:1,wizard:2,artificer:3
  };

  // Глобальная мапа доступных названий архетипов.
// Берём human-names из SUBCLASS_NAMES + фолбэк на CLASS_FEATURES[...].subclasses.
function getSubclassMap(){
  const names = (window.SUBCLASS_NAMES || {});
  const cf    = (window.CLASS_FEATURES || {});
  const out = {};

  // соберём все classId, которые вообще встречаются
  const ids = new Set([
    ...Object.keys(names||{}),
    ...Object.keys(cf||{})
  ]);

  ids.forEach(id=>{
    const n = (names && names[id]) || {};
    const s = (cf && cf[id] && cf[id].subclasses) || {};
    // слить ключи: human-name из SUBCLASS_NAMES, иначе берём ключ из CF
    const merged = {};
    Object.keys(s||{}).forEach(k=>{
      merged[k] = (n && n[k]) || s[k] || k;
    });
    Object.keys(n||{}).forEach(k=>{
      if (!(k in merged)) merged[k] = n[k];
    });
    out[id] = merged;
  });

  return out;
}


  function el(tag, attrs={}, children=[]){
  const n = document.createElement(tag);
  for (const k in attrs){
    const v = attrs[k];
    if (k === 'class') { n.className = v; continue; }
    if (k === 'html')  { n.innerHTML = v; continue; }
    // булевые атрибуты: не писать disabled="false"
    if (k === 'disabled' || k === 'checked' || k === 'readonly' || k === 'selected'){
      n[k] = !!v; // true/false как свойство
      continue;
    }
    if (v !== false && v != null) n.setAttribute(k, v);
  }
  (Array.isArray(children)?children:[children]).forEach(c=>{
    if (c==null) return;
    n.appendChild(typeof c==='string' ? document.createTextNode(c) : c);
  });
  return n;
}

  function load(){ try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]'); } catch{ return []; } }
  function save(arr){ localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); }

  function getChar(id){ return load().find(x=>x.id===id); }
  function upsertChar(next){
    const list = load();
    const i = list.findIndex(x=>x.id===next.id);
    if (i>=0) list[i]=next; else list.push(next);
    save(list);
  }

  function closeModal(d){ if (d && d.remove) d.remove(); }

  // нормализация (лайт-версия)
  function normalize(ch){
    if (!ch.classes || !Array.isArray(ch.classes) || !ch.classes.length){
      const id = (ch.classId||'fighter').toLowerCase();
      const lvl = Math.max(1, Math.min(20, Number(ch.level||1)));
      ch.classes = [{ id, level:lvl, subclassId: ch.subclassId || null }];
      ch.primary = 0;
    }
    // уникальность, максимум 3
    const seen = new Set();
    ch.classes = ch.classes
      .filter(c => c && c.id)
      .map(c => ({ id:String(c.id).toLowerCase(), level:Math.max(1,Math.min(20,Number(c.level||1))), subclassId:c.subclassId??null }))
      .filter(c => { if (seen.has(c.id)) return false; seen.add(c.id); return true; })
      .slice(0,3);
    if (typeof ch.primary!=='number' || ch.primary<0 || ch.primary>=ch.classes.length) ch.primary=0;

    // лимит 20 суммарно
    let sum = ch.classes.reduce((s,c)=>s+c.level,0);
    if (sum>20){
      for (let i=ch.classes.length-1;i>=0 && sum>20;i--){
        const over = sum-20;
        const drop = Math.min(over, Math.max(0, ch.classes[i].level-1));
        if (drop>0){ ch.classes[i].level-=drop; sum-=drop; }
      }
      ch.classes = ch.classes.filter(c=>c.level>=1);
      if (!ch.classes.length){ ch.classes=[{id:'fighter',level:1,subclassId:null}]; ch.primary=0; }
    }

    // зеркало старых полей
    const p = ch.classes[ch.primary] || ch.classes[0];
    ch.classId = p.id; ch.level = p.level; ch.subclassId = p.subclassId ?? null;
    return ch;
  }

  // построение строки списка классов
  function classLine(ch){
    return (ch.classes||[]).map(c=>`${CLASS_RU[c.id]||c.id} ${c.level}`).join(' • ');
  }

  function open(charId){
    const ch0 = getChar(charId);
    if (!ch0) return alert('Персонаж не найден');
    const ch = normalize(JSON.parse(JSON.stringify(ch0))); // рабочая копия

    const d = el('div',{class:'modal-backdrop'});
   const m = el('div',{class:'modal modal--plain multiclass-modal'});
// компактная под мобильный
m.style.maxWidth = '680px';
m.style.width = 'calc(100% - 24px)';
m.style.padding = '12px';


    const head = el('div',{class:'modal__header'},[
      el('div',{class:'modal__title'}, 'Классы и уровни'),
      el('button',{class:'icon-btn',type:'button',title:'Закрыть'}, '✕')
    ]);
    head.lastChild.addEventListener('click', ()=> closeModal(d));

    // ===== BODY =====
    const body = el('div',{class:'modal__body'});
    const info = el('div',{class:'meta',html:`${classLine(ch)} • <i>${ch.race||''}</i>`});
    info.style.marginBottom = '8px';
    body.append(info);

    // таблица текущих классов
    const table = el('div',{});
    function redrawTable(){
      table.innerHTML = '';
      const wrap = el('div',{style:'display:grid; gap:8px;'});
      (ch.classes||[]).forEach((c,idx)=>{
        const row = el('div',{style:'display:grid; grid-template-columns: 1fr auto auto 48px auto auto; gap:6px; align-items:center;'});

        // Название класса
        // Название класса (светлый цвет)
row.append( el('div',{style:'color:#f5e8c8;'}, `${CLASS_RU[c.id]||c.id}`) );


        // Степперы уровня
        const minus = el('button',{class:'btn',type:'button', style:'width:32px;height:32px;padding:0;line-height:30px;font-size:18px;'},'−');
const lvl   = el('div',{style:'min-width:28px;text-align:center;font-size:14px;color:#f5e8c8;'}, String(c.level));

const plus  = el('button',{class:'btn',type:'button', style:'width:32px;height:32px;padding:0;line-height:30px;font-size:18px;'},'+');

        minus.addEventListener('click', ()=>{
          if (c.level>1){ c.level--; updateAfterChange(); }
        });
        plus.addEventListener('click', ()=>{
          const sum = ch.classes.reduce((s,x)=>s+x.level,0);
          if (sum<20){ c.level++; updateAfterChange(); }
        });
        row.append(minus, lvl, plus);

     // Селектор архетипа (если есть для этого класса)
const classId   = String(c.id).toLowerCase();
const subsAll   = getSubclassMap()[classId] || {};   // {subId: humanName}
const needLvl   = SUBCLASS_LEVEL_REQ[classId] || 3;
const canPick   = c.level >= needLvl;
const isPrimary = (idx === ch.primary);

const subSel = el('select',{
  class:'select',
  style:'max-width:100%;font-size:14px;padding:4px 6px;height:32px;'
});
subSel.disabled = isPrimary; // выставляем свойством, а не атрибутом

const subIds = Object.keys(subsAll);

// нет подклассов вообще — ставим заглушку и дизейблим
if (subIds.length === 0){
  subSel.disabled = true;
  subSel.append( el('option',{value:''}, '—') );
} else if (isPrimary){
  // primary не редактируем тут
  subSel.append( el('option',{value:''}, 'Измените архетип через кнопку в шапке') );
} else {
  // можно выбрать заранее — сохранится и применится на нужном уровне
  subSel.append( el('option',{value:''}, canPick ? 'Выбери архетип' : `Можно на ${needLvl}-м, выбор сохранится`) );
  subIds.forEach(subId => subSel.append( el('option',{value:subId}, subsAll[subId] || subId) ));
  subSel.value = c.subclassId || '';
  subSel.addEventListener('change', ()=>{
    c.subclassId = subSel.value || null;
    updateAfterChange(); // лёгкий апдейт
  });
}

if (isPrimary) subSel.value = '';
row.append(subSel);






        // Удалить (нельзя если единственный класс)
        const del = el('button',{class:'icon-btn',type:'button',title:'Удалить',style:'width:32px;height:32px;line-height:30px;font-size:16px;padding:0;'},'✕');

        del.disabled = (ch.classes.length<=1);
        del.addEventListener('click', ()=>{
          if (ch.classes.length<=1) return;
          ch.classes.splice(idx,1);
          if (ch.primary >= ch.classes.length) ch.primary = 0;
          updateAfterChange(true);
        });
        row.append(del);

        wrap.append(row);
      });
      table.append(wrap);
    }

    // блок «Добавить класс»
    function allowedToAddIds(){
      const have = new Set((ch.classes||[]).map(x=>x.id));
      return ALL_CLASS_IDS.filter(id => !have.has(id));
    }
    const addBox = el('div',{style:'margin-top:10px;display:flex;gap:6px;align-items:center;flex-wrap:wrap;'});

    const addSel = el('select',{class:'select', style:'font-size:14px;padding:4px 6px;height:32px;'});
    function redrawAdd(){
      addSel.innerHTML = '';
      const ids = allowedToAddIds();
      if (!ids.length || (ch.classes||[]).length>=3){
        addSel.append( el('option',{value:''}, 'Лимит достигнут') );
        addSel.disabled = true;
      } else {
        addSel.append( el('option',{value:''}, 'Добавить класс…') );
        ids.forEach(id => addSel.append( el('option',{value:id}, CLASS_RU[id]||id) ));
        addSel.disabled = false;
      }
    }
    const addBtn = el('button',{class:'btn',type:'button', style:'height:32px;padding:4px 10px;font-size:14px;'},'Добавить');
    addBtn.addEventListener('click', ()=>{
      const id = addSel.value;
      if (!id) return;
      if (!ch.classes) ch.classes=[];
      if (ch.classes.length>=3) return;
      if (ch.classes.some(x=>x.id===id)) return;
      const sum = ch.classes.reduce((s,c)=>s+c.level,0);
      const free = Math.max(0, 20 - sum);
      const lvl = Math.max(1, Math.min(20, free || 1));
      ch.classes.push({ id, level:lvl, subclassId:null });
      updateAfterChange(true);
    });
    addBox.append(addSel, addBtn);

    function updateAfterChange(rebuild=false){
      normalize(ch);
      info.innerHTML = `${classLine(ch)} • <i>${ch.race||''}</i>`;
      if (rebuild) { redrawTable(); redrawAdd(); }
      else { redrawAdd(); }
    }

        redrawTable();
    redrawAdd();

    body.append(table, addBox);


    // ===== FOOTER =====
    const foot = el('div',{class:'modal__footer'});
    const cancel = el('button',{class:'btn btn-ghost',type:'button'},'Отмена');
    const saveBtn = el('button',{class:'btn btn-primary',type:'button'},'Сохранить');
    cancel.addEventListener('click', ()=> closeModal(d));
    saveBtn.addEventListener('click', ()=>{
      const next = normalize(ch);
      upsertChar(next);
      closeModal(d);
      // перерисовать экран персонажа
      try{ window.CharacterScreen && window.CharacterScreen.render(document.getElementById('app'), next.id); } catch(e){}
    });

    m.append(head, body, foot);
    foot.append(cancel, saveBtn);
    d.append(m);
    document.body.appendChild(d);
  }

  window.MulticlassModal = { open };
})();
// >>> COMPACT PATCH for "Классы и уровни" modal (не трогать) <<<
(function ensureCompactMulticlassModal(){
  // 1) Впрыскиваем последний по порядку CSS с !important — перебьёт тему/свиток
  if (!document.getElementById('mc-compact-css')){
    const s = document.createElement('style');
    s.id = 'mc-compact-css';
    s.textContent = `
      .modal.multiclass-modal{
        width: 420px !important;
        max-width: calc(100% - 14px) !important;
        padding: 10px !important;

        /* отключаем «свиток» темы и возвращаем коробку */
        background-image: none !important;
        background: linear-gradient(180deg, #2a241a, #201a12) !important;
        border-radius: 16px !important;
        border: 1px solid rgba(201,162,39,.35) !important;
        box-shadow: 0 24px 60px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.04) !important;
      }
      .modal.multiclass-modal .modal__title{ font-size:18px !important; }
      .modal.multiclass-modal .select{ font-size:13px; padding:2px 6px; height:28px; }
      .modal.multiclass-modal .btn{ height:28px; padding:4px 10px; font-size:13px; }
      .modal.multiclass-modal .icon-btn{ width:28px; height:28px; line-height:26px; font-size:14px; padding:0; }
    `;
    document.head.appendChild(s);
  }

  // 2) Гарантируем, что нужная модалка получит класс .multiclass-modal
  //    (даже если его забыли повесить в JS)
  const tagIt = () => {
    document.querySelectorAll('.modal .modal__title').forEach(t=>{
      if (t.textContent.trim() === 'Классы и уровни'){
        const modal = t.closest('.modal');
        if (modal) modal.classList.add('multiclass-modal');
      }
    });
  };
  const mo = new MutationObserver(tagIt);
  mo.observe(document.body, {childList:true, subtree:true});
  tagIt(); // на случай, если окно уже открыто
})();
