// Экран одного персонажа (шапка + секции + правки уровня + бейдж класса)
(function(){
  const STORAGE_KEY = 'pk.characters';
  const v = 'v=5';

  // --- helpers / storage ---
function el(tag, attrs = {}, children = []) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === 'class') n.className = v;
    else if (k === 'html') n.innerHTML = v;
    else if (k === 'style') n.setAttribute('style', v);
    else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v);
  }
  (Array.isArray(children) ? children : [children]).forEach(c => {
    if (c == null) return;
    n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  });
  return n;
}

const icon = name => el('img',{class:'icon',src:`./assets/icons/ui/${name}?${v}`,alt:''});

// ===== MIGRATION TO MULTICLASS =====
/**
 * Нормализация одного персонажа:
 * - добавляет .classes и .primary, если их нет
 * - чинит дубли/лимиты
 * - ЗЕРКАЛИТ старые поля: classId/level/subclassId ← первичный класс
 */
function normalizeCharacter(ch){
  if (!ch || typeof ch !== 'object') return ch;

  // 1) собрать первичный из старых полей, если classes отсутствует
  if (!Array.isArray(ch.classes) || ch.classes.length === 0){
    const baseId  = (ch.classId || '').toLowerCase() || 'fighter';
    const baseLvl = Math.max(1, Math.min(20, Number(ch.level || 1)));
    const baseSub = ch.subclassId || null;
    ch.classes = [{ id: baseId, level: baseLvl, subclassId: baseSub }];
    ch.primary = 0;
  }

  // 2) вычистить мусор/дубли/уровни
  const seen = new Set();
  ch.classes = ch.classes
    .filter(c => c && c.id)
    .map(c => ({
      id: String(c.id).toLowerCase(),
      level: Math.max(1, Math.min(20, Number(c.level || 1))),
      subclassId: c.subclassId ?? null
    }))
    .filter(c => { if (seen.has(c.id)) return false; seen.add(c.id); return true; })
    .slice(0, 3); // максимум 3 класса

  if (typeof ch.primary !== 'number' || ch.primary < 0 || ch.primary >= ch.classes.length){
    ch.primary = 0;
  }

  // 3) общий лимит 20 уровней — поджать «хвост»
  let sum = ch.classes.reduce((s,c)=>s+c.level,0);
  if (sum > 20){
    for (let i = ch.classes.length - 1; i >= 0 && sum > 20; i--){
      const over = sum - 20;
      const drop = Math.min(over, Math.max(0, ch.classes[i].level - 1));
      if (drop > 0){
        ch.classes[i].level -= drop;
        sum -= drop;
      }
    }
    // гарантия: хотя бы 1 уровень у каждого
    ch.classes = ch.classes.filter(c => c.level >= 1);
    if (ch.classes.length === 0){
      ch.classes = [{ id:'fighter', level:1, subclassId:null }];
      ch.primary = 0;
    }
  }

  // 4) зеркалим старые поля из primary (совместимость со старыми экранами)
  const p = ch.classes[ch.primary] || ch.classes[0];
  ch.classId    = p.id;
  ch.level      = p.level;
  ch.subclassId = p.subclassId ?? null;

  return ch;
}

/** загрузка всего списка с миграцией и обратной записью */
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

/** сохранение (гарантирует, что основное зеркало legacy-полей совпадает) */
function save(arr){
  const safe = Array.isArray(arr) ? arr.map(normalizeCharacter) : [];
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(safe)); } catch{}
}

  const CLASS_NAMES = {
    barbarian:'Варвар', bard:'Бард', cleric:'Жрец', druid:'Друид', fighter:'Воин', monk:'Монах',
    paladin:'Паладин', ranger:'Следопыт', rogue:'Плут', sorcerer:'Чародей', warlock:'Колдун',
    wizard:'Волшебник', artificer:'Изобретатель'
  };
  // Имена подклассов (пока только бард; дополним по мере добавления классов)
const SUBCLASS_NAMES = {
  bard: {
    valor:     'Коллегия доблести',
    lore:      'Коллегия знаний',
    swords:    'Коллегия мечей',
    glamour:   'Коллегия очарования',
    whispers:  'Коллегия шёпотов',
    eloquence: 'Коллегия красноречия',
    creation:  'Коллегия созидания',
  },
  barbarian: {
    berserker:  'Путь берсерка',
    totem:      'Путь тотемного воина',
    storm:      'Путь буревестника',
    ancestral:  'Путь предка-хранителя',
    zealot:     'Путь фанатика',
  },
  fighter: {
    battlemaster: 'Мастер боевых искусств',
    champion:     'Чемпион',
    banneret:     'Рыцарь Пурпурного дракона',
    cavalier:     'Кавалерист',
    samurai:      'Самурай',
  },
  wizard: {
    evocation:     'Школа Воплощения',
    conjuration:   'Школа Вызова',
    illusion:      'Школа Иллюзии',
    necromancy:    'Школа Некромантии',
    abjuration:    'Школа Ограждения',
    enchantment:   'Школа Очарования',
    transmutation: 'Школа Преобразования',
    divination:    'Школа Прорицания',
    war_magic:     'Военная магия',
    scribes:       'Орден писцов',
    bladesinging:  'Песнь клинка',
  },
    druid: {
    earth:    'Круг земли',
    moon:     'Круг луны',
    shepherd: 'Круг пастыря',
    dreams:   'Круг снов',
    wildfire: 'Круг дикого огня',
    stars:    'Круг звёзд',
    spores:   'Круг спор',
  },
  cleric: {
    storm:     'Домен бури',
    war:       'Домен войны',
    life:      'Домен жизни',
    knowledge: 'Домен знаний',
    trickery:  'Домен обмана',
    nature:    'Домен природы',
    light:     'Домен света',
  },
  artificer: {
    alchemist:    'Алхимик',
    artillerist:  'Артиллерист',
    battle_smith: 'Боевой кузнец',
    armorer:      'Бронник',
  },
  warlock: {
    archfey:        'Архифея',
    fiend:          'Исчадие',
    great_old_one:  'Великий Древний',
    undying:        'Бессмертный',
    hexblade:       'Ведьмовской клинок',
    celestial:      'Небожитель',
    fathomless:     'Бездонный',
    genie:          'Гений',
    undead:         'Нежить',
  },
    monk: {
    open_hand:       'Путь открытой ладони',
    shadow:          'Путь тени',
    four_elements:   'Путь четырёх стихий',
    long_death:      'Путь долгой смерти',
    kensei:          'Путь кэнсэя',
    drunken_master:  'Путь пьяного мастера',
    sun_soul:        'Путь солнечной души',
    astral_self:     'Путь астрального тела',
    mercy:           'Путь милосердия',
  },
 // Paladin
  paladin: {
    devotion:  'Клятва преданности',
    ancients:  'Клятва древних',
    vengeance: 'Клятва мести',
  },
  ranger: {
  hunter:         'Охотник',
  beast_master:   'Повелитель зверей',
  horizon_walker: 'Странник горизонта',
  gloom_stalker:  'Сумрачный охотник',
  monster_slayer: 'Убийца чудовищ',
  fey_wanderer:   'Странник фей',
  swarmkeeper:    'Хранитель роя',
},
// Sorcerer (Чародей) — происхождения
sorcerer: {
  // базовые ID
  draconic:        'Наследие драконьей крови',
  wild:            'Дикая магия',
  divine:          'Божественная душа',
  shadow:          'Теневая магия',
  storm:           'Штормовое колдовство',

  // возможные альтернативные ID/алиасы (на всякий)
  'draconic_bloodline':  'Наследие драконьей крови',
  'draconic-bloodline':  'Наследие драконьей крови',
  'wild_magic':          'Дикая магия',
  'wild-magic':          'Дикая магия',
  'divine_soul':         'Божественная душа',
  'divine-soul':         'Божественная душа',
  'shadow_magic':        'Теневая магия',
  'shadow-magic':        'Теневая магия',
  'storm_sorcery':       'Штормовое колдовство',
  'storm-sorcery':       'Штормовое колдовство',
},
  rogue: {
    thief:            'Вор',
    assassin:         'Убийца',
    arcane_trickster: 'Мистический ловкач',
    swashbuckler:     'Дуэлянт',
    mastermind:       'Комбинатор',
    scout:            'Скаут',
    inquisitive:      'Сыщик',
    phantom:          'Фантом',
    soulknife:        'Клинок души',

    // алиасы на всякий случай, если где-то camelCase прилетает
    arcaneTrickster:  'Мистический ловкач',
    swashBuckler:     'Дуэлянт',
  },



};
const SUBCLASS_LABEL_BY_CLASS = {
  bard:       'Коллегия',
  barbarian:  'Путь',
  fighter:    'Архетип',
  druid:      'Круг',
  cleric: 'Домен',
  artificer:  'Специальность',
  warlock:    'Покровитель',
  monk:       'Путь',
  paladin:    'Клятва', 
    rogue:      'Архетип',
   ranger: 'Архетип',
  sorcerer:   'Происхождение'

  // остальные классы позже добавим по мере надобности
};




  function getById(id){ return load().find(x=> x.id === id); }

