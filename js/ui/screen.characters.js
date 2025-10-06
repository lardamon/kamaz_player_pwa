// Экран: Мои персонажи (сетка, плюс-карта, модалка "Создать", арт справа)
(function(){
  const STORAGE_KEY = 'pk.characters';
  const MAX_CHARS = 4;
  const v = 'v=6'; // пробиваем кэш ассетов

  // --- справочники ---
  const CLASSES = [
    { id:'barbarian',  name:'Варвар' },
    { id:'bard',       name:'Бард' },
    { id:'cleric',     name:'Жрец' },
    { id:'druid',      name:'Друид' },
    { id:'fighter',    name:'Воин' },
    { id:'monk',       name:'Монах' },
    { id:'paladin',    name:'Паладин' },
    { id:'ranger',     name:'Следопыт' },
    { id:'rogue',      name:'Плут' },
    { id:'sorcerer',   name:'Чародей' },
    { id:'warlock',    name:'Колдун' },
    { id:'wizard',     name:'Маг' },
    { id:'artificer',  name:'Изобретатель' }
  ];
  // PHB — всегда первыми в фиксированном порядке:
const PHB_RACES = [
  'Человек','Дварф','Эльф','Гном','Полуэльф','Полуорк','Полурослик','Драконорожденный','Тифлинг'
];

// MPMM — алфавитно (ru):
const MPMM_RACES = [
  'Ааракокра','Аасимар','Багбир','Гитъянки','Гитцерай','Глубинный гном','Гоблин','Голиаф','Дженази','Дуэргар',
  'Зайцегон','Кенку','Кентавр','Кобольд','Людоящер','Минотавр','Морской эльф','Орк','Сатир','Табакси',
  'Тортл','Тритон','Фирболг','Фэйри','Хобгоблин','Чейнджлинг','Шадар-кай','Шифтер','Эладрин','Юань-ти'
].sort((a,b)=> a.localeCompare(b, 'ru'));

// Итоговый список для селекта:
const RACES = [...PHB_RACES, ...MPMM_RACES];



  // --- helpers ---
  function el(tag, attrs={}, children=[]){
    const n = document.createElement(tag);
    for (const k in attrs){
      if (k === 'class') n.className = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    (Array.isArray(children) ? children : [children]).forEach(c=>{
      if (c == null) return;
      n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return n;
  }
  const icon = name => el('img',{class:'icon',src:`./assets/icons/ui/${name}?${v}`,alt:''});
  const className = id => (CLASSES.find(c=>c.id===id) || {name:id}).name;

  // === MIGRATION → мультикласс ===
function normalizeCharacter(ch){
  if (!ch || typeof ch !== 'object') return ch;

  // если ещё нет classes — собрать из старых полей
  if (!Array.isArray(ch.classes) || ch.classes.length === 0){
    const baseId  = (ch.classId || '').toLowerCase() || 'fighter';
    const baseLvl = Math.max(1, Math.min(20, Number(ch.level || 1)));
    const baseSub = ch.subclassId || null;
    ch.classes = [{ id: baseId, level: baseLvl, subclassId: baseSub }];
    ch.primary = 0;
  }

  // чистка дублей/уровней/лимитов
  const seen = new Set();
  ch.classes = ch.classes
    .filter(c => c && c.id)
    .map(c => ({
      id: String(c.id).toLowerCase(),
      level: Math.max(1, Math.min(20, Number(c.level || 1))),
      subclassId: c.subclassId ?? null
    }))
    .filter(c => { if (seen.has(c.id)) return false; seen.add(c.id); return true; })
    .slice(0, 3);

  if (typeof ch.primary !== 'number' || ch.primary < 0 || ch.primary >= ch.classes.length){
    ch.primary = 0;
  }

  // суммарный уровень ≤ 20
  let sum = ch.classes.reduce((s,c)=>s+c.level,0);
  if (sum > 20){
    for (let i = ch.classes.length - 1; i >= 0 && sum > 20; i--){
      const over = sum - 20;
      const drop = Math.min(over, Math.max(0, ch.classes[i].level - 1));
      if (drop > 0){ ch.classes[i].level -= drop; sum -= drop; }
    }
    ch.classes = ch.classes.filter(c => c.level >= 1);
    if (ch.classes.length === 0){
      ch.classes = [{ id:'fighter', level:1, subclassId:null }];
      ch.primary = 0;
    }
  }

  // зеркало старых полей из primary — для совместимости
  const p = ch.classes[ch.primary] || ch.classes[0];
  ch.classId    = p.id;
  ch.level      = p.level;
  ch.subclassId = p.subclassId ?? null;

  return ch;
}

// перезаписываем load/save — с миграцией и автосинхронизацией
function load(){
  let list;
  try{ list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch{ list = []; }
  if (!Array.isArray(list)) list = [];
  let changed = false;
  const next = list.map(obj => {
    const before = JSON.stringify(obj);
    const norm = normalizeCharacter(obj);
    if (JSON.stringify(norm) !== before) changed = true;
    return norm;
  });
  if (changed){
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch{}
  }
  return next;
}
function save(arr){
  const safe = Array.isArray(arr) ? arr.map(normalizeCharacter) : [];
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(safe)); } catch{}
}

  function uid(){ return Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8); }
  const classById = id => CLASSES.find(c=>c.id===id) || CLASSES[0];
  const artFor = clsId => `url('./assets/classes/${clsId}.webp?${v}')`;

  // ---------- пустой список ----------
  function renderEmptyState(){
    const wrap = el('div', { class: 'panel empty' });
    const img  = el('img', {
      class: 'empty__img',
      src: `./assets/illustrations/empty-characters.webp?${v}`,
      alt: 'Пустой список персонажей'
    });
    const h    = el('div', { class: 'empty__title', html: 'У вас пока нет персонажей' });
    const p    = el('div', { class: 'empty__text', html: 'Нажмите «Создать», чтобы добавить первого героя.' });
    const btn  = el('button', { class: 'btn btn-primary', type: 'button' }, [ icon('plus.svg'), 'Создать персонажа' ]);
    btn.addEventListener('click', openCreateModal);
    wrap.append(img, h, p, btn);
    return wrap;
  }

function charCard(ch){
  const cls = (ch.classId || '').toLowerCase();
  const card = el('article', { class:'char-card panel parchment-card', 'data-class': cls });

  const CLASS_THEME = {
    barbarian:{ accent:'#c23a2f' }, bard:{ accent:'#d57bb8' }, cleric:{ accent:'#c7e23f' },
    druid:{ accent:'#3aa255' }, fighter:{ accent:'#b56a3a' }, monk:{ accent:'#2af08d' },
    paladin:{ accent:'#e0d07b' }, ranger:{ accent:'#47a270' }, rogue:{ accent:'#8e8e8e' },
    sorcerer:{ accent:'#e55050' }, warlock:{ accent:'#7b4ca6' }, wizard:{ accent:'#4aa3e0' },
    artificer:{ accent:'#7fb6d5' }
  };
  const theme = CLASS_THEME[cls] || { accent:'#b0b0b0' };
  card.style.setProperty('--accent', theme.accent);

  // орнамент как на странице персонажа
  const ornament = el('div', { class:'char-card__ornament' });
  ornament.style.backgroundImage = `url('./assets/ui/header-ornaments/ornament-${cls}.png')`;

  const del = el('button', { class:'icon-btn char-card__delete', type:'button', title:'Удалить' }, icon('trash.svg'));
  del.addEventListener('click', (e)=>{ e.stopPropagation(); confirmDelete(ch.id); });

  const content = el('div', { class:'char-card__content' });
  const h = el('div', { class:'char-card__title' }, ch.name);
  const meta = el('div', { class:'char-card__meta meta' }, [
    el('span', { class:'dot' }),
    `${(classById(ch.classId).name)} • ${ch.race} • ур. ${ch.level}`
  ]);
  content.append(h, meta);

  card.addEventListener('click', ()=> Router.navTo(`/character/${ch.id}`));

  // ВАЖНО: НИКАКОГО .char-art — только пергамент + орнамент + контент
  card.append(ornament, del, content);
  return card;
}





  // ---------- кнопка "создать" ----------
  function plusCard(disabled){
    const card = el('button', { class:'plus-card panel', type:'button' }, [
      icon('plus.svg'),
      el('div',{class:'plus-card__text'}, disabled ? 'Лимит 4 персонажа' : 'Создать персонажа')
    ]);
    card.disabled = !!disabled;
    if (!disabled) card.addEventListener('click', openCreateModal);
    return card;
  }

  // ---------- сетка ----------
  function renderGrid(container, list){
    const grid = el('div',{class:'chars-grid'});
    const canAdd = list.length < MAX_CHARS;

    // сначала персонажи…
    list.forEach(ch => grid.append( charCard(ch) ));
    // …потом "создать"
    grid.append( plusCard(!canAdd) );

    const title = el('h1',{ class:'page-title' },'Мои персонажи');

    container.innerHTML = '';
    container.append(title, grid);
  }

  // ---------- удаление ----------
  function confirmDelete(id){
    const list = load();
    const ch = list.find(x=>x.id===id);
    if (!ch) return;
    const ok = confirm(`Удалить персонажа «${ch.name}»?`);
    if (!ok) return;
    const next = list.filter(x=>x.id!==id);
    save(next);
    rerender();
  }

  // ---------- модалка "Создать" ----------
  function openCreateModal(){
    const d = el('div',{class:'modal-backdrop'});
    const m = el('div',{class:'modal'});

    const head = el('div',{class:'modal__header'},[
      el('div',{class:'modal__title'},'Создать персонажа'),
      el('button',{class:'icon-btn',type:'button',title:'Закрыть'}, icon('close.svg'))
    ]);
    head.lastChild.addEventListener('click', ()=> d.remove());

    const body = el('div',{class:'modal__body'});

    // Имя
    body.append(
      el('div',{class:'form-row'},[
        el('label',{class:'label',for:'ch-name'},'Имя персонажа'),
        el('input',{class:'input',id:'ch-name',type:'text',placeholder:'Например: Торин дубощит'})
      ])
    );

    // Класс
    const classSel = el('select',{class:'select',id:'ch-class'});
    CLASSES.forEach(c=> classSel.append( el('option',{value:c.id}, c.name) ));
    body.append(
      el('div',{class:'form-row'},[
        el('label',{class:'label',for:'ch-class'},'Класс'),
        classSel
      ])
    );

    // Маленький превью-бейдж + подпись (оставим в модалке)
    const preview = el('div',{ class:'meta', style:'gap:8px; align-items:center;' }, [
      // маленький fallback круг — это только для модалки
      (()=>{
        const wrap = el('div',{ style:'width:20px;height:20px;border-radius:50%;overflow:hidden;display:grid;place-items:center;background:#1b1610;border:1px solid rgba(201,162,39,.4);' });
        const img  = el('img',{ alt:'', style:'width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 1px 0 rgba(0,0,0,.5));' });
        img.src = `./assets/icons/classes/${classSel.value}.svg?${v}`;
        img.onerror = ()=>{ img.src = `./assets/classes/${classSel.value}.webp?${v}`; img.style.objectFit='cover'; };
        wrap.append(img);
        return wrap;
      })(),
      el('span',{}, className(classSel.value))
    ]);
    body.append(preview);
    classSel.addEventListener('change', ()=>{
      const badge = preview.firstChild;
      const img = badge.querySelector('img');
      img.src = `./assets/icons/classes/${classSel.value}.svg?${v}`;
      img.onerror = ()=>{ img.src = `./assets/classes/${classSel.value}.webp?${v}`; img.style.objectFit='cover'; };
      preview.lastChild.textContent = className(classSel.value);
    });

    // Раса
    const raceSel = el('select',{class:'select',id:'ch-race'});
    RACES.forEach(r=> raceSel.append( el('option',{value:r}, r) ));
    body.append(
      el('div',{class:'form-row'},[
        el('label',{class:'label',for:'ch-race'},'Раса'),
        raceSel
      ])
    );

    // Уровень
    const levelInput = el('input',{class:'input',id:'ch-level',type:'number',min:'1',max:'20',value:'1'});
    body.append(
      el('div',{class:'form-row'},[
        el('label',{class:'label',for:'ch-level'},'Уровень'),
        levelInput
      ])
    );

    // Подвал
    const foot = el('div',{class:'modal__footer'});
    const cancel = el('button',{class:'btn btn-ghost',type:'button'},'Отмена');
    const create = el('button',{class:'btn btn-primary',type:'button'},'Создать');
    cancel.addEventListener('click', ()=> d.remove());
    create.addEventListener('click', ()=>{
      const name  = (document.getElementById('ch-name').value || '').trim();
      const classId = classSel.value;
      const race  = raceSel.value;
      const level = Math.max(1, Math.min(20, parseInt(levelInput.value||'1',10)));
      if (!name){ alert('Введите имя персонажа'); return; }
      const list = load();
      if (list.length >= MAX_CHARS){ alert('Достигнут лимит 4 персонажа'); return; }
      list.push({ id: uid(), name, classId, race, level });
      save(list);
      d.remove();
      rerender();
    });

    foot.append(cancel, create);
    m.append(head, body, foot);
    d.append(m);
    document.body.appendChild(d);
  }

  // ---------- публичное API ----------
  function render(container){
    const data = load();
    container.innerHTML = '';
    if (!data.length){
      const title = el('h1',{ class:'page-title' },'Мои персонажи');

      container.append(title, renderEmptyState());
    } else {
      renderGrid(container, data);
    }
  }
  function rerender(){ const root = document.getElementById('app'); render(root); }

  window.CharactersScreen = { render, rerender };
})();
