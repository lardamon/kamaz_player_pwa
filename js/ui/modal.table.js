(function () {
  // ---------- helpers ----------
 // ---------- helpers ----------
const el = (tag, attrs = {}, ...children) => {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === 'class') n.className = v;
    else if (k === 'style') n.setAttribute('style', v);
    else if (k === 'html') n.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') n[k] = v; // как было
    else n.setAttribute(k, v);
  }
  const append = (c) => {
    if (c == null) return;
    if (Array.isArray(c)) { c.forEach(append); return; }
    n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  };
  children.forEach(append);
  return n;
};


  // Ячейка таблицы: поддержка текста/чисел и DOM-элементов
  function cell(v) {
    const td = document.createElement('td');
    if (v === Infinity) { td.textContent = '∞'; return td; }
    if (v == null || v === 0) { td.textContent = '—'; return td; }
    if (typeof v === 'string' || typeof v === 'number') td.textContent = String(v);
    else td.appendChild(v); // сюда попадают ссылки из featuresCell(...)
    return td;
  }

  const head = v => el('th', {}, v);

  // компактная таблица с рамкой/сеткой, ширина = по содержимому
  function makeTable(headerTitles, rows, highlightLvl) {
    const table = el('table', { class: 'spell-table' });

    // шапка
    const thead = el('thead');
    const htr = el('tr');
    headerTitles.forEach(t => htr.append(head(t)));
    thead.append(htr);

    // тело
    const tbody = el('tbody');
    rows.forEach(r => {
      const tr = el('tr', { class: r._lvl === highlightLvl ? 'is-current' : '' });
      r._cells.forEach(v => tr.append(cell(v)));
      tbody.append(tr);
    });

    table.append(thead, tbody);

    // обёртка с рамкой и скруглением, чтобы стили заработали красиво
    const wrap = el('div', { class: 'spell-table-box' });
    wrap.append(table);
    return wrap;
  }

  // ---------- модалка фичи (fallback, если нет глобальной) ----------
  function showFeatureModal(title){
  const db = (window.FEATURE_DETAILS || {});
  const item = db[title];

  // Заголовок
  const h = el('div', { style:'font-size:18px;font-weight:700;margin-bottom:8px;' }, title);

  // Тело с поддержкой HTML и «сырого» <tbody>
  const t = document.createElement('div');
  t.className = 'feature-text'; // стили таблиц уже есть в base.css

  let html = (item && item.text) ? item.text : 'Описание будет добавлено позже.';

  // Если внутри есть <tbody> без <table> — оборачиваем
  if (/<tbody[\s>]/i.test(html) && !/<table[\s>]/i.test(html)) {
    html = html.replace(/<tbody[\s\S]*?<\/tbody>/gi, m => `<table class="inner-table">${m}</table>`);
  }

  // Конвертируем \n в <br>, остальной HTML оставляем
  html = html.replace(/\n/g, '<br>');
  html = html.replace(/<a\b[^>]*>(.*?)<\/a>/gi, '$1');
  t.innerHTML = html;

  const body = el('div', {}, h, t);
  showInModal(body, 'Умение');
}


  // ---------- helpers для колонки "Умения" (читаем ИЗ ТАБЛИЦ class-tables) ----------
  function hasAnyFeaturesFor(cls){
    return (cls.levels || []).some(r => Array.isArray(r.features) && r.features.length);
  }

