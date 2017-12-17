const endpoint = '../data/emojis.json';
const emojis = [];
const titleBlock = document.querySelector('.title-block');
const result = document.querySelector('#result');

/** */
getContent();
function getContent() {
  fetch(endpoint)
    .then(res => res.json())
    .then(data => {
      emojis.push(...data);

      let html = '';
      data.forEach(emoji => {
        if (emoji.src) {
          html += `
            <li class="emoji-item">
              <img src="${emoji.src}" alt="${emoji.char}">
              <span class="emoji-char">${emoji.char}</span>
            </li>
          `;
        }
      });

      result.innerHTML = html;
    })
    .catch(err => console.log(err));
}
/** */

/**
 * Search Field
 */
function findMatchesSearch(wordToMatch, emojis) {
  return emojis.filter(emoji => {
    const regex = new RegExp(wordToMatch, 'gi');

    // return emoji.name.match(regex) || emoji.code.match(regex);
    return emoji.name.match(regex);
  });
}

function displayMatchesSearch() {
  const clearBtn = document.querySelector('.wr-clear-search-btn');
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.classList.remove('active');
    getContent();
  });

  if (!searchInput.value.length) {
    clearBtn.classList.remove('active');
  } else {
    clearBtn.classList.add('active');
  }

  const matchArray = findMatchesSearch(this.value, emojis);
  const html = matchArray
    .map(emoji => {
      return `
        <li class="emoji-item">
          <img src="${emoji.src}" alt="${emoji.char}">
          <span class="emoji-char">${emoji.char}</span>
        </li>
      `;
    })
    .join('');

  result.innerHTML = html;
  // titleBlock.style.display = 'none';
}

const searchInput = document.querySelector('.search-field');
// searchInput.addEventListener('change', displayMatchesSearch);
searchInput.addEventListener('keyup', displayMatchesSearch);

/**
 * Tabs Filter
 */
const categoryItems = document.querySelectorAll('.search-filter a');

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
          <img src="${emoji.src}" alt="${emoji.char}">
          <span class="emoji-char">${emoji.char}</span>
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

// categoryItems.addEventListener('click', findMatchesFilter);
categoryItems.forEach(el => el.addEventListener('click', displayMatchesFilter));

/**
 * Copy emoji
 */
const emojisContent = document.querySelector('.emoji-block');
const chooseField = document.querySelector('.choose-field');

emojisContent.addEventListener('click', getEmoji);

function getEmoji(em) {
  const clearBtn = document.querySelector('.wr-clear-choose-btn');
  clearBtn.classList.add('active');

  clearBtn.addEventListener('click', () => {
    chooseField.value = '';
    clearBtn.classList.remove('active');
  });

  if (em.target != result) {
    const emoji = em.target.textContent;
    const emojiContainer = em.target.parentNode;
    const emojiCopyMessage = `
      <div class="emoji-copy-message">
        <img src="${em.target.parentElement.firstElementChild.getAttribute(
          'src'
        )}">
        <span>Copied!</span>
      </div>
    `;

    let textarea = document.createElement('textarea');
    textarea.textContent = emoji;
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.warn('Copy to clipboard failed.', err);
      return false;
    } finally {
      document.body.removeChild(textarea);
    }

    emojiContainer.insertAdjacentHTML('beforeend', emojiCopyMessage);

    setTimeout(() => {
      emojiContainer.removeChild(
        em.target.parentElement.querySelector('.emoji-copy-message')
      );
    }, 800);

    if (emoji != 'Copied!') {
      chooseField.value += emoji.trim();
    }
  }
}

const copyBtn = document.querySelector('.wr-btn-copy');
copyBtn.addEventListener('click', () => {
  const chooseField = document.querySelector('.choose-field');
  chooseField.select();

  const messageCopyField = document.querySelector('.message-info');
  setTimeout(() => {
    messageCopyField.classList.remove('active');
  }, 1500);

  if (chooseField.value.length) {
    messageCopyField.classList.add('active');

    try {
      const successful = document.execCommand('copy');
      const msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copying text command was ' + msg);
    } catch (err) {
      console.log('Oops, unable to copy', err);
    }
  }
});

/**
 * Search categories
 */
const categories = document.querySelectorAll('.search-filter li');
categories.forEach(category => {
  category.addEventListener('click', function() {
    if (this.classList != 'active') {
      for (let cat of categories) {
        cat.classList.remove('active');
      }
    }
    this.classList.add('active');
  });
});

/**
 * Drag categories panel
 */
const bodyCatPanel = document.querySelector('.block-search-filter');
const catPanel = document.querySelector('.search-filter');
catPanel.addEventListener('mousedown', e => {
  let panelCoords = getCoords(catPanel);
  let shiftX = e.pageX - panelCoords.left;
});

function getCoords(elem) {
  let box = elem.getBoundingClientRect();

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset,
    right: box.right + pageXOffset
  };
}
