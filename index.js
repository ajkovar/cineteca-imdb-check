import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

console.log('start')

fetch('https://www.cinetecanacional.net/cartelera.php?dia=2024-01-15#gsc.tab=0')
  .then((response) => response.text())
  .then((data) => {
    const root = parse(data)
    // console.log(data);
    const titles = root.querySelectorAll('.font-weight-bold.text-uppercase.text-decoration-none.text-black').map((n) => n.text)
    console.log(titles);
  })
  .catch((error) => {
    console.error(error);
  });

function toText(el) {
  const title = Array.from(el.querySelectorAll('.font-weight-bold.text-uppercase.text-decoration-none.text-black'))[0].text
  const description = Array.from(el.querySelectorAll('.small'))[0].text
  console.log(title)
  return title
}
