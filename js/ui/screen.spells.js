// js/ui/screen.spells.js
(function(){
  const STORAGE_KEY = 'pk.characters';

  function el(tag, attrs={}, children=[]){
    const n = document.createElement(tag);
    for (const k in attrs){
      if (k === 'class') n.className = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else n.setAttribute(k, attrs[k]);
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

  const SCHOOLS = (()=> {
    const set = new Map();
    (window.SPELLS||[]).forEach(s=>{
      const ru = (s.school_ru||s.school||'').replace(/\(.*?\)/g,'').trim();
      if (!ru) return;
      set.set(ru, true);
    });
    return Array.from(set.keys()).sort((a,b)=>a.localeCompare(b,'ru'));
  })();
  const CLASS_RU = {
  barbarian:'Варвар', bard:'Бард', cleric:'Жрец', druid:'Друид', fighter:'Воин',
  monk:'Монах', paladin:'Паладин', ranger:'Следопыт', rogue:'Плут',
  sorcerer:'Чародей', warlock:'Колдун', wizard:'Маг', artificer:'Изобретатель'
};

const CLASS_FILTER = (()=> {
  const set = new Set();
  (window.SPELLS||[]).forEach(s=>{
    (s.classes||[]).forEach(c=> set.add(c));
  });
  // Вернём массив объектов {id, nameRu} отсортированный по русскому названию
  return Array.from(set).map(id=>({ id, nameRu: CLASS_RU[id] || id }))
    .sort((a,b)=> a.nameRu.localeCompare(b.nameRu,'ru'));
})();


  function getQueryCharId(){
  const raw = location.hash.slice(1);       // "/spells?char=...."
  const qs = raw.split('?')[1] || '';       // берём только часть после ?
  const p  = new URLSearchParams(qs);
  return p.get('char') || '';
}


  function filterSpells(list, f){
  return list.filter(s=>{
    if (f.q){
      const q = f.q.toLowerCase();
      if (!(`${s.name} ${s.text||''}`.toLowerCase().includes(q))) return false;
    }
    if (f.level !== '' && Number(s.level)!==Number(f.level)) return false;
    if (f.school){
      const clean = (s.school_ru||s.school||'').replace(/\(.*?\)/g,'').trim();
      if (clean !== f.school) return false;
    }
    if (f.classId){
      if (!Array.isArray(s.classes) || !s.classes.includes(f.classId)) return false;
    }
    if (f.ritual && !s.ritual) return false;
    if (f.concentration && !s.concentration) return false;
    return true;
  });
}


  function card(spell, opts){
  const { character, onAdd, onRemove } = opts||{};
  const hasSpell = !!(character && (character.spells||[]).includes(spell.id));

  const a = el('article',{class:'panel',style:'padding:12px; display:grid; gap:6px;'});
  // заголовок БЕЗ «трюк/ур.»
  const h = el('div',{class:'char-card__title'}, spell.name);

  const meta = el('div',{class:'meta'},[
    `${(spell.school_ru||spell.school||'').replace(/\(.*?\)/g,'').trim()}`,
    spell.ritual ? ' • ритуал' : '',
    spell.concentration ? ' • концентрация' : ''
  ].join(''));

  const row = el('div',{style:'display:flex; gap:8px; flex-wrap:wrap;'});
  const btnInfo = el('button',{class:'btn',type:'button'},'Подробнее');
  btnInfo.addEventListener('click', ()=>{
    SpellModal.open(spell, {
      hasSpell,
      onAdd: s => onAdd && onAdd(s),
      onRemove: s => onRemove && onRemove(s)
    });
  });

  row.append(btnInfo);

  if (character){
    const btn = hasSpell
      ? el('button',{class:'btn btn-danger',type:'button'},'Удалить')
      : el('button',{class:'btn btn-primary',type:'button'},'Добавить');
    btn.addEventListener('click', ()=>{
      if (hasSpell){ onRemove && onRemove(spell); }
      else { onAdd && onAdd(spell); }
    });
    row.append(btn);
  }

  a.append(h, meta, row);
  return a;
}


  function render(container){
    const charId = getQueryCharId();
    const character = charId ? getChar(charId) : null;
    if (character && !Array.isArray(character.spells)) { character.spells = []; upsertChar(character); }

    // — заголовок
    // — заголовок + кнопка "назад"
const titleRow = el('div',{style:'display:flex; gap:8px; align-items:center; flex-wrap:wrap;'});
const title = el('h1',{class:'page-title'}, character ? `Каталог заклинаний • ${character.name}` : 'Каталог заклинаний');
const back = el('button',{class:'btn btn-ghost',type:'button'}, '← Назад');

back.addEventListener('click', ()=>{
  if (character) Router.navTo(`/character/${character.id}`);
  else Router.navTo('/characters');
});

titleRow.append(back, title);

    // — фильтры
    const filters = el('div',{class:'panel',style:'padding:12px; display:grid; gap:8px;'});
    const row1 = el('div',{style:'display:flex; gap:8px; flex-wrap:wrap; align-items:center;'});
    const q = el('input',{class:'input',type:'search',placeholder:'Поиск по названию/описанию…',style:'min-width:220px;'});
    const level = el('select',{class:'select'});
    level.append( el('option',{value:''},'Любой уровень') );
    for (let i=0;i<=9;i++) level.append( el('option',{value:String(i)}, i===0?'Трюки (0)':'Уровень '+i) );
    const school = el('select',{class:'select'});
    school.append( el('option',{value:''},'Любая школа') );
    SCHOOLS.forEach(s=> school.append( el('option',{value:s}, s) ));
    const byClass = el('select',{class:'select'});
byClass.append( el('option',{value:''},'Любой класс') );
CLASS_FILTER.forEach(c=> byClass.append( el('option',{value:c.id}, c.nameRu) ));
    const ritual = el('label',{},[ el('input',{type:'checkbox'}),' Ритуал' ]);
    const conc = el('label',{},[ el('input',{type:'checkbox'}),' Концентрация' ]);

    row1.append(q, level, school, byClass, ritual, conc);

    filters.append(row1);

    // — список
    const listWrap = el('div',{style:'display:grid; gap:8px; margin-top:10px;'});

    function apply(){
      const f = {
  q: q.value.trim(),
  level: level.value,
  school: school.value,
  classId: byClass.value,
  ritual: ritual.querySelector('input').checked,
  concentration: conc.querySelector('input').checked
};

      const items = filterSpells(window.SPELLS||[], f);
      listWrap.innerHTML = '';
      if (!items.length){
        listWrap.append(el('div',{class:'empty__text',html:'Ничего не найдено по текущим фильтрам.'}));
        return;
      }
      items.forEach(sp => {
        listWrap.append( card(sp, {
          character,
          onAdd: (s)=>{
            const fresh = getChar(charId); // вдруг другой таб что-то поменял
            if (!fresh.spells) fresh.spells = [];
            if (!fresh.spells.includes(s.id)) fresh.spells.push(s.id);
            upsertChar(fresh);
            apply(); // перерисовать кнопки
          },
          onRemove: (s)=>{
            const fresh = getChar(charId);
            fresh.spells = (fresh.spells||[]).filter(id=>id!==s.id);
            upsertChar(fresh);
            apply();
          }
        }));
      });
    }

    [q, level, school, byClass, ritual.querySelector('input'), conc.querySelector('input')].forEach(c=> c.addEventListener('input', apply));

    container.innerHTML = '';
container.append(titleRow, filters, listWrap);
apply();

  }

  window.SpellsScreen = { render };
})();