const TABLE_FEATURE_ALIASES = {
  // Bard
  'умение коллегии бардов': 'Коллегия бардов',

  // Barbarian
  'умение пути': 'Путь дикости',

  // Fighter
  'варианты боевых стилей': 'Боевой стиль',

  // Wizard
  'умение магической традиции': 'Магические традиции',
  'магическая традиция':        'Магические традиции',
  'традиция магии':             'Магические традиции',
    // Druid
  'умение круга друидов': 'Круг друидов',
  'умение божественного домена': 'Божественный домен',
    // Artificer
  'magical-tinkering':        'Магический мастеровой',
  'spellcasting':             'Использование заклинаний',
  'infuse-item':              'Инфузирование предмета',
  'specialist':               'Специальность изобретателя',
  'right-tool-for-the-job':   'Подходящий инструмент',
  'ASI':                      'Увеличение характеристик',
  'tool-expertise':           'Компетентность во владении инструментами',
  'flash-of-genius':          'Проблеск гениальности',
  'magic-item-adept':         'Эксперт в обращении с магическими предметами',
  'spell-storing-item':       'Хранящий заклинания предмет',
  'magic-item-savant':        'Учёный по магическим предметам',
  'magic-item-master':        'Мастер в обращении с магическими предметами',
  'soul-of-artifice':         'Душа изобретения',
// Warlock
'потусторонний покровитель': 'Потусторонний покровитель',
'умение покровителя':        'Умение покровителя',
'таинственные воззвания':    'Таинственные воззвания',
'предмет договора':          'Предмет договора',
'вариант договора':          'Вариант договора',
'магия договора':            'Магия договора',
'дополнительные заклинания': 'Дополнительные заклинания',
  // Monk
  'умение монастырской традиции': 'Монастырская традиция',
  'умения монастырской традиции': 'Монастырская традиция',
  // Paladin
  'умение священной клятвы': 'Священная клятва',
  'улучшения ауры':          'Аура защиты',
  // Rogue
  'умение архетипа плута': 'Архетип плута',
  // ===== Ranger (Следопыт) =====
  // БАЗА
  'избранный враг': 'Избранный враг',
  'предпочтительный противник': 'Предпочтительный противник',
  'исследователь природы': 'Исследователь природы',
  'искусный исследователь': 'Искусный исследователь',
  'боевой стиль': 'Боевой стиль',
  'использование заклинаний': 'Использование заклинаний',
  'заклинательная фокусировка': 'Заклинательная фокусировка',
  'дополнительные заклинания следопыта': 'Дополнительные заклинания следопыта',
  'архетип следопыта': 'Архетип следопыта',
  'архетип': 'Архетип следопыта', // иногда в таблице пишут просто "Архетип"
  'первозданная осведомлённость': 'Первозданная осведомлённость',
  'первозданная осведомленность': 'Первозданная осведомлённость', // ё/е
  'изначальная осведомлённость': 'Изначальная осведомлённость',
  'изначальная осведомленность': 'Изначальная осведомлённость',  // ё/е
  'увеличение характеристик': 'Увеличение характеристик',
  'универсальность воина': 'Универсальность воина',
  'дополнительная атака': 'Дополнительная атака',
  'тропами земли': 'Тропами земли',
  'маскировка на виду': 'Маскировка на виду',
  'природная завеса': 'Природная завеса',
  'исчезновение': 'Исчезновение',
  'дикие чувства': 'Дикие чувства',
  'убийца врагов': 'Убийца врагов',

  // ОХОТНИК (hunter)
  'добыча охотника': 'Добыча охотника',
  'оборонительная тактика': 'Оборонительная тактика',
  'мультиатака': 'Мультиатака (Охотник)',           // иногда в таблице без пометки
  'мультиатака (охотник)': 'Мультиатака (Охотник)',
  'улучшенная защита охотника': 'Улучшенная защита охотника',

  // Повелитель зверей (beastmaster) — на будущее
  'спутник следопыта': 'Спутник следопыта',
  'исключительная дрессировка': 'Исключительная дрессировка',
  'звериная ярость': 'Звериная ярость',
  'общие заклинания': 'Общие заклинания',

  // Странник горизонта (horizon walker) — на будущее
  'магия странников горизонта': 'Магия странников горизонта',
  'обнаружить портал': 'Обнаружить портал',
  'планарный воин': 'Планарный воин',
  'эфирный шаг': 'Эфирный шаг',
  'далёкий удар': 'Далёкий удар',
  'далекий удар': 'Далёкий удар', // ё/е
  'спектральная защита': 'Спектральная защита',

  // Сумрачный охотник (gloom stalker) — на будущее
  'магия сумрачного охотника': 'Магия Сумрачного охотника',
  'угроза из засады': 'Угроза из засады',
  'теневой взор': 'Теневой взор',
  'железный разум': 'Железный разум',
  'охотничья ярость': 'Охотничья ярость',
  'теневое уклонение': 'Теневое уклонение',

  // Убийца чудовищ (monster slayer) — на будущее
  'магия убийцы чудовищ': 'Магия убийцы чудовищ',
  'охотничьи чувства': 'Охотничьи чувства',
  'добыча убийцы': 'Добыча убийцы',
  'сверхъестественная защита': 'Сверхъестественная защита',
  'враг заклинателя': 'Враг заклинателя',
  'контратака убийцы': 'Контратака убийцы',

  // Странник фей (fey wanderer) — на будущее
  'ужасающие удары': 'Ужасающие удары',
  'магия странника фей': 'Магия странника фей',
  'потустороннее очарование': 'Потустороннее очарование',
  'заманивающий трюк': 'Заманивающий трюк',
  'подкрепление фей': 'Подкрепление фей',
  'туманный странник': 'Туманный странник',

  // Хранитель роя (swarmkeeper) — на будущее
  'собранный рой': 'Собранный рой',
  'магия хранителя роя': 'Магия хранителя роя',
  'извивающаяся волна': 'Извивающаяся волна',
  'могущественный рой': 'Могущественный рой',
  'растворение в рое': 'Растворение в рое',
  // Sorcerer
  'умение происхождения чародея': 'Происхождение чародея',
  'умения происхождения чародея': 'Происхождение чародея',
  'варианты метамагии':           'Метамагия',
  'магическое указание':          'Волшебное указание',


};



