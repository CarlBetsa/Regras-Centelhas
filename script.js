// Simple SPA navigation and search
const sections = Array.from(document.querySelectorAll('article.section'));
const tocBtns = Array.from(document.querySelectorAll('.toc button'));

function hideAll() {
    sections.forEach(s => s.style.display = 'none');
    tocBtns.forEach(b => b.classList.remove('active')) 
}

function showSection(id) {
    hideAll();

    const prev = document.getElementById('search');
    if (prev) prev.remove();

    document.getElementById(id).style.display = 'block';

    const btn = document.querySelector(`[data-target="${id}"]`);
    if (btn) btn.classList.add('active');

    window.location.hash = id;

    setTimeout(() => window.scrollTo(0, 0), 0);
}


// init
(function () { const hash = (location.hash || '#mecanica').replace('#', ''); showSection(hash) })();

// toc buttons
tocBtns.forEach(b => b.addEventListener('click', () => showSection(b.dataset.target)));

// quick search (very simple full-text)
const q = document.getElementById('q');
q.addEventListener('input', () => {
    const term = q.value.trim().toLowerCase();
    if (!term) { // restore current hash section
        const id = (location.hash || '#mecanica').replace('#', '');
        showSection(id);
        return;
    }
    // show search results view
    hideAll();
    let m = document.createElement('article'); 
    m.className = 'section'; 
    m.id = 'search';
    m.innerHTML = `<h1>Resultados da pesquisa: "${term}"</h1>`;
    const results = [];
    sections.forEach(s => { 
        const txt = s.innerText.toLowerCase();
        if (txt.includes(term)) results.push({ id: s.id, title: s.querySelector('h1').innerText, excerpt: s.innerText.trim().slice(0, 400) }) 
    });
    if (results.length === 0) {
        m.innerHTML += '<p class="small">Nenhum resultado encontrado.</p>';
        document.getElementById('main').appendChild(m);
        return 
    }
    results.forEach(r => { 
        const node = document.createElement('div'); 
        node.className = 'section-sub'; 
        node.innerHTML = `<h3>${r.title}</h3><p class="small">${r.excerpt.replace(/\n/g, ' ')}...</p><p><button onclick="showSection('${r.id}')">Abrir seção</button></p>`; 
        m.appendChild(node) 
    });
    // remove previous search if exists
    const prev = document.getElementById('search'); 
    if (prev) prev.remove(); 
    document.getElementById('main').appendChild(m);
});

// keyboard: press 1..7 to jump
window.addEventListener('keydown', e => {
    if (document.activeElement.tagName === 'INPUT') return;
    const map = { 'Digit1': 'mecanica', 'Digit2': 'pandemonio', 'Digit3': 'criacao', 'Digit4': 'combate', 'Digit5': 'condicoes', 'Digit6': 'equipamento', 'Digit7': 'habilidades' };
    if (map[e.code]) showSection(map[e.code]);
});