function header(ch){
  const cls = (ch.classId || '').toLowerCase();
    // Иконка кнопки «Подкласс» по классу персонажа
  const _alias = { warrior: 'fighter', hunter: 'ranger' }; // на всякий случай
  const _normCls = _alias[cls] || cls;
  const _archKnown = new Set(['barbarian','bard','cleric','druid','fighter','monk','paladin','ranger','rogue','sorcerer','warlock','wizard','artificer']);
  const archIcon = _archKnown.has(_normCls) ? `archetypes/${_normCls}.svg` : 'filter.svg';


  const CLASS_THEME = {
    barbarian:{ wood:'#3a2420', accent:'#c23a2f' },
    bard:{      wood:'#2c1e29', accent:'#d57bb8' },
    cleric:{    wood:'#2b1f26', accent:'#cbd67a' },
    druid:{     wood:'#1e2a22', accent:'#3aa255' },
    fighter:{   wood:'#2b1e15', accent:'#b56a3a' },
    monk:{      wood:'#12241d', accent:'#2af08d' },
    paladin:{   wood:'#2a2616', accent:'#e0d07b' },
    ranger:{    wood:'#1c2a22', accent:'#47a270' },
    rogue:{     wood:'#222222', accent:'#8e8e8e' },
    sorcerer:{  wood:'#2a1b1b', accent:'#e55050' },
    warlock:{   wood:'#221b2a', accent:'#7b4ca6' },
    wizard:{    wood:'#17222c', accent:'#4aa3e0' },
    artificer:{ wood:'#162026', accent:'#7fb6d5' },
  };
  const theme = CLASS_THEME[cls] || { wood:'#2b241c', accent:'#b0b0b0' };

  // === контейнер шапки ===
  const wrap = el('div', { class:'hs-header' });
  wrap.style.setProperty('--wood-color', theme.wood);
  wrap.style.setProperty('--accent', '#2f2114'); // орнамент/иконки — фикс
  wrap.style.setProperty('--iconbtn-size', '56px');
  wrap.style.setProperty('--iconbar-w', '60px');

  // «ручки»
  wrap.style.setProperty('--hdr-h', '160px');
  wrap.style.setProperty('--paper-scale', '1');
  wrap.style.setProperty('--paper-offset-x', '0px');
  wrap.style.setProperty('--paper-offset-y', '0px');
  wrap.style.setProperty('--ornament-img', `url("../assets/ui/header-ornaments/ornament-${cls}.png")`);
  wrap.style.setProperty('--ornament-size', '200px');
  wrap.style.setProperty('--ornament-offset-y', '0px');
  wrap.style.setProperty('--ornament-opacity', '.33');
  wrap.style.setProperty('--ornament-offset-x', '1px');
  wrap.style.setProperty('--title-size', '22px');
  wrap.style.setProperty('--subtitle-size', '14px');
  wrap.style.setProperty('--paper-img', 'url("../assets/ui/header-paper.png")');

  // слои
  const bg       = el('div', { class:'hs-header__bg' });
  const paper    = el('div', { class:'hs-header__paper' });
  const ornament = el('div', { class:'hs-header__ornament' });

  // ряд с левой колонкой (для нижних иконок) и правой (заголовок)
  const row   = el('div', { class:'hs-header__row' });
  row.style.alignItems = 'flex-start';   // прижимаем содержимое вверх

  const left  = el('div', { class:'hs-header__left' });
  const title = el('div', { class:'hs-header__title' });
  // ===== ВЕРТИКАЛЬНЫЙ СДВИГ ИМЕНИ + МЕТЫ ВВЕРХ (регулируешь только эту величину) =====
const V_SHIFT_PX = -55;                 // отрицательное — выше, положительное — ниже
title.style.transform = `translateY(${V_SHIFT_PX}px)`;
title.style.willChange = 'transform';

  title.style.alignItems = 'flex-start';
title.style.justifyContent = 'flex-start';
title.style.height = 'auto';

  title.style.marginTop = '1px'; // ← вот это и регулируй (например 5px, 15px)

// — фикс: тянуть содержимое ряда вверх
row.style.alignItems = 'flex-start';
title.style.alignSelf = 'flex-start';

  // === кнопки ===
  const icons = el('div', { class:'hs-iconbar' });
  
  function icBtn(iconFile, titleText, onClick){
  const attrs = { class:'hs-ic', type:'button' };
  if (titleText) attrs.title = titleText;            // ← не ставим title, если пусто
  const b = el('button', attrs);
  const img = el('div', { class:'hs-ic__img' });
  b.style.setProperty('--icon-url', `url("../assets/icons/ui/${iconFile}")`);
  b.append(img);
  b.addEventListener('click', onClick);
  return b;
}

// ——— Чипсы классов и действия ———
function setPrimaryClass(ch, idx){
  const list = load();
  const i = list.findIndex(x => x.id === ch.id);
  if (i >= 0){
    list[i].primary = idx;
    save(list); // save() уже зеркалит legacy-поля
    render(document.getElementById('app'), ch.id);
  }
}

// Полноценная модалка мультикласса (без внешних файлов)
function openMulticlass(charId){
  const ch0 = (load() || []).find(x => x.id === charId);
  if (!ch0) { alert('Персонаж не найден'); return; }

  // нормализуем рабочую копию
  const ch = normalizeCharacter(JSON.parse(JSON.stringify(ch0)));

  const CLASS_RU = (typeof CLASS_NAMES !== 'undefined') ? CLASS_NAMES : {
    barbarian:'Варвар', bard:'Бард', cleric:'Жрец', druid:'Друид', fighter:'Воин',
    monk:'Монах', paladin:'Паладин', ranger:'Следопыт', rogue:'Плут',
    sorcerer:'Чародей', warlock:'Колдун', wizard:'Маг', artificer:'Изобретатель'
  };
  const ALL_CLASS_IDS = Object.keys(CLASS_RU);
  const SUBCLASS_LEVEL_REQ = {
    barbarian:3,bard:3,cleric:1,druid:2,fighter:3,monk:3,paladin:3,ranger:3,rogue:3,
    sorcerer:1,warlock:1,wizard:2,artificer:3
  };
  const SUBMAP = window.SUBCLASS_NAMES || {};

  function classLine(c){
    return (c.classes||[]).map(x => `${CLASS_RU[x.id]||x.id} ${x.level}`).join(' • ');
  }

  const d = el('div',{class:'modal-backdrop'});
  const m = el('div',{class:'modal modal--plain'});
  m.style.color = '#f5e8c8';
m.style.filter = 'none';
m.style.mixBlendMode = 'normal';

m.style.maxWidth = '680px';
m.style.width = 'calc(100% - 24px)';
m.style.padding = '12px';
m.style.color = '#f5e8c8';
m.style.filter = 'none';
m.style.mixBlendMode = 'normal';


  const head = el('div',{class:'modal__header'},[
  el('div',{class:'modal__title'}, 'Классы и уровни'),
  el('button',{
    class:'btn btn-ghost',
    type:'button',
    title:'Закрыть',
    style:'font-size:18px;padding:0 8px;line-height:1;background:transparent;border:none;color:inherit;'
  }, '✕')
]);

  head.lastChild.addEventListener('click', ()=> d.remove());

  const body = el('div',{class:'modal__body'});
  body.style.setProperty('color', '#f5e8c8', 'important');


body.style.padding = '8px 6px';


  const info = el('div',{class:'meta', html:`${classLine(ch)} • <i>${ch.race||''}</i>`});
  info.style.marginBottom = '8px';
  info.style.setProperty('color', '#f5e8c8', 'important');

  body.append(info);

  // таблица классов
  const table = el('div',{});
  function redrawTable(){
    table.innerHTML = '';
    const wrap = el('div',{style:'display:grid; gap:8px;'});
    (ch.classes||[]).forEach((c,idx)=>{
      const row = el('div',{style:'display:grid; grid-template-columns: 1fr auto auto 48px auto auto; gap:6px; align-items:center;'});

      row.append( el('div',{}, `${CLASS_RU[c.id]||c.id}`) );

      const minus = el('button',{class:'btn',type:'button',style:'width:32px;height:32px;padding:0;line-height:30px;font-size:18px;'},'−');
const lvl   = el('div',{style:'min-width:28px;text-align:center;font-size:14px;'}, String(c.level));
const plus  = el('button',{class:'btn',type:'button',style:'width:32px;height:32px;padding:0;line-height:30px;font-size:18px;'},'+');

      minus.addEventListener('click', ()=>{
  if (c.level > 1){ 
    c.level--;
    updateAfterChange(true); // ← перерисовываем строку и заголовок
  }
});
plus.addEventListener('click', ()=>{
  const sum = ch.classes.reduce((s,x)=>s+x.level,0);
  if (sum < 20){
    c.level++;
    updateAfterChange(true); // ← перерисовываем строку и заголовок
  }
});

      row.append(minus, lvl, plus);

      const options = SUBMAP[c.id] || null;
const needLvl = SUBCLASS_LEVEL_REQ[c.id] || 3;
// селект добавляем ТОЛЬКО если есть варианты и уровень позволяет
if (options && Object.keys(options).length && c.level >= needLvl){
  const subSel = el('select',{class:'select', style:'max-width:100%;font-size:14px;padding:4px 6px;height:32px;'});

  subSel.append( el('option',{value:''}, 'Архетип…') );
  Object.keys(options).forEach(subId=>{
    subSel.append( el('option',{value:subId}, options[subId]) );
  });
  subSel.value = c.subclassId || '';
  subSel.addEventListener('change', ()=>{ c.subclassId = subSel.value || null; updateAfterChange(); });
  row.append(subSel);
} else {
  // пустая ячейка, чтобы сетка оставалась ровной
  row.append( el('div',{}) );
}


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

  // блок добавления класса
  const addBox = el('div',{style:'margin-top:10px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;'});
  const addSel = el('select',{class:'select'});
  const addBtn = el('button',{class:'btn',type:'button'},'Добавить');
  function allowedToAddIds(){
    const have = new Set((ch.classes||[]).map(x=>x.id));
    return ALL_CLASS_IDS.filter(id => !have.has(id));
  }
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
    normalizeCharacter && normalizeCharacter(ch);
    info.innerHTML = `${classLine(ch)} • <i>${ch.race||''}</i>`;
    if (rebuild){ redrawTable(); redrawAdd(); } else { redrawAdd(); }
  }

  redrawTable(); redrawAdd();
  body.append(table, el('div',{style:'height:8px'}), addBox);


  const foot = el('div',{class:'modal__footer'});
  const cancel = el('button',{class:'btn btn-ghost',type:'button'},'Отмена');
  const saveBtn = el('button',{class:'btn btn-primary',type:'button'},'Сохранить');
  foot.style.gap = '8px';
[cancel, saveBtn].forEach(b=>{
  b.style.height = '36px';
  b.style.fontSize = '14px';
  b.style.padding = '6px 12px';
});

  cancel.addEventListener('click', ()=> d.remove());
  saveBtn.addEventListener('click', ()=>{
    // commit в localStorage
    const list = load();
    const i = list.findIndex(x=>x.id===ch.id);
    if (i>=0) list[i] = ch; else list.push(ch);
    save(list);
    d.remove();
    // перерисовать экран персонажа
    try{ window.CharacterScreen && window.CharacterScreen.render(document.getElementById('app'), ch.id); }catch(e){}
  });

  m.append(head, body, foot);
  foot.append(cancel, saveBtn);
  d.append(m);
  document.body.appendChild(d);
}




function renderClassChips(ch){
  const box = el('div', { class:'class-chips' });
  // компактная верстка
  box.style.display = 'flex';
  box.style.flexWrap = 'wrap';
  box.style.gap = '6px';
  box.style.justifyContent = 'center';

  // чипсы по каждому классу
  (ch.classes || []).forEach((c, idx) => {
    const name = (CLASS_NAMES[c.id] || c.id);
    const btn = el('button', { class:'btn', type:'button' }, `${name} ${c.level}`);
    btn.style.padding = '4px 10px';
    btn.style.fontSize = '12px';
    btn.style.lineHeight = '1';
    if (idx === ch.primary) btn.classList.add('btn-primary');
    btn.title = 'Сделать основным классом (меняет акцент оформления)';
    btn.addEventListener('click', () => setPrimaryClass(ch, idx));
    box.append(btn);
  });

  // кнопка «+ класс» (пока заглушка; на след. этапе откроет модалку)
  const add = el('button', { class:'btn', type:'button' }, '+ класс');
  add.style.padding = '4px 10px';
  add.style.fontSize = '12px';
  add.addEventListener('click', () => openMulticlassModalStub(ch.id));
  box.append(add);

  return box;
}

  // левый верхний крестик (назад) — отдельной кнопкой с absolute
  const backBtn = icBtn('close.svg', 'Назад', ()=> Router.navTo('/characters'));
  backBtn.style.setProperty('--iconbtn-size', '40px');  // ← размер кнопки крестика

  backBtn.style.position = 'absolute';
  backBtn.style.top = '8px';
  backBtn.style.left = '8px';
  backBtn.style.zIndex = '5';

 // актуальный список классов персонажа (мультикласс или фолбэк к одному классу)
const classesArr = (Array.isArray(ch.classes) && ch.classes.length)
  ? ch.classes.map(c => ({ id: c.id || c.classId || c, level: Number(c.level || 1) }))
  : [{ id: ch.classId, level: Number(ch.level || 1) }];

// по иконке «Подкласс» на каждый класс
// ОДНА кнопка «Подкласс» — только по основному классу
const primaryIdx = Math.max(0, Number(ch.primary || 0));
const primaryClassId = (Array.isArray(ch.classes) && ch.classes.length)
  ? (ch.classes[primaryIdx]?.id || ch.classes[0].id)
  : ch.classId;

icons.append(
  icBtn(archIcon, 'Подкласс', () => { pickSubclassForCharacter(ch, primaryClassId); })
);



// остальное — как было
icons.append(
  icBtn('edit.svg', 'Классы и уровни', () => { openMulticlass(ch.id); }),
  icBtn('table.svg', 'Таблица', () => { if (window.TableModal) TableModal.open({ classId: ch.classId, level: ch.level }); }),
  icBtn('book.svg', 'Каталог заклинаний', ()=> Router.navTo(`/spells?char=${encodeURIComponent(ch.id)}`)),
);
const btnSubrace = icBtn('half-dead.svg', '', () => {   // ← пустой title, чтобы не было подсказки
  if (window.SubraceModal) SubraceModal.open(ch.id);
  else console.warn('SubraceModal не загружен');
});
btnSubrace.style.transform = 'translateY(6px)';         // ← чуть ниже иконку
icons.append(btnSubrace);





  // Насколько поднять вверх весь блок "Имя + Мета"
const TOP_OFFSET = '14px'; // ← меняй только это значение (например '10px' / '18px')

const stack = el('div', {});
stack.style.display = 'flex';
stack.style.flexDirection = 'column';
stack.style.alignItems = 'center';
stack.style.justifyContent = 'flex-start';
stack.style.rowGap = '6px';
stack.style.paddingTop = '0';
stack.style.marginTop = TOP_OFFSET;


  const h = el('h1', {}, ch.name);

// Строка «классы • раса» как раньше
const classLine = (ch.classes || [])
  .map(c => `${CLASS_NAMES[c.id] || c.id} ${c.level}`)
  .join(' • ');

const meta = el('div', { class:'meta-inline' }, `${classLine} • ${ch.race}`);
// делаем контейнер гибким, чтобы кнопка «+» встала рядом и не толкала верстку
meta.style.display = 'inline-flex';
meta.style.alignItems = 'center';
meta.style.gap = '6px';
meta.style.fontSize = '14px';

// Прозрачная маленькая кнопка «+»
const addBtn = el('button', { class:'btn btn-ghost', type:'button' }, '+');
// визуально как текст: без фона/рамки, маленькая
addBtn.style.padding = '0 6px';
addBtn.style.height = '26px';
addBtn.style.lineHeight = '26px';
addBtn.style.fontSize = '18px';
addBtn.style.fontWeight = 'bold';
addBtn.style.border = 'none';
addBtn.style.background = 'transparent';
addBtn.style.color = 'inherit';
addBtn.style.cursor = 'pointer';
addBtn.style.transition = 'transform 0.15s';
addBtn.addEventListener('mouseenter', () => addBtn.style.transform = 'scale(1.15)');
addBtn.addEventListener('mouseleave', () => addBtn.style.transform = 'scale(1)');
addBtn.addEventListener('click', () => openMulticlass(ch.id));




// добавляем «плюс» прямо рядом со строкой
meta.append(addBtn);

stack.append(h, meta);


  title.append(stack);
left.append(icons);

  // сборка
  row.append(left, title);
  wrap.append(bg, paper, ornament, backBtn, row);
  return wrap;
}


  function section(title, emptyText){
    const block = el('div', { class:'panel', style:'padding:14px; margin-bottom:12px;' });
    const h = el('h2', {}, title);
    const muted = el('div', { class:'empty__text', html: emptyText });
    block.append(h, muted);
    return block;
  }

function gatherFeaturesForCharacter(char) {
  const out = [];
  if (!char || !char.classId) return out;

  const classId = char.classId;
  const lvl = Number(char.level || 1);
  const CF = (window.CLASS_FEATURES && window.CLASS_FEATURES[classId]) || null;

  // Белый список базовых умений по классам (сейчас — для волшебника)
  const BASE_ALLOWED_BY_CLASS = {
  wizard: [
    'Магическое восстановление',
    'Магические традиции',
    'Формулы заговоров',
    // 'Увеличение характеристик', // скрываем из раздела "Умения"
    'Мастерство заклинателя',
    'Фирменное заклинание',
  ],
};
// Глобальный список скрытых фич (не показываем в разделе "Умения")
// Глобальный список скрытых фич (не показываем в разделе "Умения")
const GLOBAL_HIDDEN_FEATURES = [
  'Увеличение характеристик',
  'Боевой стиль',
  'Варианты боевых стилей',
  'Использование заклинаний',
  'Дополнительные заклинания'
];

// Нормализация названий: убираем круглые/квадратные скобки с содержимым,
// лишние пробелы, приводим к нижнему регистру
function normalizeFeatName(s){
  return String(s || '')
    .replace(/\(.*?\)/g, '')   // (Коллегия мечей), (повторный выбор) и т.п.
    .replace(/\[.*?\]/g, '')   // [Воин]/[Паладин] и т.п.
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

// Проверка «скрытости» с учётом нормализации
function isHiddenFeature(name){
  const base = normalizeFeatName(name);
  return GLOBAL_HIDDEN_FEATURES.some(x => normalizeFeatName(x) === base);
}



  const allowBase = (name) => {
    const list = BASE_ALLOWED_BY_CLASS[classId];
    if (!list) return true; // для других классов пока не фильтруем
    const low = String(name).trim().toLowerCase();
    return list.some(n => n.toLowerCase() === low);
  };

  // 1) База класса — берём ТОЛЬКО разрешённые из белого списка
if (CF) {
  const baseMap = CF.core || CF.base || CF;
  for (let i = 1; i <= lvl; i++) {
    const arr = Array.isArray(baseMap[i]) ? baseMap[i] : (baseMap[i] || []);
    for (const name of arr) {
      if (allowBase(name) && !isHiddenFeature(name)) {
        out.push({ level: i, name });
      }
    }
  }
}

// 2) Подкласс (все умения традиции показываем всегда, кроме скрытых)
const subclassId = char.subclassId;
let subclassAddedCount = 0;

if (subclassId && CF && CF.subclasses && CF.subclasses[subclassId]) {
  const sub = CF.subclasses[subclassId]; // { name?, 2:[..],6:[..],10:[..],14:[..] }
  for (let i = 1; i <= lvl; i++) {
    const arr = Array.isArray(sub[i]) ? sub[i] : (sub[i] || []);
    for (const name of arr) {
      if (!isHiddenFeature(name)) {
        out.push({ level: i, name });
        subclassAddedCount++;
      }
    }
  }
}


  // 3) Фолбэк: если из CLASS_FEATURES по традиции ничего не добавилось — добираем из SUBCLASS_PROGRESSIONS
  if (subclassId && subclassAddedCount === 0 && window.SUBCLASS_PROGRESSIONS && window.SUBCLASS_PROGRESSIONS[classId]) {
    const prog = window.SUBCLASS_PROGRESSIONS[classId][subclassId] || [];
    prog.forEach(step => {
      const L = Number(step.level || step.lvl || 0);
      if (!L || L > lvl) return;
      (step.features || []).forEach(name => {
  if (!isHiddenFeature(name)) out.push({ level: L, name });
});

    });
  }

  // Порядок вывода
  // 4) Убираем дубликаты одинаковых умений (оставляем самое раннее получение)
const seen = new Map();

// защищаем «ступени», которые реально разные по смыслу и не должны схлопываться
const DEDUP_PROTECT = new Set([
  'Дополнительная атака (2)',
  'Дополнительная атака (3)',
]);

function dedupKey(name) {
  let t = String(name).trim();

  // НЕ трогаем защищённые точные названия
  if (DEDUP_PROTECT.has(t)) return t.toLowerCase();

  // нормализуем частые суффиксы, где текст описания один и тот же:
  // «(к6/к8/к10/к12)» и «(одно/два/три использования)»
  t = t.replace(/\s*\(к\d+\)\s*$/i, '');
  t = t.replace(/\s*\((?:одно|два|три)\s+использования?\)\s*$/i, '');

  return t.toLowerCase();
}

const deduped = [];
for (const it of out) {
  const key = dedupKey(it.name);
  if (!seen.has(key)) {
    seen.set(key, it);                   // первое вхождение — самое раннее по уровню
    deduped.push(it);
  } else {
    const prev = seen.get(key);
    // если вдруг встретили такое же умение на БОЛЕЕ раннем уровне — заменим
    if (it.level < prev.level) {
      seen.set(key, it);
      const idx = deduped.indexOf(prev);
      if (idx !== -1) deduped[idx] = it;
    }
  }
}

// Порядок вывода
deduped.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name, 'ru'));
return deduped;

}



// === ОТКРЫТИЕ ОПИСАНИЯ УМЕНИЯ (без дублей названия; фиксы для барда) ===
function openFeature(title){
  const details = (window.FEATURE_DETAILS || {});
  const item = details[title];

  // Заголовок без суффикса "(к6)/(к8)/(к10)/(к12)"
  const displayTitle = String(title || '').replace(/\s*\(к\d+\)\s*$/i, '').trim();

  // Рендер: переносы -> <br>, таблицы не ломаем, убираем дубль названия,
  // и правим «скейлящиеся» фразы у барда.
  const renderFeatureHtml = (src) => {
    let html = src || 'Пока подробного описания нет.';

    // Вырежем таблицы временно
    const tables = [];
    html = html.replace(/<table[\s\S]*?<\/table>/gi, m => {
      tables.push(m);
      return `__TABLE_${tables.length - 1}__`;
    });

    // Переводим переносы строк в <br>
    html = html.replace(/\r?\n/g, '<br>');

    // Возвращаем таблицы
    html = html.replace(/__TABLE_(\d+)__/g, (_, i) => tables[i]);

    // 1) Удаляем дублирующую первую строку с названием (обычно КАПСОМ)
    const br = html.indexOf('<br>');
    if (br !== -1) {
      const firstLine = html.slice(0, br).replace(/<[^>]*>/g, '').trim();
      const norm = s => s.replace(/\(.*?\)/g,'').trim().toLowerCase();
      if (norm(firstLine) === norm(displayTitle)) {
        html = html.slice(br + 4);
      }
    }

    // 2) Спец-фиксы для «Вдохновения барда» и «Песни отдыха»
    const isBardicInspiration = /вдохновение\s+барда/i.test(displayTitle);
    const isSongOfRest       = /песн[ья]\s+отдыха/i.test(displayTitle);

    if (isBardicInspiration) {
      // «кость бардовского вдохновения — к6» -> «к6/к8/к10/к12»
      html = html.replace(
        /кость\s+бардовского\s+вдохновения\s*—\s*к6/gi,
        'кость бардовского вдохновения — к6/к8/к10/к12'
      );
    }
    if (isSongOfRest) {
      // «дополнительно 1к6 хитов» -> «1к6/1к8/1к10/1к12 хитов»
      html = html.replace(
        /дополнительно\s+1к6\s+хитов/gi,
        'дополнительно 1к6/1к8/1к10/1к12 хитов'
      );
    }
// Убираем кликабельность ссылок ВНУТРИ описания умения (в модалке)
html = html.replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, '$1');

    return html;
  };

  // Контейнер содержимого
  const wrap = document.createElement('div');

  const h = document.createElement('div');
  h.style.cssText = 'font-size:18px;font-weight:700;margin-bottom:8px;';
  h.textContent = displayTitle;            // <-- БЕЗ "(к12)"

  const t = document.createElement('div');
  t.className = 'feature-text';
  t.innerHTML = renderFeatureHtml(item && item.text);

  wrap.appendChild(h);
  wrap.appendChild(t);

  // Если есть глобальная модалка — используем её
  if (typeof window.showInModal === 'function') {
    window.showInModal(wrap, 'Умение');
    return;
  }

 // Fallback-модалка (заменено: используем единый modal-backdrop + modal--sheet)
{
  // стандартный бэкдроп
  const d = document.createElement('div');
  d.className = 'modal-backdrop';

  // коробка — свиток
  const m = document.createElement('div');
  m.className = 'modal modal--sheet';
  // при необходимости можно перенастроить ширину/высоту:
  // m.style.setProperty('--sheet-w', '860px');

  // шапка
  const head = document.createElement('div');
  head.className = 'modal__header';
  const ttl = document.createElement('div');
  ttl.className = 'modal__title';
  ttl.textContent = 'Умение';
  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'icon-btn';
  closeBtn.title = 'Закрыть';
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', ()=> d.remove());
  head.appendChild(ttl);
  head.appendChild(closeBtn);

  // тело со скроллом; wrap уже создан выше (в коде он содержит заголовок + текст)
  const body = document.createElement('div');
  body.className = 'modal__body';
  const typo = document.createElement('div');
  typo.className = 'hs-typo';
  // wrap — переменная из верхнего куска кода (контент умения). Просто переносим его внутрь.
  typo.appendChild(wrap);
  body.appendChild(typo);

  // футер
  const foot = document.createElement('div');
  foot.className = 'modal__footer';
  const ok = document.createElement('button');
  ok.type = 'button';
  ok.className = 'btn';
  ok.textContent = 'Закрыть';
  ok.addEventListener('click', ()=> d.remove());
  foot.appendChild(ok);

  // соберём модалку и рендерим
  m.appendChild(head);
  m.appendChild(body);
  m.appendChild(foot);
  d.appendChild(m);
  document.body.appendChild(d);
}

}