// Приводим табличное имя к ключу из FEATURE_DETAILS
function resolveFeatureKey(rawTitle) {
  if (!rawTitle) return '';
  const t = String(rawTitle).replace(/\(.*?\)/g, '').trim();
  const low = t.toLowerCase();

  // алиасы в нижнем регистре
  if (TABLE_FEATURE_ALIASES[low]) return TABLE_FEATURE_ALIASES[low];

  // если точное имя есть в FEATURE_DETAILS (любой регистр), вернём каноническое
  if (window.FEATURE_DETAILS) {
    for (const k of Object.keys(window.FEATURE_DETAILS)) {
      if (k.replace(/\(.*?\)/g,'').trim().toLowerCase() === low) return k;
    }
  }
  return t; // как есть — вдруг это точный ключ
}
// Названия умений, которые в таблице должны быть ПЛОХОДИМЫМИ (без модалки)
const NON_MODAL_FEATURES = new Set([
  'Боевой стиль',
  'Варианты боевых стилей',
  'Использование заклинаний',
  'Дополнительные заклинания',
  'Увеличение характеристик'
]);


function featuresCell(arr){
  if (!arr || !arr.length) return '—';
  const span = document.createElement('span');

  arr.forEach((t, i) => {
    // нормализуем ключ для проверки (алиасы и вырезание круглых скобок уже в резолвере)
    const key = resolveFeatureKey(t);

    // Если это одно из "запрещённых" — просто текст без клика
    if (NON_MODAL_FEATURES.has(key)) {
      const s = document.createElement('span');
      s.textContent = t;
      s.style.cssText = 'white-space:nowrap;margin-right:6px;'; // без подчёркивания и без курсора
      span.appendChild(s);
      if (i < arr.length-1) span.appendChild(document.createTextNode(' '));
      return;
    }

    // Иначе — обычная кликабельная ссылка с модалкой
    const a = document.createElement('a');
    a.href = '#!';
    a.textContent = t;
    a.style.cssText = 'text-decoration:none;border-bottom:1px dotted rgba(255,215,0,.6);cursor:pointer;white-space:nowrap;margin-right:6px;';
    a.onclick = (e)=>{
      e.preventDefault();
      const k = key; // уже посчитан
      if (typeof window.openFeature === 'function') {
        window.openFeature(k);
      } else if (window.FeatureModal) {
        try { window.FeatureModal.show(k, {}); } catch { showFeatureModal(k); }
      } else {
        showFeatureModal(k);
      }
    };
    span.appendChild(a);
    if (i < arr.length-1) span.appendChild(document.createTextNode(' '));
  });

  return span;
}


  // ---------- per-class builders ----------
  function buildBarbarian(cls, lvl) {
    const headers = ['Ур.', 'Бонус', 'Ярость', 'Урон ярости'];
    if (hasAnyFeaturesFor(cls)) headers.push('Умения');

    const rows = cls.levels.map(r => {
      const base = [r.lvl, `+${r.prof}`, r.rage_uses, r.rage_damage];
      if (hasAnyFeaturesFor(cls)) base.push(featuresCell(r.features));
      return { _lvl: r.lvl, _cells: base };
    });

    return makeTable(headers, rows, lvl);
  }

  function buildMonk(cls, lvl) {
    const headers = ['Ур.', 'Бонус', 'Боевые искусства', 'Очки ци', 'Скорость без доспехов'];
    if (hasAnyFeaturesFor(cls)) headers.push('Умения');

    const rows = cls.levels.map(r => {
      const base = [
        r.lvl, `+${r.prof}`,
        r.martial_die,
        r.ki_points,
        r.unarmored_move_ft ? `+${r.unarmored_move_ft} фут.` : '—'
      ];
      if (hasAnyFeaturesFor(cls)) base.push(featuresCell(r.features));
      return { _lvl: r.lvl, _cells: base };
    });

    return makeTable(headers, rows, lvl);
  }

  function buildRogue(cls, lvl) {
    const headers = ['Ур.', 'Бонус', 'Скрытая атака'];
    if (hasAnyFeaturesFor(cls)) headers.push('Умения');

    const rows = cls.levels.map(r => {
      const base = [r.lvl, `+${r.prof}`, r.sneak_attack];
      if (hasAnyFeaturesFor(cls)) base.push(featuresCell(r.features));
      return { _lvl: r.lvl, _cells: base };
    });

    return makeTable(headers, rows, lvl);
  }

  function buildArtificer(cls, lvl) {
    const headers = ['Ур.', 'Бонус', 'Заговоры', 'Известные инфузии', 'Инфузии предметов', '1', '2', '3', '4', '5'];
    if (hasAnyFeaturesFor(cls)) headers.push('Умения');

    const rows = cls.levels.map(r => {
      const s = r.slots || [];
      const base = [
        r.lvl, `+${r.prof}`,
        r.cantrips_known,
        r.infusions_known, r.infused_items,
        s[1] || '—', s[2] || '—', s[3] || '—', s[4] || '—', s[5] || '—'
      ];
      if (hasAnyFeaturesFor(cls)) base.push(featuresCell(r.features));
      return { _lvl: r.lvl, _cells: base };
    });

    return makeTable(headers, rows, lvl);
  }

  function buildWarlock(cls, lvl) {
    const headers = ['Ур.', 'Бонус', 'Заговоры', 'Закл.', 'Ячейки', 'Уровень ячеек', 'Воззвания'];
    if (hasAnyFeaturesFor(cls)) headers.push('Умения');

    const rows = cls.levels.map(r => {
      const base = [
        r.lvl, `+${r.prof}`,
        r.cantrips_known, r.spells_known,
        r.pact_slots, r.pact_slot_level, r.invocations_known
      ];
      if (hasAnyFeaturesFor(cls)) base.push(featuresCell(r.features));
      return { _lvl: r.lvl, _cells: base };
    });

    return makeTable(headers, rows, lvl);
  }
