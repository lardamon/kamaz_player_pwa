// data/class-tables.seed.js — полностью с нуля (с Бардом)
(function () {
  // Единый экспорт в глобальное хранилище, чтобы модалка видела данные
  window.CLASS_TABLES = window.CLASS_TABLES || {};
  const classes = window.CLASS_TABLES.classes = window.CLASS_TABLES.classes || [];


   classes.push({
    id: 'bard',
    name_ru: 'Бард',
    casting: 'full',
    levels: [
      { lvl: 1,  prof: 2, cantrips_known: 2, spells_known: 4,  slots: [0,2,0,0,0,0,0,0,0,0], features: [
        "Использование заклинаний", "Дополнительные заклинания", "Вдохновение барда (к6)"
      ]},
      { lvl: 2,  prof: 2, cantrips_known: 2, spells_known: 5,  slots: [0,3,0,0,0,0,0,0,0,0], features: [
        "Мастер на все руки", "Песнь отдыха (к6)", "Магическое вдохновение"
      ]},
      { lvl: 3,  prof: 2, cantrips_known: 2, spells_known: 6,  slots: [0,4,2,0,0,0,0,0,0,0], features: [
        "Коллегия бардов", "Компетентность"
      ]},
      { lvl: 4,  prof: 2, cantrips_known: 3, spells_known: 7,  slots: [0,4,3,0,0,0,0,0,0,0], features: [
        "Увеличение характеристик", "Многогранность барда"
      ]},
      { lvl: 5,  prof: 3, cantrips_known: 3, spells_known: 8,  slots: [0,4,3,2,0,0,0,0,0,0], features: [
        "Вдохновение барда (к8)", "Источник вдохновения"
      ]},
      { lvl: 6,  prof: 3, cantrips_known: 3, spells_known: 9,  slots: [0,4,3,3,0,0,0,0,0,0], features: [
        "Контрочарование", "Умение коллегии бардов"
      ]},
      { lvl: 7,  prof: 3, cantrips_known: 3, spells_known: 10, slots: [0,4,3,3,1,0,0,0,0,0], features: [] },
      { lvl: 8,  prof: 3, cantrips_known: 3, spells_known: 11, slots: [0,4,3,3,2,0,0,0,0,0], features: [
        "Увеличение характеристик"
      ]},
      { lvl: 9,  prof: 4, cantrips_known: 3, spells_known: 12, slots: [0,4,3,3,3,1,0,0,0,0], features: [
        "Песнь отдыха (к8)"
      ]},
      { lvl: 10, prof: 4, cantrips_known: 4, spells_known: 14, slots: [0,4,3,3,3,2,0,0,0,0], features: [
        "Вдохновение барда (к10)", "Компетентность", "Тайны магии"
      ]},
      { lvl: 11, prof: 4, cantrips_known: 4, spells_known: 15, slots: [0,4,3,3,3,2,1,0,0,0], features: [] },
      { lvl: 12, prof: 4, cantrips_known: 4, spells_known: 15, slots: [0,4,3,3,3,2,1,0,0,0], features: [
        "Увеличение характеристик"
      ]},
      { lvl: 13, prof: 5, cantrips_known: 4, spells_known: 16, slots: [0,4,3,3,3,2,1,1,0,0], features: [
        "Песнь отдыха (к10)"
      ]},
      { lvl: 14, prof: 5, cantrips_known: 4, spells_known: 18, slots: [0,4,3,3,3,2,1,1,0,0], features: [
        "Тайны магии", "Умение коллегии бардов"
      ]},
      { lvl: 15, prof: 5, cantrips_known: 4, spells_known: 19, slots: [0,4,3,3,3,2,1,1,1,0], features: [
        "Вдохновение барда (к12)"
      ]},
      { lvl: 16, prof: 5, cantrips_known: 4, spells_known: 19, slots: [0,4,3,3,3,2,1,1,1,0], features: [
        "Увеличение характеристик"
      ]},
      { lvl: 17, prof: 6, cantrips_known: 4, spells_known: 20, slots: [0,4,3,3,3,2,1,1,1,1], features: [
        "Песнь отдыха (к12)"
      ]},
      { lvl: 18, prof: 6, cantrips_known: 4, spells_known: 22, slots: [0,4,3,3,3,3,1,1,1,1], features: [
        "Тайны магии"
      ]},
      { lvl: 19, prof: 6, cantrips_known: 4, spells_known: 22, slots: [0,4,3,3,3,3,2,1,1,1], features: [
        "Увеличение характеристик"
      ]},
      { lvl: 20, prof: 6, cantrips_known: 4, spells_known: 22, slots: [0,4,3,3,3,3,2,2,1,1], features: [
        "Превосходное вдохновение"
      ]}
    ]
  });

  // Экспорт в глобал
  window.CLASS_TABLES = { version: 1, classes };

  // Быстрый лог
  try {
    console.log('CLASS_TABLES OK:', classes.map(c => c.id).join(', '));
  } catch (e) {}
  // === Варвар (таблица прогрессии) ===
classes.push({
  id: 'barbarian',
  name_ru: 'Варвар',
  casting: 'none', // некстер
  levels: [
    { lvl: 1,  prof: 2, rage_uses: 2, rage_damage: 2, features: [
      "Защита без доспехов", "Ярость"
    ]},
    { lvl: 2,  prof: 2, rage_uses: 2, rage_damage: 2, features: [
      "Безрассудная атака", "Чувство опасности"
    ]},
    { lvl: 3,  prof: 2, rage_uses: 3, rage_damage: 2, features: [
      "Путь дикости", "Первобытное знание"
    ]},
    { lvl: 4,  prof: 2, rage_uses: 3, rage_damage: 2, features: [
      "Увеличение характеристик"
    ]},
    { lvl: 5,  prof: 3, rage_uses: 3, rage_damage: 2, features: [
      "Быстрое передвижение", "Дополнительная атака"
    ]},
    { lvl: 6,  prof: 3, rage_uses: 4, rage_damage: 2, features: [
      "Умение пути"
    ]},
    { lvl: 7,  prof: 3, rage_uses: 4, rage_damage: 2, features: [
      "Дикий инстинкт", "Инстинктивный бросок"
    ]},
    { lvl: 8,  prof: 3, rage_uses: 4, rage_damage: 2, features: [
      "Увеличение характеристик"
    ]},
    { lvl: 9,  prof: 4, rage_uses: 4, rage_damage: 3, features: [
      "Сильный критический удар (1 кость)"
    ]},
    { lvl: 10, prof: 4, rage_uses: 4, rage_damage: 3, features: [
      "Умение пути", "Первобытное знание"
    ]},
    { lvl: 11, prof: 4, rage_uses: 4, rage_damage: 3, features: [
      "Непреклонная ярость"
    ]},
    { lvl: 12, prof: 4, rage_uses: 5, rage_damage: 3, features: [
      "Увеличение характеристик"
    ]},
    { lvl: 13, prof: 5, rage_uses: 5, rage_damage: 3, features: [
      "Сильный критический удар (2 кости)"
    ]},
    { lvl: 14, prof: 5, rage_uses: 5, rage_damage: 3, features: [
      "Умение пути"
    ]},
    { lvl: 15, prof: 5, rage_uses: 5, rage_damage: 3, features: [
      "Непрерывная ярость"
    ]},
    { lvl: 16, prof: 5, rage_uses: 5, rage_damage: 4, features: [
      "Увеличение характеристик"
    ]},
    { lvl: 17, prof: 6, rage_uses: 6, rage_damage: 4, features: [
      "Сильный критический удар (3 кости)"
    ]},
    { lvl: 18, prof: 6, rage_uses: 6, rage_damage: 4, features: [
      "Неукротимая мощь"
    ]},
    { lvl: 19, prof: 6, rage_uses: 6, rage_damage: 4, features: [
      "Увеличение характеристик"
    ]},
    { lvl: 20, prof: 6, rage_uses: Infinity, rage_damage: 4, features: [
      "Дикий чемпион"
    ]}
  ]
});
// Воин (Fighter)
window.CLASS_TABLES.classes.push({
  id: 'fighter',
  name_ru: 'Воин',
  casting: 'none',
  levels: [
    { lvl: 1,  prof: 2, features: ["Боевой стиль", "Варианты боевых стилей", "Второе дыхание"] },
    { lvl: 2,  prof: 2, features: ["Всплеск действий (одно использование)"] },
    { lvl: 3,  prof: 2, features: ["Воинский архетип"] },
    { lvl: 4,  prof: 2, features: ["Увеличение характеристик", "Универсальность воина"] },
    { lvl: 5,  prof: 3, features: ["Дополнительная атака"] },
    { lvl: 6,  prof: 3, features: ["Увеличение характеристик"] },
    { lvl: 7,  prof: 3, features: ["Умение воинского архетипа"] },
    { lvl: 8,  prof: 3, features: ["Увеличение характеристик"] },
    { lvl: 9,  prof: 4, features: ["Упорный (одно использование)"] },
    { lvl: 10, prof: 4, features: ["Умение воинского архетипа"] },
    { lvl: 11, prof: 4, features: ["Дополнительная атака (2)"] },
    { lvl: 12, prof: 4, features: ["Увеличение характеристик"] },
    { lvl: 13, prof: 5, features: ["Упорный (два использования)"] },
    { lvl: 14, prof: 5, features: ["Увеличение характеристик"] },
    { lvl: 15, prof: 5, features: ["Умение воинского архетипа"] },
    { lvl: 16, prof: 5, features: ["Увеличение характеристик"] },
    { lvl: 17, prof: 6, features: ["Всплеск действий (два использования)", "Упорный (три использования)"] },
    { lvl: 18, prof: 6, features: ["Умение воинского архетипа"] },
    { lvl: 19, prof: 6, features: ["Увеличение характеристик"] },
    { lvl: 20, prof: 6, features: ["Дополнительная атака (3)"] },
  ]
});
// === Волшебник (Wizard) — как на dnd.su ===
window.CLASS_TABLES.classes.push({
  id: 'wizard',
  name_ru: 'Волшебник',
  casting: 'full',
  levels: [
    { lvl: 1,  prof: 2, cantrips_known: 3, slots: [0,2,0,0,0,0,0,0,0,0], features: [
      "Использование заклинаний", "Магическое восстановление", "Дополнительные заклинания"
    ]},
    { lvl: 2,  prof: 2, cantrips_known: 3, slots: [0,3,0,0,0,0,0,0,0,0], features: [
      "Магические традиции"
    ]},
    { lvl: 3,  prof: 2, cantrips_known: 3, slots: [0,4,2,0,0,0,0,0,0,0], features: [
      "Формулы заговоров"
    ]},
    { lvl: 4,  prof: 2, cantrips_known: 4, slots: [0,4,3,0,0,0,0,0,0,0], features: [
      "Увеличение характеристик"
    ]},
    { lvl: 5,  prof: 3, cantrips_known: 4, slots: [0,4,3,2,0,0,0,0,0,0], features: [] },
    { lvl: 6,  prof: 3, cantrips_known: 4, slots: [0,4,3,3,0,0,0,0,0,0], features: [
      "Умение магической традиции"
    ]},
    { lvl: 7,  prof: 3, cantrips_known: 4, slots: [0,4,3,3,1,0,0,0,0,0], features: [] },
    { lvl: 8,  prof: 3, cantrips_known: 4, slots: [0,4,3,3,2,0,0,0,0,0], features: [
      "Увеличение характеристик"
    ]},
    { lvl: 9,  prof: 4, cantrips_known: 4, slots: [0,4,3,3,3,1,0,0,0,0], features: [] },
    { lvl:10,  prof: 4, cantrips_known: 5, slots: [0,4,3,3,3,2,0,0,0,0], features: [
      "Умение магической традиции"
    ]},
    { lvl:11,  prof: 4, cantrips_known: 5, slots: [0,4,3,3,3,2,1,0,0,0], features: [] },
    { lvl:12,  prof: 4, cantrips_known: 5, slots: [0,4,3,3,3,2,1,0,0,0], features: [
      "Увеличение характеристик"
    ]},
    { lvl:13,  prof: 5, cantrips_known: 5, slots: [0,4,3,3,3,2,1,1,0,0], features: [] },
    { lvl:14,  prof: 5, cantrips_known: 5, slots: [0,4,3,3,3,2,1,1,0,0], features: [
      "Умение магической традиции"
    ]},
    { lvl:15,  prof: 5, cantrips_known: 5, slots: [0,4,3,3,3,2,1,1,1,0], features: [] },
    { lvl:16,  prof: 5, cantrips_known: 5, slots: [0,4,3,3,3,2,1,1,1,0], features: [
      "Увеличение характеристик"
    ]},
    { lvl:17,  prof: 6, cantrips_known: 5, slots: [0,4,3,3,3,2,1,1,1,1], features: [] },
    { lvl:18,  prof: 6, cantrips_known: 5, slots: [0,4,3,3,3,3,1,1,1,1], features: [
      "Мастерство заклинателя"
    ]},
    { lvl:19,  prof: 6, cantrips_known: 5, slots: [0,4,3,3,3,3,2,1,1,1], features: [
      "Увеличение характеристик"
    ]},
    { lvl:20,  prof: 6, cantrips_known: 5, slots: [0,4,3,3,3,3,2,2,1,1], features: [
      "Фирменное заклинание"
    ]},
  ]
});
// ===== DRUID =====
classes.push({
  id: 'druid',
  name_ru: 'Друид',
  casting: 'full',
  levels: [
    { lvl:1,  prof:2, cantrips_known:2, slots:[0,2,0,0,0,0,0,0,0,0], features:[
      'Друидический язык','Использование заклинаний','Дополнительные заклинания'
    ]},
    { lvl:2,  prof:2, cantrips_known:2, slots:[0,3,0,0,0,0,0,0,0,0], features:[
      'Круг друидов','Дикий облик','Дикий спутник'
    ]},
    { lvl:3,  prof:2, cantrips_known:2, slots:[0,4,2,0,0,0,0,0,0,0], features:[ ] },
    { lvl:4,  prof:2, cantrips_known:3, slots:[0,4,3,0,0,0,0,0,0,0], features:[
      'Улучшение дикого облика','Увеличение характеристик','Универсальность заговоров'
    ]},
    { lvl:5,  prof:3, cantrips_known:3, slots:[0,4,3,2,0,0,0,0,0,0], features:[ ] },
    { lvl:6,  prof:3, cantrips_known:3, slots:[0,4,3,3,0,0,0,0,0,0], features:[
      'Умение круга друидов'
    ]},
    { lvl:7,  prof:3, cantrips_known:3, slots:[0,4,3,3,1,0,0,0,0,0], features:[ ] },
    { lvl:8,  prof:3, cantrips_known:3, slots:[0,4,3,3,2,0,0,0,0,0], features:[
      'Улучшение дикого облика','Увеличение характеристик'
    ]},
    { lvl:9,  prof:4, cantrips_known:3, slots:[0,4,3,3,3,1,0,0,0,0], features:[ ] },
    { lvl:10, prof:4, cantrips_known:4, slots:[0,4,3,3,3,2,0,0,0,0], features:[
      'Умение круга друидов'
    ]},
    { lvl:11, prof:4, cantrips_known:4, slots:[0,4,3,3,3,2,1,0,0,0], features:[ ] },
    { lvl:12, prof:4, cantrips_known:4, slots:[0,4,3,3,3,2,1,0,0,0], features:[
      'Увеличение характеристик'
    ]},
    { lvl:13, prof:5, cantrips_known:4, slots:[0,4,3,3,3,2,1,1,0,0], features:[ ] },
    { lvl:14, prof:5, cantrips_known:4, slots:[0,4,3,3,3,2,1,1,0,0], features:[
      'Умение круга друидов'
    ]},
    { lvl:15, prof:5, cantrips_known:4, slots:[0,4,3,3,3,2,1,1,1,0], features:[ ] },
    { lvl:16, prof:5, cantrips_known:4, slots:[0,4,3,3,3,2,1,1,1,0], features:[
      'Увеличение характеристик'
    ]},
    { lvl:17, prof:6, cantrips_known:4, slots:[0,4,3,3,3,2,1,1,1,1], features:[ ] },
    { lvl:18, prof:6, cantrips_known:4, slots:[0,4,3,3,3,3,1,1,1,1], features:[
      'Безвременное тело','Заклинания зверя'
    ]},
    { lvl:19, prof:6, cantrips_known:4, slots:[0,4,3,3,3,3,2,1,1,1], features:[
      'Увеличение характеристик'
    ]},
    { lvl:20, prof:6, cantrips_known:4, slots:[0,4,3,3,3,3,2,2,1,1], features:[
      'Архидруид'
    ]},
  ]
});
classes.push({
  id: 'cleric',
  shortName: 'cleric',
  name_ru: 'Жрец',
  casting: 'full',
  levels: [
    { lvl: 1,  prof: 2, cantrips_known: 3, slots: [0,2,0,0,0,0,0,0,0,0], features: ["Использование заклинаний","Божественный домен"] },
    { lvl: 2,  prof: 2, cantrips_known: 3, slots: [0,3,0,0,0,0,0,0,0,0], features: ["Божественный канал (1/отдых)","Умение божественного домена","Праведное восстановление"] },
    { lvl: 3,  prof: 2, cantrips_known: 3, slots: [0,4,2,0,0,0,0,0,0,0], features: [] },
    { lvl: 4,  prof: 2, cantrips_known: 4, slots: [0,4,3,0,0,0,0,0,0,0], features: ["Увеличение характеристик","Универсальность заговоров"] },
    { lvl: 5,  prof: 3, cantrips_known: 4, slots: [0,4,3,2,0,0,0,0,0,0], features: ["Уничтожение Нежити (ПО ½)"] },
    { lvl: 6,  prof: 3, cantrips_known: 4, slots: [0,4,3,3,0,0,0,0,0,0], features: ["Божественный канал (2/отдых)","Умение божественного домена"] },
    { lvl: 7,  prof: 3, cantrips_known: 4, slots: [0,4,3,3,1,0,0,0,0,0], features: [] },
    { lvl: 8,  prof: 3, cantrips_known: 4, slots: [0,4,3,3,2,0,0,0,0,0], features: ["Увеличение характеристик","Уничтожение Нежити (ПО 1)","Благословленные удары"] },
    { lvl: 9,  prof: 4, cantrips_known: 4, slots: [0,4,3,3,3,1,0,0,0,0], features: [] },
    { lvl: 10, prof: 4, cantrips_known: 5, slots: [0,4,3,3,3,2,0,0,0,0], features: ["Божественное вмешательство"] },
    { lvl: 11, prof: 4, cantrips_known: 5, slots: [0,4,3,3,3,2,1,0,0,0], features: ["Уничтожение Нежити (ПО 2)"] },
    { lvl: 12, prof: 4, cantrips_known: 5, slots: [0,4,3,3,3,2,1,0,0,0], features: ["Увеличение характеристик"] },
    { lvl: 13, prof: 5, cantrips_known: 5, slots: [0,4,3,3,3,2,1,1,0,0], features: [] },
    { lvl: 14, prof: 5, cantrips_known: 5, slots: [0,4,3,3,3,2,1,1,0,0], features: ["Уничтожение Нежити (ПО 3)"] },
    { lvl: 15, prof: 5, cantrips_known: 5, slots: [0,4,3,3,3,2,1,1,1,0], features: [] },
    { lvl: 16, prof: 5, cantrips_known: 5, slots: [0,4,3,3,3,2,1,1,1,0], features: ["Увеличение характеристик"] },
    { lvl: 17, prof: 6, cantrips_known: 5, slots: [0,4,3,3,3,2,1,1,1,1], features: ["Уничтожение Нежити (ПО 4)","Умение божественного домена"] },
    { lvl: 18, prof: 6, cantrips_known: 5, slots: [0,4,3,3,3,3,1,1,1,1], features: ["Божественный канал (3/отдых)"] },
    { lvl: 19, prof: 6, cantrips_known: 5, slots: [0,4,3,3,3,3,2,1,1,1], features: ["Увеличение характеристик"] },
    { lvl: 20, prof: 6, cantrips_known: 5, slots: [0,4,3,3,3,3,2,2,1,1], features: ["Улучшение божественного вмешательства"] }
  ]
});

// ===== ARTIFICER (ИЗОБРЕТАТЕЛЬ) =====
classes.push({
  id: 'artificer',
  name_ru: 'Изобретатель',
  casting: 'half',
  levels: [
    { lvl: 1,  prof: 2, cantrips_known: 2, infusions_known: 0,  infused_items: 0, slots: [0,2,0,0,0,0,0,0,0,0], features: [
      "Магический мастеровой", "Использование заклинаний"
    ]},
    { lvl: 2,  prof: 2, cantrips_known: 2, infusions_known: 4,  infused_items: 2, slots: [0,2,0,0,0,0,0,0,0,0], features: [
      "Инфузирование предмета"
    ]},
    { lvl: 3,  prof: 2, cantrips_known: 2, infusions_known: 4,  infused_items: 2, slots: [0,3,0,0,0,0,0,0,0,0], features: [
      "Специальность изобретателя", "Подходящий инструмент"
    ]},
    { lvl: 4,  prof: 2, cantrips_known: 2, infusions_known: 4,  infused_items: 2, slots: [0,3,0,0,0,0,0,0,0,0], features: [
      "Увеличение характеристик"
    ]},
    { lvl: 5,  prof: 3, cantrips_known: 2, infusions_known: 4,  infused_items: 2, slots: [0,4,2,0,0,0,0,0,0,0], features: [
      "Умение специальности"
    ]},
    { lvl: 6,  prof: 3, cantrips_known: 2, infusions_known: 6,  infused_items: 3, slots: [0,4,2,0,0,0,0,0,0,0], features: [
      "Компетентность во владении инструментами"
    ]},
    { lvl: 7,  prof: 3, cantrips_known: 2, infusions_known: 6,  infused_items: 3, slots: [0,4,3,0,0,0,0,0,0,0], features: [
      "Проблеск гениальности"
    ]},
    { lvl: 8,  prof: 3, cantrips_known: 2, infusions_known: 6,  infused_items: 3, slots: [0,4,3,0,0,0,0,0,0,0], features: [
      "Увеличение характеристик"
    ]},
    { lvl: 9,  prof: 4, cantrips_known: 2, infusions_known: 6,  infused_items: 3, slots: [0,4,3,2,0,0,0,0,0,0], features: [
      "Умение специальности"
    ]},
    { lvl:10,  prof: 4, cantrips_known: 3, infusions_known: 8,  infused_items: 4, slots: [0,4,3,2,0,0,0,0,0,0], features: [
      "Эксперт в обращении с магическими предметами"
    ]},
    { lvl:11,  prof: 4, cantrips_known: 3, infusions_known: 8,  infused_items: 4, slots: [0,4,3,3,0,0,0,0,0,0], features: [
      "Хранящий заклинания предмет"
    ]},
    { lvl:12,  prof: 4, cantrips_known: 3, infusions_known: 8,  infused_items: 4, slots: [0,4,3,3,0,0,0,0,0,0], features: [
      "Увеличение характеристик"
    ]},
    { lvl:13,  prof: 5, cantrips_known: 3, infusions_known: 8,  infused_items: 4, slots: [0,4,3,3,1,0,0,0,0,0], features: [] },
    { lvl:14,  prof: 5, cantrips_known: 4, infusions_known:10,  infused_items: 5, slots: [0,4,3,3,1,0,0,0,0,0], features: [
      "Учёный по магическим предметам"
    ]},
    { lvl:15,  prof: 5, cantrips_known: 4, infusions_known:10,  infused_items: 5, slots: [0,4,3,3,2,0,0,0,0,0], features: [
      "Умение специальности"
    ]},
    { lvl:16,  prof: 5, cantrips_known: 4, infusions_known:10,  infused_items: 5, slots: [0,4,3,3,2,0,0,0,0,0], features: [
      "Увеличение характеристик"
    ]},
    { lvl:17,  prof: 6, cantrips_known: 4, infusions_known:10,  infused_items: 5, slots: [0,4,3,3,3,1,0,0,0,0], features: [] },
    { lvl:18,  prof: 6, cantrips_known: 4, infusions_known:12,  infused_items: 6, slots: [0,4,3,3,3,1,0,0,0,0], features: [
      "Мастер в обращении с магическими предметами"
    ]},
    { lvl:19,  prof: 6, cantrips_known: 4, infusions_known:12,  infused_items: 6, slots: [0,4,3,3,3,2,0,0,0,0], features: [
      "Увеличение характеристик"
    ]},
    { lvl:20,  prof: 6, cantrips_known: 4, infusions_known:12,  infused_items: 6, slots: [0,4,3,3,3,2,0,0,0,0], features: [
      "Душа изобретения"
    ]},
  ]
});
classes.push({
  id: 'warlock',
  name_ru: 'Колдун',
  levels: [
    { lvl: 1,  prof: 2, cantrips_known: 2, spells_known: 2, pact_slots: 1, pact_slot_level: 1, invocations_known: 0, features: [
      'Потусторонний покровитель','Магия договора','Дополнительные заклинания'
    ]},
    { lvl: 2,  prof: 2, cantrips_known: 2, spells_known: 3, pact_slots: 2, pact_slot_level: 1, invocations_known: 2, features: [
      'Таинственные воззвания'
    ]},
    { lvl: 3,  prof: 2, cantrips_known: 2, spells_known: 4, pact_slots: 2, pact_slot_level: 2, invocations_known: 2, features: [
      'Предмет договора','Вариант договора'
    ]},
    { lvl: 4,  prof: 2, cantrips_known: 3, spells_known: 5, pact_slots: 2, pact_slot_level: 2, invocations_known: 2, features: [
      'Увеличение характеристик','Мистическая универсальность'
    ]},
    { lvl: 5,  prof: 3, cantrips_known: 3, spells_known: 6, pact_slots: 2, pact_slot_level: 3, invocations_known: 3, features: [] },
    { lvl: 6,  prof: 3, cantrips_known: 3, spells_known: 7, pact_slots: 2, pact_slot_level: 3, invocations_known: 3, features: [
      'Умение покровителя'
    ]},
    { lvl: 7,  prof: 3, cantrips_known: 3, spells_known: 8, pact_slots: 2, pact_slot_level: 4, invocations_known: 4, features: [] },
    { lvl: 8,  prof: 3, cantrips_known: 3, spells_known: 9, pact_slots: 2, pact_slot_level: 4, invocations_known: 4, features: [
      'Увеличение характеристик'
    ]},
    { lvl: 9,  prof: 4, cantrips_known: 3, spells_known: 10, pact_slots: 2, pact_slot_level: 5, invocations_known: 5, features: [] },
    { lvl: 10, prof: 4, cantrips_known: 4, spells_known: 10, pact_slots: 2, pact_slot_level: 5, invocations_known: 5, features: [
      'Умение покровителя'
    ]},
    { lvl: 11, prof: 4, cantrips_known: 4, spells_known: 11, pact_slots: 3, pact_slot_level: 5, invocations_known: 5, features: [
      'Таинственный арканум (6 уровень)'
    ]},
    { lvl: 12, prof: 4, cantrips_known: 4, spells_known: 11, pact_slots: 3, pact_slot_level: 5, invocations_known: 6, features: [
      'Увеличение характеристик'
    ]},
    { lvl: 13, prof: 5, cantrips_known: 4, spells_known: 12, pact_slots: 3, pact_slot_level: 5, invocations_known: 6, features: [
      'Таинственный арканум (7 уровень)'
    ]},
    { lvl: 14, prof: 5, cantrips_known: 4, spells_known: 12, pact_slots: 3, pact_slot_level: 5, invocations_known: 6, features: [
      'Умение покровителя'
    ]},
    { lvl: 15, prof: 5, cantrips_known: 4, spells_known: 13, pact_slots: 3, pact_slot_level: 5, invocations_known: 7, features: [
      'Таинственный арканум (8 уровень)'
    ]},
    { lvl: 16, prof: 5, cantrips_known: 4, spells_known: 13, pact_slots: 3, pact_slot_level: 5, invocations_known: 7, features: [
      'Увеличение характеристик'
    ]},
    { lvl: 17, prof: 6, cantrips_known: 4, spells_known: 14, pact_slots: 4, pact_slot_level: 5, invocations_known: 7, features: [
      'Таинственный арканум (9 уровень)'
    ]},
    { lvl: 18, prof: 6, cantrips_known: 4, spells_known: 14, pact_slots: 4, pact_slot_level: 5, invocations_known: 8, features: [] },
    { lvl: 19, prof: 6, cantrips_known: 4, spells_known: 15, pact_slots: 4, pact_slot_level: 5, invocations_known: 8, features: [
      'Увеличение характеристик'
    ]},
    { lvl: 20, prof: 6, cantrips_known: 4, spells_known: 15, pact_slots: 4, pact_slot_level: 5, invocations_known: 8, features: [
      'Таинственный мастер'
    ]},
  ]
});
// === Монах (таблица прогрессии) ===
classes.push({
  id: 'monk',
  name_ru: 'Монах',
  casting: 'none', // не заклинатель
  levels: [
    { lvl: 1,  prof: 2, martial_die: '1к4', ki_points: '—', unarmored_move_ft: 0,  features: [
      'Защита без доспехов', 'Боевые искусства'
    ]},
    { lvl: 2,  prof: 2, martial_die: '1к4', ki_points: 2,   unarmored_move_ft: 10, features: [
      'Движение без доспехов', 'Ци', 'Выбранное оружие'
    ]},
    { lvl: 3,  prof: 2, martial_die: '1к4', ki_points: 3,   unarmored_move_ft: 10, features: [
      'Монастырская традиция', 'Отражение снарядов', 'Атака, наделённая ци'
    ]},
    { lvl: 4,  prof: 2, martial_die: '1к4', ki_points: 4,   unarmored_move_ft: 10, features: [
      'Медленное падение', 'Увеличение характеристик', 'Ускоренное исцеление'
    ]},
    { lvl: 5,  prof: 3, martial_die: '1к6', ki_points: 5,   unarmored_move_ft: 10, features: [
      'Дополнительная атака', 'Ошеломляющий удар', 'Фокусировка на цели'
    ]},
    { lvl: 6,  prof: 3, martial_die: '1к6', ki_points: 6,   unarmored_move_ft: 15, features: [
      'Умение монастырской традиции', 'Энергетические удары'
    ]},
    { lvl: 7,  prof: 3, martial_die: '1к6', ki_points: 7,   unarmored_move_ft: 15, features: [
      'Спокойствие разума', 'Увёртливость'
    ]},
    { lvl: 8,  prof: 3, martial_die: '1к6', ki_points: 8,   unarmored_move_ft: 15, features: [
      'Увеличение характеристик'
    ]},
    { lvl: 9,  prof: 4, martial_die: '1к6', ki_points: 9,   unarmored_move_ft: 15, features: [
      'Улучшенное движение без доспехов'
    ]},
    { lvl: 10, prof: 4, martial_die: '1к6', ki_points: 10,  unarmored_move_ft: 20, features: [
      'Чистота тела'
    ]},
    { lvl: 11, prof: 4, martial_die: '1к8', ki_points: 11,  unarmored_move_ft: 20, features: [
      'Умение монастырской традиции'
    ]},
    { lvl: 12, prof: 4, martial_die: '1к8', ki_points: 12,  unarmored_move_ft: 20, features: [
      'Увеличение характеристик'
    ]},
    { lvl: 13, prof: 5, martial_die: '1к8', ki_points: 13,  unarmored_move_ft: 20, features: [
      'Язык солнца и луны'
    ]},
    { lvl: 14, prof: 5, martial_die: '1к8', ki_points: 14,  unarmored_move_ft: 25, features: [
      'Алмазная душа'
    ]},
    { lvl: 15, prof: 5, martial_die: '1к8', ki_points: 15,  unarmored_move_ft: 25, features: [
      'Безвременное тело'
    ]},
    { lvl: 16, prof: 5, martial_die: '1к8', ki_points: 16,  unarmored_move_ft: 25, features: [
      'Увеличение характеристик'
    ]},
    { lvl: 17, prof: 6, martial_die: '1к10', ki_points: 17, unarmored_move_ft: 25, features: [
      'Умение монастырской традиции'
    ]},
    { lvl: 18, prof: 6, martial_die: '1к10', ki_points: 18, unarmored_move_ft: 30, features: [
      'Пустое тело'
    ]},
    { lvl: 19, prof: 6, martial_die: '1к10', ki_points: 19, unarmored_move_ft: 30, features: [
      'Увеличение характеристик'
    ]},
    { lvl: 20, prof: 6, martial_die: '1к10', ki_points: 20, unarmored_move_ft: 30, features: [
      'Совершенство'
    ]},
  ]
});
classes.push({
  id: 'paladin',
  name_ru: 'Паладин',
  casting: 'half',
  levels: [
    { lvl: 1,  prof: 2, slots: [0,0,0,0,0,0,0,0,0,0], features: [
      'Божественное чувство','Наложение рук'
    ]},
    { lvl: 2,  prof: 2, slots: [0,2,0,0,0,0,0,0,0,0], features: [
      'Боевой стиль','Использование заклинаний','Божественная кара','Варианты боевых стилей'
    ]},
    { lvl: 3,  prof: 2, slots: [0,3,0,0,0,0,0,0,0,0], features: [
      'Божественное здоровье','Священная клятва','Праведное восстановление'
    ]},
    { lvl: 4,  prof: 2, slots: [0,3,0,0,0,0,0,0,0,0], features: [
      'Увеличение характеристик','Универсальность воина'
    ]},
    { lvl: 5,  prof: 3, slots: [0,4,2,0,0,0,0,0,0,0], features: [
      'Дополнительная атака'
    ]},
    { lvl: 6,  prof: 3, slots: [0,4,2,0,0,0,0,0,0,0], features: [
      'Аура защиты'
    ]},
    { lvl: 7,  prof: 3, slots: [0,4,3,0,0,0,0,0,0,0], features: [
      'Умение священной клятвы'
    ]},
    { lvl: 8,  prof: 3, slots: [0,4,3,0,0,0,0,0,0,0], features: [
      'Увеличение характеристик'
    ]},
    { lvl: 9,  prof: 4, slots: [0,4,3,2,0,0,0,0,0,0], features: []},
    { lvl: 10, prof: 4, slots: [0,4,3,2,0,0,0,0,0,0], features: [
      'Аура отваги'
    ]},
    { lvl: 11, prof: 4, slots: [0,4,3,3,0,0,0,0,0,0], features: [
      'Улучшенная божественная кара'
    ]},
    { lvl: 12, prof: 4, slots: [0,4,3,3,0,0,0,0,0,0], features: [
      'Увеличение характеристик'
    ]},
    { lvl: 13, prof: 5, slots: [0,4,3,3,1,0,0,0,0,0], features: []},
    { lvl: 14, prof: 5, slots: [0,4,3,3,1,0,0,0,0,0], features: [
      'Очищающее касание'
    ]},
    { lvl: 15, prof: 5, slots: [0,4,3,3,2,0,0,0,0,0], features: [
      'Умение священной клятвы'
    ]},
    { lvl: 16, prof: 5, slots: [0,4,3,3,2,0,0,0,0,0], features: [
      'Увеличение характеристик'
    ]},
    { lvl: 17, prof: 6, slots: [0,4,3,3,3,1,0,0,0,0], features: []},
    { lvl: 18, prof: 6, slots: [0,4,3,3,3,1,0,0,0,0], features: [
      'Улучшения ауры'
    ]},
    { lvl: 19, prof: 6, slots: [0,4,3,3,3,2,0,0,0,0], features: [
      'Увеличение характеристик'
    ]},
    { lvl: 20, prof: 6, slots: [0,4,3,3,3,2,0,0,0,0], features: [
      'Умение священной клятвы'
    ]},
  ]
});
// === Rogue (Плут) — таблица прогрессии ===
window.CLASS_TABLES.classes.push({
  id: 'rogue',
  name_ru: 'Плут',
  casting: 'none',
  levels: [
    { lvl: 1,  prof: 2, sneak_attack: '1к6',  features: ['Компетентность','Скрытая атака','Воровской жаргон'] },
    { lvl: 2,  prof: 2, sneak_attack: '1к6',  features: ['Хитрое действие'] },
    { lvl: 3,  prof: 2, sneak_attack: '2к6',  features: ['Архетип плута','Точное прицеливание'] },
    { lvl: 4,  prof: 2, sneak_attack: '2к6',  features: ['Увеличение характеристик'] },
    { lvl: 5,  prof: 3, sneak_attack: '3к6',  features: ['Невероятное уклонение'] },
    { lvl: 6,  prof: 3, sneak_attack: '3к6',  features: ['Компетентность'] },
    { lvl: 7,  prof: 3, sneak_attack: '4к6',  features: ['Увёртливость'] },
    { lvl: 8,  prof: 3, sneak_attack: '4к6',  features: ['Увеличение характеристик'] },
    { lvl: 9,  prof: 4, sneak_attack: '5к6',  features: ['Умение архетипа плута'] },
    { lvl: 10, prof: 4, sneak_attack: '5к6',  features: ['Увеличение характеристик'] },
    { lvl: 11, prof: 4, sneak_attack: '6к6',  features: ['Надёжный талант'] },
    { lvl: 12, prof: 4, sneak_attack: '6к6',  features: ['Увеличение характеристик'] },
    { lvl: 13, prof: 5, sneak_attack: '7к6',  features: ['Умение архетипа плута'] },
    { lvl: 14, prof: 5, sneak_attack: '7к6',  features: ['Слепое зрение'] },
    { lvl: 15, prof: 5, sneak_attack: '8к6',  features: ['Скользкий ум'] },
    { lvl: 16, prof: 5, sneak_attack: '8к6',  features: ['Увеличение характеристик'] },
    { lvl: 17, prof: 6, sneak_attack: '9к6',  features: ['Умение архетипа плута'] },
    { lvl: 18, prof: 6, sneak_attack: '9к6',  features: ['Неуловимость'] },
    { lvl: 19, prof: 6, sneak_attack: '10к6', features: ['Увеличение характеристик'] },
    { lvl: 20, prof: 6, sneak_attack: '10к6', features: ['Удача'] },
  ]
});
// === Следопыт (таблица прогрессии) ===
classes.push({
  id: 'ranger',
  name_ru: 'Следопыт',
  casting: 'half',
  levels: [
    { lvl: 1,  prof: 2, spells_known: 0,  slots: [0,0,0,0,0,0,0,0,0,0], features: [
      'Избранный враг', 'Предпочтительный противник', 'Исследователь природы', 'Искусный исследователь'
    ]},
    { lvl: 2,  prof: 2, spells_known: 2,  slots: [0,2,0,0,0,0,0,0,0,0], features: [
      'Боевой стиль', 'Использование заклинаний', 'Заклинательная фокусировка'
    ]},
    { lvl: 3,  prof: 2, spells_known: 3,  slots: [0,3,0,0,0,0,0,0,0,0], features: [
      'Архетип следопыта', 'Первозданная осведомлённость', 'Изначальная осведомлённость'
    ]},
    { lvl: 4,  prof: 2, spells_known: 3,  slots: [0,3,0,0,0,0,0,0,0,0], features: [
      'Увеличение характеристик', 'Универсальность воина'
    ]},
    { lvl: 5,  prof: 3, spells_known: 4,  slots: [0,4,2,0,0,0,0,0,0,0], features: [
      'Дополнительная атака'
    ]},
    { lvl: 6,  prof: 3, spells_known: 4,  slots: [0,4,2,0,0,0,0,0,0,0], features: [
      'Улучшение избранного врага', 'Улучшение искусного исследователя', 'Улучшение исследователя природы'
    ]},
    { lvl: 7,  prof: 3, spells_known: 5,  slots: [0,4,3,0,0,0,0,0,0,0], features: [
      'Умение архетипа следопыта'
    ]},
    { lvl: 8,  prof: 3, spells_known: 5,  slots: [0,4,3,0,0,0,0,0,0,0], features: [
      'Увеличение характеристик', 'Тропами земли'
    ]},
    { lvl: 9,  prof: 4, spells_known: 6,  slots: [0,4,3,2,0,0,0,0,0,0], features: [] },
    { lvl: 10, prof: 4, spells_known: 6,  slots: [0,4,3,2,0,0,0,0,0,0], features: [
      'Улучшение исследователя природы', 'Маскировка на виду', 'Природная завеса'
    ]},
    { lvl: 11, prof: 4, spells_known: 7,  slots: [0,4,3,3,0,0,0,0,0,0], features: [
      'Умение архетипа следопыта'
    ]},
    { lvl: 12, prof: 4, spells_known: 7,  slots: [0,4,3,3,0,0,0,0,0,0], features: [
      'Увеличение характеристик'
    ]},
    { lvl: 13, prof: 5, spells_known: 8,  slots: [0,4,3,3,1,0,0,0,0,0], features: [] },
    { lvl: 14, prof: 5, spells_known: 8,  slots: [0,4,3,3,1,0,0,0,0,0], features: [
      'Улучшение избранного врага', 'Исчезновение'
    ]},
    { lvl: 15, prof: 5, spells_known: 9,  slots: [0,4,3,3,2,0,0,0,0,0], features: [
      'Умение архетипа следопыта'
    ]},
    { lvl: 16, prof: 5, spells_known: 9,  slots: [0,4,3,3,2,0,0,0,0,0], features: [
      'Увеличение характеристик'
    ]},
    { lvl: 17, prof: 6, spells_known: 10, slots: [0,4,3,3,3,1,0,0,0,0], features: [] },
    { lvl: 18, prof: 6, spells_known: 10, slots: [0,4,3,3,3,1,0,0,0,0], features: [
      'Дикие чувства'
    ]},
    { lvl: 19, prof: 6, spells_known: 11, slots: [0,4,3,3,3,2,0,0,0,0], features: [
      'Увеличение характеристик'
    ]},
    { lvl: 20, prof: 6, spells_known: 11, slots: [0,4,3,3,3,2,0,0,0,0], features: [
      'Убийца врагов'
    ]},
  ]
});
// === Чародей (таблица прогрессии) ===
classes.push({
  id: 'sorcerer',
  name_ru: 'Чародей',
  casting: 'full',
  levels: [
    { lvl: 1,  prof: 2, sorcery_points: null, cantrips_known: 4, spells_known: 2,  slots: [0,2,0,0,0,0,0,0,0,0], features: [
      'Происхождение чародея', 'Использование заклинаний', 'Дополнительные заклинания'
    ]},

    { lvl: 2,  prof: 2, sorcery_points: 2,    cantrips_known: 4, spells_known: 3,  slots: [0,3,0,0,0,0,0,0,0,0], features: [
      'Источник магии'
    ]},

    { lvl: 3,  prof: 2, sorcery_points: 3,    cantrips_known: 4, spells_known: 4,  slots: [0,4,2,0,0,0,0,0,0,0], features: [
      'Метамагия', 'Варианты метамагии'
    ]},

    { lvl: 4,  prof: 2, sorcery_points: 4,    cantrips_known: 5, spells_known: 5,  slots: [0,4,3,0,0,0,0,0,0,0], features: [
      'Увеличение характеристик', 'Универсальность чародея'
    ]},

    { lvl: 5,  prof: 3, sorcery_points: 5,    cantrips_known: 5, spells_known: 6,  slots: [0,4,3,2,0,0,0,0,0,0], features: [
      'Волшебное указание'
    ]},

    { lvl: 6,  prof: 3, sorcery_points: 6,    cantrips_known: 5, spells_known: 7,  slots: [0,4,3,3,0,0,0,0,0,0], features: [
      'Умение происхождения чародея'
    ]},

    { lvl: 7,  prof: 3, sorcery_points: 7,    cantrips_known: 5, spells_known: 8,  slots: [0,4,3,3,1,0,0,0,0,0], features: [] },

    { lvl: 8,  prof: 3, sorcery_points: 8,    cantrips_known: 5, spells_known: 9,  slots: [0,4,3,3,2,0,0,0,0,0], features: [
      'Увеличение характеристик'
    ]},

    { lvl: 9,  prof: 4, sorcery_points: 9,    cantrips_known: 5, spells_known: 10, slots: [0,4,3,3,3,1,0,0,0,0], features: [] },

    { lvl:10,  prof: 4, sorcery_points: 10,   cantrips_known: 6, spells_known: 11, slots: [0,4,3,3,3,2,0,0,0,0], features: [
      'Метамагия'
    ]},

    { lvl:11,  prof: 4, sorcery_points: 11,   cantrips_known: 6, spells_known: 12, slots: [0,4,3,3,3,2,1,0,0,0], features: [] },

    { lvl:12,  prof: 4, sorcery_points: 12,   cantrips_known: 6, spells_known: 12, slots: [0,4,3,3,3,2,1,0,0,0], features: [
      'Увеличение характеристик'
    ]},

    { lvl:13,  prof: 5, sorcery_points: 13,   cantrips_known: 6, spells_known: 13, slots: [0,4,3,3,3,2,1,1,0,0], features: [] },

    { lvl:14,  prof: 5, sorcery_points: 14,   cantrips_known: 6, spells_known: 13, slots: [0,4,3,3,3,2,1,1,0,0], features: [
      'Умение происхождения чародея'
    ]},

    { lvl:15,  prof: 5, sorcery_points: 15,   cantrips_known: 6, spells_known: 14, slots: [0,4,3,3,3,2,1,1,1,0], features: [
      'Метамагия'
    ]},

    { lvl:16,  prof: 5, sorcery_points: 16,   cantrips_known: 6, spells_known: 14, slots: [0,4,3,3,3,2,1,1,1,0], features: [
      'Увеличение характеристик'
    ]},

    { lvl:17,  prof: 6, sorcery_points: 17,   cantrips_known: 6, spells_known: 15, slots: [0,4,3,3,3,2,1,1,1,1], features: [
      'Метамагия'
    ]},

    { lvl:18,  prof: 6, sorcery_points: 18,   cantrips_known: 6, spells_known: 15, slots: [0,4,3,3,3,3,1,1,1,1], features: [
      'Умение происхождения чародея'
    ]},

    { lvl:19,  prof: 6, sorcery_points: 19,   cantrips_known: 6, spells_known: 15, slots: [0,4,3,3,3,3,2,1,1,1], features: [
      'Увеличение характеристик'
    ]},

    { lvl:20,  prof: 6, sorcery_points: 20,   cantrips_known: 6, spells_known: 15, slots: [0,4,3,3,3,3,2,2,1,1], features: [
      'Чародейское восстановление'
    ]},
  ]
});

})();
