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

async function randomAyah() {
    showLoader();

    // pick a whole number from 1 to 6236, each equally likely
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