function buildSorcerer(cls, lvl) {
  // На скрине порядок такой:
  // Ур. • Бонус • Единицы чародейства • Заговоры • Известные заклинания • 1..9 • Умения
  const headers = [
    'Ур.', 'Бонус',
    'Единицы чародейства',
    'Заговоры', 'Известные',
    '1','2','3','4','5','6','7','8','9'
  ];
  if (hasAnyFeaturesFor(cls)) headers.push('Умения');

  const rows = (cls.levels || []).map(r => {
    const s = r.slots || [];
    const row = [
      r.lvl, `+${r.prof || 0}`,
      (r.sorcery_points != null ? r.sorcery_points : '—'),
      (r.cantrips_known != null ? r.cantrips_known : '—'),
      (r.spells_known   != null ? r.spells_known   : '—'),
      s[1] || '—', s[2] || '—', s[3] || '—', s[4] || '—',
      s[5] || '—', s[6] || '—', s[7] || '—', s[8] || '—', s[9] || '—'
    ];
    if (hasAnyFeaturesFor(cls)) row.push(featuresCell(r.features));
    return { _lvl: r.lvl, _cells: row };
  });

  return makeTable(headers, rows, lvl);
}


  function buildCasterGeneric(cls, lvl) {
    const withCantrips = cls.levels.some(r => r.cantrips_known != null);
    const withKnown    = cls.levels.some(r => r.spells_known   != null);

    const headers = ['Ур.', 'Бонус'];
    if (withCantrips) headers.push('Заговоры');
    if (withKnown)    headers.push('Известные');
    for (let k = 1; k <= 9; k++) headers.push(String(k));
    if (hasAnyFeaturesFor(cls)) headers.push('Умения');

    const rows = cls.levels.map(r => {
      const row = [r.lvl, `+${r.prof}`];
      if (withCantrips) row.push(r.cantrips_known);
      if (withKnown)    row.push(r.spells_known);
      const s = r.slots || [];
      for (let k = 1; k <= 9; k++) row.push(s[k] || 0);
      if (hasAnyFeaturesFor(cls)) row.push(featuresCell(r.features));
      return { _lvl: r.lvl, _cells: row };
    });

    return makeTable(headers, rows, lvl);
  }

