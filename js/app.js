// Bootstrap приложения с роутером + ГЛОБАЛЬНАЯ миграция мультикласса
(function(){
  const STORAGE_KEY = 'pk.characters';

  // ===== Глобальная миграция =====
  function normalizeCharacter(ch){
    if (!ch || typeof ch !== 'object') return ch;

    // если нет classes — собрать из старых полей
    if (!Array.isArray(ch.classes) || ch.classes.length === 0){
      const baseId  = (ch.classId || '').toLowerCase() || 'fighter';
      const baseLvl = Math.max(1, Math.min(20, Number(ch.level || 1)));
      const baseSub = ch.subclassId ?? null;
      ch.classes = [{ id: baseId, level: baseLvl, subclassId: baseSub }];
      ch.primary = 0;
    }

    // чистка дублей/лимитов
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

    // зеркало legacy-полей из primary
    const p = ch.classes[ch.primary] || ch.classes[0];
    ch.classId    = p.id;
    ch.level      = p.level;
    ch.subclassId = p.subclassId ?? null;

    return ch;
  }

  function migrateStorageOnce(){
    let list;
    try{ list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch{ list = []; }
    if (!Array.isArray(list)) return;

    let changed = false;
    const next = list.map(obj => {
      const before = JSON.stringify(obj);
      const norm   = normalizeCharacter(obj);
      if (JSON.stringify(norm) !== before) changed = true;
      return norm;
    });

    if (changed){
      try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch{}
      try{ console.log('[MC] migrated characters:', next.map(x => x.name).join(', ')); } catch{}
    }
  }
  // ===== конец миграции =====

  function boot(){
    migrateStorageOnce(); // ← ВАЖНО: прогоняем миграцию до запуска экранов

    const root = document.getElementById('app');
    if (!root) return;

    Router.init(root);

    // Маршруты
    Router.add('/characters', (el)=> {
      window.CharactersScreen.render(el);
    });

    Router.add('/character/:id', (el, params)=> {
      window.CharacterScreen.render(el, params.id);
    });

    Router.add('/spells', (el)=> {
      window.SpellsScreen.render(el);
    });

    // Первый рендер
    Router.render();
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
