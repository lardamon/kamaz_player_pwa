// js/ui/modal.subrace.js
(function(){
  const STORAGE_KEY = 'pk.characters';

  function el(tag, attrs = {}, ...children){
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === 'class') n.className = v;
    else if (k === 'html') n.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v);
  }
  const add = (c) => {
    if (c == null || c === false) return;
    if (Array.isArray(c)) { c.forEach(add); return; } // ← главное: раскрываем массивы детей
    n.appendChild((typeof c === 'string' || typeof c === 'number') ? document.createTextNode(String(c)) : c);
  };
  children.forEach(add);
  return n;
}


  function load(){ try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]'); } catch{ return []; } }
  function save(arr){ localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); }

  function reopenCharacter(charId){
    const root = document.getElementById('app');
    if (window.CharacterScreen && root) window.CharacterScreen.render(root, charId);
  }

  // Словарь подрас (имена → без описаний; описания выводим в секции расы).
  // Данные ты дашь — просто допишем сюда.
  // Пример структуры:
  // window.SUBRACES = { 'Человек':['Вариант','Региональный и т.п.'], 'Эльф':['Высший','Лесной','Тёмный'] }
  window.SUBRACES = window.SUBRACES || {};

  // Описания подрас: по расе → по подрасе → текст
  // Пример: window.SUBRACE_DESC['Эльф']['Лесной'] = '...'
  window.SUBRACE_DESC = window.SUBRACE_DESC || {};

 function open(charId){
  const list = load();
  const ch = list.find(x=>x.id===charId);
  if (!ch){ alert('Персонаж не найден'); return; }

  const race = ch.race || '';
  const items = (window.SUBRACES && window.SUBRACES[race]) ? window.SUBRACES[race].slice() : [];

  const d = el('div', { class:'modal-backdrop' });
  const m = el('div', { class:'modal modal--plain' });
  m.style.maxWidth = '520px';
  m.style.width = 'calc(100% - 24px)';
  m.style.padding = '12px';

  const head = el('div', { class:'modal__header' },
    el('div', { class:'modal__title' }, `Подрасы — ${race || '—'}`),
    el('button', { class:'icon-btn', type:'button', title:'Закрыть', onclick:()=>d.remove() }, '✕')
  );

  const body = el('div', { class:'modal__body' });

  if (!race){
    body.append( el('div', { class:'empty__text' }, 'Сначала выбери расу персонажа.') );
  } else if (!items.length){
    body.append( el('div', { class:'empty__text' }, 'Для этой расы подрас пока нет.') );
  } else {
    const listEl = el('div', { class:'list-plain' });
    listEl.style.display = 'grid';
    listEl.style.rowGap = '8px';

    // Сброс подрасы
    const clr = el('button', { class:'btn btn--ghost', type:'button' }, '— Без подрасы —');
    clr.addEventListener('click', ()=>{
      delete ch.subrace;
      save(list);
      d.remove();               // авто-закрытие
      reopenCharacter(ch.id);   // перерисовать страницу
    });
    listEl.appendChild(clr);

    // Кнопки подрас
    items.forEach(name=>{
      const b = el('button', { class:'btn', type:'button' }, name);
      b.addEventListener('click', ()=>{
        ch.subrace = name;
        save(list);
        d.remove();              // авто-закрытие
        reopenCharacter(ch.id);
      });
      listEl.appendChild(b);
    });

    body.append(listEl);
  }

  m.append(head, body);
  d.append(m);
  document.body.appendChild(d);
}

  window.SubraceModal = { open };
})();
