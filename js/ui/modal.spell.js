// js/ui/modal.spell.js — ПОЛНАЯ ЗАМЕНА
(function(){
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

  const CLASS_RU = {
    barbarian:'Варвар', bard:'Бард', cleric:'Жрец', druid:'Друид', fighter:'Воин',
    monk:'Монах', paladin:'Паладин', ranger:'Следопыт', rogue:'Плут',
    sorcerer:'Чародей', warlock:'Колдун', wizard:'Маг', artificer:'Изобретатель'
  };

  function open(spell, opts={}){
    const { onAdd, onRemove, hasSpell } = opts;

    const d = el('div',{class:'modal-backdrop'});
   const m = el('div',{class:'modal modal--sheet'});


    const head = el('div',{class:'modal__header'},[
      el('div',{class:'modal__title'}, spell.name || 'Заклинание'),
      el('button',{class:'icon-btn',type:'button',title:'Закрыть'}, '✕')
    ]);
    head.lastChild.addEventListener('click', ()=> d.remove());

    const line = (label, value) => (value!=null && value!=='')
      ? el('div',{class:'meta',html:`<b>${label}:</b> ${value}`})
      : null;

    // ---- тело модалки (ОДИН блок append) ----
    const body = el('div',{class:'modal__body'});
    const timeSafe = spell.time || spell.casting_time || null;
    const comps = [spell.components || '', (spell.material ? ` (${spell.material})` : '')]
      .join('').trim() || null;
    const dur = (spell.duration || '') + (spell.concentration ? ' (концентрация)' : '');
    const durSafe = dur.trim() || null;
    const classesRu = (Array.isArray(spell.classes_ru) && spell.classes_ru.length)
      ? spell.classes_ru
      : ((spell.classes||[]).map(c => CLASS_RU[c] || c));
    const textHtml = spell.text_html
      ? spell.text_html
      : ((spell.text||'').replace(/\n/g,'<br>'));

    body.append(
      line('Школа', spell.school_ru || spell.school || null),
      line('Время накладывания', timeSafe),
      line('Дистанция', spell.range || null),
      line('Компоненты', comps),
      line('Длительность', durSafe),
      line('Ритуал', (typeof spell.ritual === 'boolean') ? (spell.ritual ? 'Да' : 'Нет') : null),
      classesRu.length ? line('Классы', classesRu.join(', ')) : null,
      el('hr'),
      el('div', { class:'spell-text', html: textHtml })
    );

    const foot = el('div',{class:'modal__footer'});
    const close = el('button',{class:'btn btn-ghost',type:'button'},'Закрыть');
    close.addEventListener('click', ()=> d.remove());

    const primary = hasSpell
      ? el('button',{class:'btn btn-danger',type:'button'},'Удалить из персонажа')
      : el('button',{class:'btn btn-primary',type:'button'},'Добавить к персонажу');

    primary.addEventListener('click', ()=>{
      if (hasSpell && onRemove) onRemove(spell);
      if (!hasSpell && onAdd) onAdd(spell);
      d.remove();
    });

    m.append(head, body, foot);
    foot.append(close, primary);
    d.append(m);
    document.body.appendChild(d);
  }

  window.SpellModal = { open };
})();
