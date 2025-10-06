// Простой hash-роутер: /characters и /character/:id
(function(){
  const routes = [];
  let rootEl = null;

  function parse(hash){
  const raw = (hash || '').replace(/^#/, '') || '/characters';
  const pathOnly = raw.split('?')[0]; // отрезаем query, чтобы /spells?char=... матчился как /spells
  return pathOnly;
}


  function match(path){
    for (const r of routes){
      if (!r.param){
        if (r.path === path) return { handler: r.handler, params: {} };
      } else {
        // шаблон вида /character/:id
        const m = path.match(/^\/character\/([^/]+)$/);
        if (r.path === '/character/:id' && m) return { handler: r.handler, params: { id: m[1] } };
      }
    }
    return null;
  }

  function render(){
    if (!rootEl) return;
    const path = parse(location.hash);
    const m = match(path);
    if (m){
      m.handler(rootEl, m.params);
    } else {
      // по умолчанию на список
      location.hash = '#/characters';
    }
  }

  function add(path, handler){
    routes.push({ path, handler, param: path.includes(':') });
  }

  function navTo(path){
    if (location.hash !== '#'+path) location.hash = '#'+path;
    else render();
  }

  function init(root){
    rootEl = root;
    window.addEventListener('hashchange', render);
  }

  window.Router = { init, add, render, navTo };
  
})();