// ---------- modal (PLAIN) ----------
// ---------- modal (PLAIN) ----------
function showInModal(content, title) {
  const d = el('div', { class: 'modal-backdrop' });
  const m = el('div', { class: 'modal modal--plain table-modal' });
  // принудительно сбрасываем тёмные фильтры и делаем светлый текст
m.style.background = 'rgba(40, 30, 10, 0.92)';
m.style.color = '#f5e8c8';                     // светлый текст
m.style.filter = 'none';
m.style.mixBlendMode = 'normal';



  // varargs, НЕ массив
  const head = el(
    'div', { class: 'modal__header' },
    el('div', { class: 'modal__title' }, title || 'Таблица'),
    el('button', { class: 'icon-btn', type: 'button', title: 'Закрыть', onclick: () => d.remove() }, '✕')
  );

  const body = el('div', { class: 'modal__body' });
  if (typeof content === 'string') {
    const wrap = document.createElement('div');
    wrap.innerHTML = content;
    body.appendChild(wrap);
  } else {
    body.appendChild(content);
  }

  const foot = el('div', { class: 'modal__footer' });
  const closeBtn = el('button', { class: 'btn', type: 'button', onclick: () => d.remove() }, 'Закрыть');
  foot.appendChild(closeBtn);

  m.append(head, body, foot);
  d.appendChild(m);
  document.body.appendChild(d);
}






  // ---------- entry ----------
  function open(opts) {
    const { classId, level } = opts || {};
    const data = (window.CLASS_TABLES && window.CLASS_TABLES.classes) || [];
    const cls = data.find(c => c.id === classId);

    if (!cls) {
      return showInModal(
        el('div', {}, 'Нет данных для этого класса. Подключи файл data/class-tables.seed.js.'),
        `Таблица • ${classId} • ур.${level || 1}`
      );
    }

    const title = `Таблица • ${cls.name_ru} • ур. ${level || 1}`;
    let table;

    switch (cls.id) {
      case 'barbarian': table = buildBarbarian(cls, level || 1); break;
      case 'monk':      table = buildMonk(cls, level || 1); break;
      case 'rogue':     table = buildRogue(cls, level || 1); break;
      case 'artificer': table = buildArtificer(cls, level || 1); break;
      case 'warlock':   table = buildWarlock(cls, level || 1); break;
      case 'sorcerer':
  table = buildSorcerer(cls, level || 1);
  break;

      default:          table = buildCasterGeneric(cls, level || 1); break;
    }

    showInModal(table, title);
  }

  window.TableModal = { open };
})();
