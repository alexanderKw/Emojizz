const endpoint = '../data/emojis.json';
const emojis = [];
const titleBlock = document.querySelector('.title-block');

/** */
function pageContent() {
  fetch(endpoint)
    .then(res => res.json())
    .then(data => {
      let html = '';
      data.forEach(el => {
        html += `
          <li class="emoji-item">
            ${el.char}
          </li>
        `;
      });

      result.innerHTML = html;
    })
    .catch(err => console.log(err));
}
pageContent();
/** */

/**
 * Search Field
 */
fetch(endpoint)
  .then(blob => blob.json())
  .then(data => emojis.push(...data))
  .catch(err => console.log(err));

function findMatchesSearch(wordToMatch, emojis) {
  return emojis.filter(emoji => {
    const regex = new RegExp(wordToMatch, 'gi');

    // return emoji.name.match(regex) || emoji.code.match(regex);
    return emoji.name.match(regex);
  });
}

function displayMatchesSearch() {
  const matchArray = findMatchesSearch(this.value, emojis);
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
  titleBlock.style.display = 'none';
}

const searchInput = document.querySelector('.search-field');
const result = document.querySelector('#result');
searchInput.addEventListener('change', displayMatchesSearch);
searchInput.addEventListener('keyup', displayMatchesSearch);

/**
 * Tabs Filter
 */
const searchFilter = document.querySelectorAll('.search-filter a');

function findMatchesFilter(filterMatch, emojis) {
  return emojis.filter(emoji => {
    const regex = new RegExp(filterMatch, 'gi');
    if (emoji.category) {
      return emoji.category.match(regex);
    } else {
      return null;
    }
  });
}

function displayMatchesFilter(e) {
  e.preventDefault();

  const matchArray = findMatchesFilter(this.getAttribute('href'), emojis);
  const html = matchArray
    .map(emoji => {
      titleBlock.textContent = emoji.category;
      titleBlock.style.display = 'block';
      return `
        <li class="emoji-item">
          ${emoji.char}
        </li>
      `;
    })
    .join('');

  if (html) {
    result.innerHTML = html;
  } else {
    result.innerHTML = 'NOBODY!!!';
    titleBlock.style.display = 'none';
  }
}

// searchFilter.addEventListener('click', findMatchesFilter);
searchFilter.forEach(el => el.addEventListener('click', displayMatchesFilter));

/**
 * Copy emoji
 */
const emojisContent = document.querySelector('.emoji-block');
const chooseField = document.querySelector('.choose-field');

emojisContent.addEventListener('click', getEmoji);

function getEmoji(em) {
  const emoji = em.target.textContent;
  return (chooseField.value += emoji.trim());
}

const copyBtn = document.querySelector('.wr-btn-copy');
copyBtn.addEventListener('click', () => {
  const chooseField = document.querySelector('.choose-field');
  chooseField.select();

  try {
    const successful = document.execCommand('copy');
    const msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  }
});