// Секция "Приёмы и умения" (фиксированная PNG-рамка, внутри скролл)
function renderFeaturesSection(ch){
  const CLASS_RU = {
    barbarian:'Варвар', bard:'Бард', cleric:'Жрец', druid:'Друид', fighter:'Воин',
    monk:'Монах', paladin:'Паладин', ranger:'Следопыт', rogue:'Плут',
    sorcerer:'Чародей', warlock:'Колдун', wizard:'Маг', artificer:'Изобретатель'
  };

  function classSkinPath(classId){
    const alias = { fighter:'class_warrior', ranger:'class_hunter' };
    const file  = alias[classId] || ('class_'+classId);
    return `./assets/illustrations/ui/${file}.png`;
}

  // PNG подклассов: ./assets/ui/subclasses/<classId>-<subId>.png
  function subclassSkinPath(classId, subId){
    return `./assets/illustrations/ui/subclasses/${classId}-${subId}.png`;
}

  // навешиваем фон с фолбэком на скин класса
  function applySkin(btn, classId, subId){
    const clsUrl = classSkinPath(classId);
    if (!subId){ btn.style.backgroundImage = `url("${clsUrl}")`; return; }
    const img = new Image();
    img.onload  = ()=> btn.style.backgroundImage = `url("${subclassSkinPath(classId, subId)}")`;
    img.onerror = ()=> btn.style.backgroundImage = `url("${clsUrl}")`;
    img.src = subclassSkinPath(classId, subId);
  }

  // ---- ВНЕШНЯЯ РАМКА ----
  const frame    = el('div', { class:'hs-frame' });
  const frameImg = el('img', { class:'hs-frame__img', alt:'', src:'./assets/ui/hs-gold-frame-umenia.png' });
  const body     = el('div', { class:'hs-frame__body' });
  const scroller = el('div', { class:'hs-frame__scroll' });

  // «ручки»
  frame.style.setProperty('--frame-max-h', '65vh');
  frame.style.setProperty('--pad-top',     '48px');
  frame.style.setProperty('--pad-bottom',  '36px');
  frame.style.setProperty('--pad-left',    '18px');
  frame.style.setProperty('--pad-right',   '18px');
  frame.style.setProperty('--feat-cols',      '2');
  frame.style.setProperty('--feat-gap',       '3px');
  frame.style.setProperty('--feat-w', '120px');
  frame.style.setProperty('--feat-h',         '66px');
  frame.style.setProperty('--feat-font-size', '11px');

  scroller.append( el('h2', {}, 'Приёмы и умения') );

  const details = window.FEATURE_DETAILS || {};
  const classes = (Array.isArray(ch.classes) && ch.classes.length)
    ? ch.classes
    : [{ id: ch.classId, level: ch.level, subclassId: ch.subclassId }];

  let totalShown = 0;

  classes.forEach(c => {
    const classId = String(c.id).toLowerCase();
    const lvl     = Math.max(1, Math.min(20, Number(c.level||1)));
    const subId   = c.subclassId || null;
const alias = { fighter:'class_warrior', ranger:'class_hunter' };
const file  = alias[classId] || `class_${classId}`;
const skinUrl = `./assets/ui/${file}.png`;


    const CF = (window.CLASS_FEATURES || {})[classId] || {};
    const baseMap = CF.base || CF.core || {};
    const subMap  = (subId && CF.subclasses && CF.subclasses[subId]) ? CF.subclasses[subId] : null;

    // собрать имена до уровня
    const baseFeats = [];
    Object.keys(baseMap).map(Number).sort((a,b)=>a-b).forEach(L=>{
      if (L<=lvl) (baseMap[L]||[]).forEach(n=> baseFeats.push(n));
    });

    const subFeats = [];
    if (subMap){
      Object.keys(subMap).map(Number).sort((a,b)=>a-b).forEach(L=>{
        if (L<=lvl) (subMap[L]||[]).forEach(n=> subFeats.push(n));
      });
    }

    // подпись класса
  scroller.append( el('div', { class:'meta meta--feat', style:'text-align:center;' },
  `${(CLASS_RU[classId]||classId)} • ур. ${lvl}`
) );



    // ---- базовые умения (скин КЛАССА) ----
    const baseShown = baseFeats.filter(name => !!details[name]);
    if (baseShown.length){
      const gridBase = el('div', { class:'hs-feat-grid' });
      gridBase.setAttribute('data-ch-class', classId);
      baseShown.forEach(name=>{
        const btn = el('button', { class:'hs-feat-btn', type:'button' },
  el('span', { class:'hs-feat-btn__label' }, name)
);

btn.addEventListener('click', ()=> openFeature(name));
gridBase.append(btn);

      });
      scroller.append(gridBase);
      totalShown += baseShown.length;
    }

    // ---- умения ПОДКЛАССА (скин ПОДКЛАССА, фолбэк на класс) ----
    const subShown = subFeats.filter(name => !!details[name]);
    if (subShown.length){
      scroller.append( el('div', { class:'meta meta--feat-sub', style:'text-align:center;' }, 'Архетип') );


      const gridSub = el('div', { class:'hs-feat-grid' });
      gridSub.setAttribute('data-ch-class', classId);

      subShown.forEach(name=>{
        const btn = el('button', { class:'hs-feat-btn', type:'button' },
  el('span', { class:'hs-feat-btn__label' }, name)
);

btn.addEventListener('click', ()=> openFeature(name));
gridSub.append(btn);

      });
      scroller.append(gridSub);
      totalShown += subShown.length;
    }
  });

  if (totalShown === 0){
    scroller.append( el('div', { class:'empty__text', html:'Пока умений с описанием на этом уровне нет.' }) );
  }

  body.append(scroller);
  frame.append(body, frameImg);
  return frame;
}





