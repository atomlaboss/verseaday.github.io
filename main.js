// Random Verse — forked from Random Quran Verse by Abdulwahab Humayun

const TOTAL_AYAHS = 6236; // total verses in the whole Quran
let ayahGlobalNumber;
let surahNumber;
let ayahNumber;
let ayah;
let translatedAyah;

const AYAH_URL = 'https://api.alquran.cloud/v1/ayah/';
let arabicEdition = 'quran-uthmani';
let eng = 'en.sahih';

initTheme();
getRandomAyah();
renderShortcuts();

// ---------------- Verse logic ----------------

async function randomAyah() {
    showLoader();

    ayahGlobalNumber = Math.floor(Math.random() * TOTAL_AYAHS) + 1;

    const response = await fetch(AYAH_URL + ayahGlobalNumber + '/' + arabicEdition);
    const chapterJSON = await response.json();

    ayah = chapterJSON.data.text;
    surahNumber = chapterJSON.data.surah.number;
    ayahNumber = chapterJSON.data.numberInSurah;

    translateAyah();
    return Promise.resolve('Getting the ayah works!');
}

async function translateAyah() {
    const response = await fetch(AYAH_URL + ayahGlobalNumber + '/' + eng);
    const chapterJSON2 = await response.json();

    translatedAyah = chapterJSON2.data.text;
    printToHTML();
    return Promise.resolve('Getting the translation works!');
}

function printToHTML() {
    document.getElementById('loadingCircle').style.display = 'none';
    document.getElementById('verse').style.display = 'block';
    document.getElementById('translation').style.display = 'block';

    document.getElementById('verse').innerHTML = ayah;
    document.getElementById('translation').innerHTML = (surahNumber + ':' + ayahNumber).bold();
    document.getElementById('translation').innerHTML += ' ' + translatedAyah;
}

function showLoader() {
    document.getElementById('loadingCircle').style.display = 'block';
    document.getElementById('verse').style.display = 'none';
    document.getElementById('translation').style.display = 'none';
}

async function getRandomAyah() {
    randomAyah();
}

// ---------------- Theme logic ----------------

function initTheme() {
    const saved = localStorage.getItem('theme') || 'papyrus';
    applyTheme(saved);
}

function setTheme(theme) {
    localStorage.setItem('theme', theme);
    applyTheme(theme);
}

function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);

    document.querySelectorAll('.themeBtn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick') === `setTheme('${theme}')`);
    });
}

// ---------------- Shortcuts logic ----------------

const defaultShortcuts = [
    { name: 'YouTube', url: 'https://youtube.com' },
    { name: 'Google',  url: 'https://google.com' },
    { name: 'Drive',   url: 'https://drive.google.com' },
    { name: 'Gmail',   url: 'https://mail.google.com' },
    { name: 'GitHub',  url: 'https://github.com' }
];

function getShortcuts() {
    try {
        const saved = localStorage.getItem('shortcuts');
        if (saved) return JSON.parse(saved);
    } catch (e) {}
    return defaultShortcuts;
}

function extractDomain(url) {
    try {
        return new URL(url).hostname;
    } catch (e) {
        return url;
    }
}

function renderShortcuts() {
    const shortcuts = getShortcuts();
    const wrap = document.getElementById('shortcuts');
    wrap.innerHTML = '';

    shortcuts.forEach(sc => {
        if (!sc.name || !sc.url) return;

        const a = document.createElement('a');
        a.className = 'shortcut';
        a.href = sc.url;
        a.target = '_blank';
        a.rel = 'noopener';

        const domain = extractDomain(sc.url);
        const img = document.createElement('img');
        img.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        img.alt = '';
        img.onerror = function () {
            const fb = document.createElement('div');
            fb.className = 'fallback';
            fb.textContent = sc.name.charAt(0).toUpperCase();
            this.replaceWith(fb);
        };

        const label = document.createElement('span');
        label.className = 'label';
        label.textContent = sc.name;

        a.appendChild(img);
        a.appendChild(label);
        wrap.appendChild(a);
    });
}

function toggleEdit() {
    const panel = document.getElementById('editPanel');
    const isOpen = panel.classList.toggle('open');
    if (isOpen) buildEditRows();
}

function buildEditRows() {
    const shortcuts = getShortcuts();
    const rowsWrap = document.getElementById('editRows');
    rowsWrap.innerHTML = '';

    for (let i = 0; i < 5; i++) {
        const sc = shortcuts[i] || { name: '', url: '' };
        const row = document.createElement('div');
        row.className = 'editRow';
        row.innerHTML = `
            <input class="name-input" data-i="${i}" data-field="name" placeholder="Name" value="${sc.name || ''}">
            <input data-i="${i}" data-field="url" placeholder="https://..." value="${sc.url || ''}">
        `;
        rowsWrap.appendChild(row);
    }
}

function saveShortcuts() {
    const inputs = document.querySelectorAll('#editRows input');
    const rows = {};
    inputs.forEach(inp => {
        const i = inp.getAttribute('data-i');
        const field = inp.getAttribute('data-field');
        rows[i] = rows[i] || {};
        rows[i][field] = inp.value.trim();
    });

    const newShortcuts = Object.values(rows).filter(r => r.name && r.url);
    localStorage.setItem('shortcuts', JSON.stringify(newShortcuts));
    renderShortcuts();
    document.getElementById('editPanel').classList.remove('open');
}

function resetShortcuts() {
    localStorage.removeItem('shortcuts');
    renderShortcuts();
    buildEditRows();
}
