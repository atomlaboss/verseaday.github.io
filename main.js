// Daily Verse — forked from Random Quran Verse by Abdulwahab Humayun

const TOTAL_SURAHS = 114;
let totalAyahs;
let surahNumber;
let ayahNumber;
let ayah;
let translatedAyah;

const SURAH_URL = 'https://api.alquran.cloud/v1/surah/';
let newSurahURL;
let eng = 'en.sahih';

initTheme();
getRandomAyah();

async function randomAyah() {
    showLoader();

    surahNumber = Math.floor(Math.random() * (TOTAL_SURAHS - 1)) + 1;
    newSurahURL = SURAH_URL + surahNumber;

    const response = await fetch(newSurahURL);
    const chapterJSON = await response.json();

    totalAyahs = chapterJSON.data.numberOfAyahs;
    ayahNumber = Math.floor(Math.random() * totalAyahs);
    ayah = chapterJSON.data.ayahs[ayahNumber].text;

    translateAyah();
    return Promise.resolve('Getting the ayah works!');
}

async function translateAyah() {
    newSurahURL += '/' + eng;

    const response = await fetch(newSurahURL);
    const chapterJSON2 = await response.json();

    translatedAyah = chapterJSON2.data.ayahs[ayahNumber].text;
    printToHTML();
    return Promise.resolve('Getting the translation works!');
}

function printToHTML() {
    document.getElementById('loadingCircle').style.display = 'none';
    document.getElementById('verse').style.display = 'block';
    document.getElementById('translation').style.display = 'block';

    document.getElementById('verse').innerHTML = ayah;
    document.getElementById('translation').innerHTML = (surahNumber + ':' + (ayahNumber + 1)).bold();
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
    document.body.setAttribute('data-theme', saved);
    document.getElementById('themeSelect').value = saved;
}

function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}