function renderRaceTraitsSection(ch){
  const dict = window.RACE_TRAITS || {};
  const raceName = ch && ch.race;
  const data = raceName ? (dict[raceName] || null) : null;

  // Внешняя рамка
  const frame    = el('div', { class:'hs-frame' });
  const frameImg = el('img', { class:'hs-frame__img', alt:'', src:'./assets/ui/hs-gold-frame-race.png' });
  const body     = el('div', { class:'hs-frame__body' });
  const scroller = el('div', { class:'hs-frame__scroll' });

  // === РУЧКИ (крути по вкусу) ===
frame.style.setProperty('--frame-max-h', '65vh');
frame.style.setProperty('--frame-min-h', '38vh');
frame.style.setProperty('--pad-top',     '58px');   // было 48px
frame.style.setProperty('--pad-bottom',  '40px');   // было 36px
frame.style.setProperty('--pad-left',    '45px');   // было 18px
frame.style.setProperty('--pad-right',   '45px');   // было 18px
frame.style.setProperty('--race-font-size', '15px'); // размер текста

  // === /РУЧКИ ===

  const title = el('h2', {}, 'Способности расы');
// === Подраса: готовим ЭЛЕМЕНТ в стиле трейта (race-trait), добавим позже в список ===
let subraceItem = null;
(function(){
  const name = (ch && ch.subrace) ? String(ch.subrace) : '';
  if (!name) return;
  const r = ch.race || '';
  let html = (window.SUBRACE_DESC && window.SUBRACE_DESC[r] && window.SUBRACE_DESC[r][name]) || '';
  if (!html) return;

  // та же предобработка, что у расовых трейтов:
  html = String(html);
  if (/<tbody[\s>]/i.test(html) && !/<table[\s>]/i.test(html)) html = `<table>${html}</table>`;
  if (!/<table[\s>]/i.test(html)) html = html.replace(/\n/g, '<br>');

  // делаем “точь-в-точь” как у пункта расы: <div class="race-trait"><strong>..</strong><span>..</span>
  subraceItem = el('div', { class:'race-trait' }, [
    el('strong', {}, `Подраса: ${name}`),
    el('span', { html })
  ]);
})();




  // Пустое состояние
  if (!data || !Array.isArray(data.traits) || data.traits.length === 0){
    scroller.append(
      title,
      el('div', { class:'empty__text', html:'Для выбранной расы пока нет описаний.' })
    );
    body.append(scroller);
    frame.append(body, frameImg);
    return frame;
  }

  // Контент
  const list = el('div', { class:'hs-race-typo' });

  data.traits.forEach(t => {
    const item = el('div', { class:'race-trait' });

    // заголовок умения
    if (t.name) item.append(el('strong', {}, t.name + (t.text ? ':' : '')));

    // текст/HTML; поддержка <tbody> без <table>, переносы \n -> <br>, если нет таблицы
    let html = String(t.html || t.text || '');
    if (/<tbody[\s>]/i.test(html) && !/<table[\s>]/i.test(html)) html = `<table>${html}</table>`;
    if (!/<table[\s>]/i.test(html)) html = html.replace(/\n/g, '<br>');

    item.append(el('span', { html }));
    list.appendChild(item);
  });
if (subraceItem) list.appendChild(subraceItem);

  // Таблицы: переносим .table_header в <thead>, вешаем класс для стилей
  Array.from(list.querySelectorAll('table')).forEach(tbl => {
    tbl.classList.add('race-table');
    const headerRow = tbl.querySelector('tr.table_header');
    if (headerRow){
      const thead = document.createElement('thead');
      const tr = document.createElement('tr');
      Array.from(headerRow.children).forEach(td => {
        const th = document.createElement('th');
        th.innerHTML = td.innerHTML;
        tr.appendChild(th);
      });
      thead.appendChild(tr);
      tbl.insertBefore(thead, tbl.firstChild);
      headerRow.remove();
    }
  });

  scroller.append(title, list);
body.append(scroller);
frame.append(body, frameImg);
return frame;


}


