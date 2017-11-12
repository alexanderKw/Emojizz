const endpoint = '../data/emoji.json';
const emojis = [];

fetch(endpoint)
  .then(blob => blob.json())
  .then(data => emojis.push(...data));

function findMatches(wordToMatch, emojis) {
  return emojis.filter(emoji => {
    const regex = new RegExp(wordToMatch, 'gi');

    // return emoji.name.match(regex) || emoji.code.match(regex);
    return emoji.name.match(regex);
  });
}

function displayMatches() {
  const matchArray = findMatches(this.value, emojis);
  const html = matchArray
    .map(emoji => {
      return `
      <li class="emoji-item">
        ${emoji.char}
      </li>
    `;
    })
    .join('');

  result.innerHTML = html;
}

const searchInput = document.querySelector('.search-field');
const result = document.querySelector('#result');
searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);
