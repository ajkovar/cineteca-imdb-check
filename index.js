import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

console.log('Querying info...')

function cinetecaElToSearchString(el) {
  const title = el.querySelector('.font-weight-bold.text-uppercase.text-decoration-none.text-black').text
  const description = el.querySelector('div.small').text
  const yearRegex = /\b\d{4}\b/;
  const yearMatch = description.match(yearRegex);

  // const directorRegex = /Dir\.: (.+?)(?:,|$)/;
  // const directorMatch = description.match(directorRegex);

  return title + ' ' + yearMatch[0] // + ' ' + directorMatch[1]
}

async function searchImdb(searchString) {
  return getRootElFromUrl('https://www.imdb.com/find/?q=' + encodeURIComponent(searchString))
}

function getFirstLinkOnPage(root) {
  const firstLink = root.querySelector('.ipc-metadata-list-summary-item__t')
  return 'https://www.imdb.com/' + firstLink.getAttribute('href')
}

async function getRootElFromUrl(url) {
  return parse(await (await fetch(url)).text())
}

async function getScoreFromUrl(url) {
  const root = await getRootElFromUrl(url)
  const el = root.querySelector(".sc-bde20123-1.cMEQkK")
  return el ? el.innerHTML : undefined
}

const root = await getRootElFromUrl('https://www.cinetecanacional.net/cartelera.php?dia=2024-01-15#gsc.tab=0')
const titles = await Promise.all(root.querySelectorAll('.col-12.col-md-6.col-lg-4.float-left').map(cinetecaElToSearchString).map(async (searchString) => {
  const score = await getScoreFromUrl(getFirstLinkOnPage(await searchImdb(searchString)))
  return {
    score, searchString
  }
}))

console.log(titles.sort((m1, m2) => m1.score - m2.score))