// === /СЕКЦИЯ: «Способности расы» ===========================


// Универсальный выбор подкласса: сначала пробуем CLASS_FEATURES.*.subclasses,
// если их нет — берём из SUBCLASS_PROGRESSIONS[<classId>] (каркас под Волшебника).
function pickSubclassForCharacter(ch){
  const classId = ch.classId;
  const CF = (window.CLASS_FEATURES && window.CLASS_FEATURES[classId]) || {};

  // 1) основной источник
  let subs = (CF.subclasses && { ...CF.subclasses }) || {};

  // 2) фолбэк/объединение: если есть SUBCLASS_PROGRESSIONS — добавим недостающие ветки
  const SP = (window.SUBCLASS_PROGRESSIONS && window.SUBCLASS_PROGRESSIONS[classId]) || {};
  if (SP && Object.keys(SP).length) {
    for (const [subId, arr] of Object.entries(SP)) {
      if (!subs[subId]) {
        // нормализуем массив [{level,features}] -> карта { [level]: string[] }
        const map = {};
        (arr || []).forEach(step => {
          const L = Number(step.level || step.lvl || 0);
          if (!L) return;
          map[L] = (map[L] || []).concat(step.features || []);
        });
        subs[subId] = map;
      }
    }
  }

  const entries = Object.keys(subs || {});
  if (!entries.length) return; // нет подклассов — выходим

  // UI выбора
  const listWrap = document.createElement('div');
  listWrap.style.cssText = 'display:grid; gap:8px; max-width:520px;';
  const title = document.createElement('div');
  title.style.cssText = 'font-size:18px; font-weight:700; margin-bottom:8px;';
  title.textContent = 'Выбор подкласса';
  listWrap.appendChild(title);

  entries.forEach(id=>{
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn';
    const nice =
  (SUBCLASS_NAMES && SUBCLASS_NAMES[classId] && SUBCLASS_NAMES[classId][id]) ||
  (CF && CF.subclasses && CF.subclasses[id] && CF.subclasses[id].name) ||
  id;

    btn.textContent = nice + (ch.subclassId === id ? ' ✓' : '');
    btn.addEventListener('click', ()=>{
      // сохранить в персонажа
      const list = load();
      const idx = list.findIndex(x=>x.id===ch.id);
      if (idx>=0){
        list[idx].subclassId = id;
        save(list);
      }
      // закрыть модалку (если есть общий закрыватель) или фолбэк-оверлей
      if (typeof window.closeModal === 'function') {
        window.closeModal();
      } else if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
      // перерисовать экран
      render(document.getElementById('app'), ch.id);
    });
    listWrap.appendChild(btn);
  });

  // если есть общий модальный показ — используем его
  if (typeof window.showInModal === 'function'){
    window.showInModal(listWrap, 'Подкласс');
    return;
  }

  // иначе — фолбэк-оверлей
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; inset: 0; background: rgba(0,0,0,.6); z-index: 9999;
    display:flex; align-items:center; justify-content:center; padding:16px;
  `;
  const box = document.createElement('div');
  box.style.cssText = `
    background:#1e1a14; color:#fff; border:1px solid rgba(255,255,255,.1);
    border-radius:12px; padding:16px; max-width:560px; width:100%;
    box-shadow:0 10px 40px rgba(0,0,0,.5);
  `;
  const footer = document.createElement('div');
  footer.style.cssText = 'text-align:right; margin-top:12px;';
  const close = document.createElement('button');
  close.type = 'button'; close.className = 'btn'; close.textContent = 'Закрыть';
  close.addEventListener('click', ()=> overlay.parentNode && overlay.parentNode.removeChild(overlay));
  footer.appendChild(close);

  box.appendChild(listWrap);
  box.appendChild(footer);
  overlay.addEventListener('click', (e)=>{ if (e.target === overlay) overlay.parentNode && overlay.parentNode.removeChild(overlay); });
  overlay.appendChild(box);
  document.body.appendChild(overlay);
}


// --- public render ---
function render(container, id){
  const ch = getById(id);
  // для темизации по классу (пригодится позже)
  document.body.removeAttribute('data-ch-class');


  if (!Array.isArray(ch.spells)) {
    ch.spells = [];
    const list = load();
    const idx = list.findIndex(x => x.id === ch.id);
    if (idx >= 0) { list[idx] = ch; }
    save(list);
  }

  // === СЕКЦИЯ: «Заклинания» (в рамке Hearthstone) ==================
  function sectionSpells(){
  // ВНЕШНЯЯ РАМКА
  const frame = el('div', { class:'hs-frame' });

  // КАРТИНКА РАМКИ
  const frameImg = el('img', {
    class: 'hs-frame__img',
    alt: '',
    src: './assets/ui/hs-gold-frame-mobile.png'
  });

  // ВНУТРЕННЯЯ ОБЛАСТЬ (ПЕРГАМЕНТ)
  const body = el('div', { class:'hs-frame__body' });

  // === РУЧКИ ДЛЯ РАЗМЕРОВ/КОЛОНОК (можешь менять цифры тут) ===
  // кол-во колонок
  frame.style.setProperty('--spell-cols', '2');
  // расстояние между кнопками
  frame.style.setProperty('--spell-gap', '5px');
  // ширина/высота кнопки
  frame.style.setProperty('--spell-w', '125px');
  frame.style.setProperty('--spell-h', '65px');
  // внутренние поля рамки (если нужно подрезать окно)
  frame.style.setProperty('--pad-top', '48px');
  frame.style.setProperty('--pad-bottom', '36px');
  frame.style.setProperty('--pad-left', '18px');
  frame.style.setProperty('--pad-right', '18px');
  // ограничение высоты (скролл внутри)
  frame.style.setProperty('--frame-max-h', '65vh');
  frame.style.setProperty('--spell-font-size', '13px'); // меняй тут размер текста
frame.style.setProperty('--spell-font-size', '11px'); // размер шрифта на кнопках
frame.style.setProperty('--spell-font', '15px');

  // === /РУЧКИ ===

  const h = el('h2', {}, 'Заклинания');

  // СЕТКА ИЗ КНОПОК
  const grid = el('div', { class:'hs-spells-grid' });
  grid.setAttribute('data-ch-class', (ch.classId || '').toLowerCase());
  const scroller = el('div', { class:'hs-frame__scroll' });


  if (!ch.spells.length){
    scroller.append(
  h,
  el('div', { class:'empty__text', html:'' })
);
body.append(scroller);
frame.append(body, frameImg);
return frame;

  }

  const byId = Object.fromEntries((window.SPELLS || []).map(s => [s.id, s]));
  ch.spells.forEach(id=>{
    const sp = byId[id];
    const btn = el('button', { class:'hs-spell-btn', type:'button' },
  el('span', { class:'hs-spell-btn__label' }, sp ? sp.name : id)
);

    btn.addEventListener('click', ()=>{
      if (!sp) return;
      SpellModal.open(sp, {
        hasSpell:true,
        onRemove: ()=>{
          ch.spells = ch.spells.filter(x=>x!==id);
          const list = load();
          const idx = list.findIndex(x=>x.id===ch.id);
          if (idx>=0){ list[idx]=ch; save(list); }
          render(container, ch.id); // переотрисовать секцию
        }
      });
    });
    grid.append(btn);
  });

  scroller.append(h, grid);
body.append(scroller);
frame.append(body, frameImg);
return frame;

}

  // === /СЕКЦИЯ: «Заклинания» =======================================

  container.innerHTML = '';
  if (!ch){
    const wrap = el('div', { class:'panel', style:'padding:14px;' });
    wrap.append(
      el('h1', {}, 'Персонаж не найден'),
      el('div', { class:'empty__text', html: 'Возможно, он был удалён или ссылка неверна.' })
    );
    const back = el('button', { class:'btn', type:'button' }, '← Вернуться к списку');
    back.addEventListener('click', ()=> Router.navTo('/characters'));
    wrap.append(back);
    container.append(wrap);
    return;
  }

  container.append(
    header(ch),
    sectionSpells(),
    renderFeaturesSection(ch),
    renderRaceTraitsSection(ch)
  );
}


  // Показываем ошибку прямо в UI, если что-то упадёт
function renderWithTry(container, id){
  try {
    render(container, id);
  } catch (e) {
    console.error('CharacterScreen error:', e);
    const app = container || document.getElementById('app');
    if (app) {
      app.innerHTML = '';
      const box = el('div', { class:'panel', style:'padding:14px; margin:12px;' });
      box.append(
        el('h2', {}, 'Ошибка на экране персонажа'),
        el('div', { class:'empty__text', html:'Скрин упал при рендере. Стек ниже:' }),
        el('pre', { style:'white-space:pre-wrap; font-size:12px; opacity:.85;' }, String(e.stack || e))
      );
      app.append(box);
    }
  }
}

window.CharacterScreen = { render: renderWithTry };


})();
