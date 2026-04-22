const STORAGE_KEY = 'sevenfriday.watch-manager.v1';

const MODEL_LIBRARY = [
  {
    modelName: 'M2/02',
    modelCode: 'M2/02',
    assetSrc: './assets/m-series-m2-2.png',
    accent: '#c6a85a',
    highlight: '#f3dfad',
    shadow: '#7c642a',
  },
  {
    modelName: 'M3/01 "SPACESHIP"',
    modelCode: 'M3/01',
    assetSrc: './assets/m-series-m3-1.png',
    accent: '#b59a4d',
    highlight: '#e6d2a2',
    shadow: '#645123',
  },
  {
    modelName: 'M1B/01 AKA "URBAN EXPLORER"',
    modelCode: 'M1B/01',
    assetSrc: './assets/m-series-m1b-1.png',
    accent: '#d6bf77',
    highlight: '#f1e0b2',
    shadow: '#8a7338',
  },
  {
    modelName: 'M3/07 AKA "SPACESHIP II"',
    modelCode: 'M3/07',
    assetSrc: './assets/m-series-m3-7.png',
    accent: '#a8a8a8',
    highlight: '#dedede',
    shadow: '#6e6e6e',
  },
  {
    modelName: 'M2/05',
    modelCode: 'M2/05',
    assetSrc: './assets/m-series-m2-2.png',
    accent: '#c9b07a',
    highlight: '#f0e0b7',
    shadow: '#7d6a41',
  },
];

const app = document.getElementById('app');

const state = {
  watches: loadWatches(),
  isRegistering: false,
  selectedWatchId: null,
};

function loadWatches() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Unable to load watch data', error);
    return [];
  }
}

function saveWatches(watches) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(watches));
  } catch (error) {
    console.warn('Unable to save watch data', error);
  }
}

function getRandomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function createId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }

  return `watch-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

function createSerial() {
  const parts = Array.from({ length: 3 }, () =>
    Math.floor(Math.random() * 0x10000)
      .toString(16)
      .toUpperCase()
      .padStart(4, '0'),
  );

  return `SF-${parts.join('-')}`;
}

function shortSerial(serial) {
  if (!serial) {
    return '';
  }

  const cleaned = String(serial);
  if (cleaned.length <= 12) {
    return cleaned;
  }

  return `${cleaned.slice(0, 7)}…${cleaned.slice(-6)}`;
}

function escapeXml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function escapeHtml(text) {
  return escapeXml(text);
}

function getPalette(modelCode) {
  const source = MODEL_LIBRARY.find((item) => item.modelCode === modelCode) || MODEL_LIBRARY[0];
  return {
    accent: source.accent,
    highlight: source.highlight,
    shadow: source.shadow,
  };
}

function createMockWatch() {
  const model = getRandomItem(MODEL_LIBRARY);
  const year = 2021 + Math.floor(Math.random() * 5);
  const palette = getPalette(model.modelCode);

  return {
    id: createId(),
    modelName: model.modelName,
    modelCode: model.modelCode,
    serial: createSerial(),
    ownedSince: year,
    status: 'Active',
    palette,
    imageSrc: model.assetSrc,
    createdAt: Date.now(),
  };
}

function createWatchImage(watch) {
  if (watch.imageSrc) {
    return watch.imageSrc;
  }

  const palette = watch.palette || getPalette(watch.modelCode);
  const modelCode = escapeXml(watch.modelCode || 'SF');
  const modelName = escapeXml(watch.modelName || 'SevenFriday');
  const serial = escapeXml(shortSerial(watch.serial));

  const svg = `
    <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${modelName}">
      <defs>
        <linearGradient id="bg" x1="26" y1="16" x2="292" y2="300" gradientUnits="userSpaceOnUse">
          <stop stop-color="#111111"/>
          <stop offset="1" stop-color="#232323"/>
        </linearGradient>
        <linearGradient id="metal" x1="84" y1="44" x2="236" y2="286" gradientUnits="userSpaceOnUse">
          <stop stop-color="${palette.highlight}"/>
          <stop offset="0.45" stop-color="${palette.accent}"/>
          <stop offset="1" stop-color="${palette.shadow}"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="320" height="320" rx="36" fill="url(#bg)"/>
      <circle cx="160" cy="160" r="84" stroke="${palette.accent}" stroke-opacity="0.18" stroke-width="8"/>
      <circle cx="160" cy="160" r="64" fill="#141414" stroke="url(#metal)" stroke-width="10"/>
      <rect x="124" y="68" width="72" height="36" rx="10" fill="url(#metal)"/>
      <rect x="124" y="216" width="72" height="36" rx="10" fill="url(#metal)"/>
      <rect x="136" y="125" width="48" height="32" rx="10" fill="#1b1b1b" stroke="${palette.accent}" stroke-opacity="0.26"/>
      <path d="M160 125V160L186 172" stroke="${palette.highlight}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="160" cy="160" r="4.8" fill="${palette.highlight}"/>
      <rect x="48" y="32" width="224" height="256" rx="28" stroke="${palette.accent}" stroke-opacity="0.08" stroke-width="1.6"/>
      <text x="160" y="258" text-anchor="middle" fill="#f5f5f5" font-size="18" font-family="Arial, Helvetica, sans-serif" font-weight="700">${modelCode}</text>
      <text x="160" y="278" text-anchor="middle" fill="#bdbdbd" font-size="11" font-family="Arial, Helvetica, sans-serif" letter-spacing="2">${serial}</text>
      <text x="160" y="52" text-anchor="middle" fill="${palette.highlight}" font-size="11" font-family="Arial, Helvetica, sans-serif" letter-spacing="3">${modelName}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function createWatchCard(watch) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'watch-card';
  card.setAttribute(
    'aria-label',
    `${watch.modelName}, serial ${shortSerial(watch.serial)}. Open watch details`,
  );

  card.innerHTML = `
    <div class="watch-card__image-wrap">
      <img class="watch-card__image" src="${createWatchImage(watch)}" alt="${escapeHtml(watch.modelName)}" />
    </div>
    <div class="watch-card__content">
      <div>
        <h3 class="watch-card__title">${escapeHtml(watch.modelName)}</h3>
        <p class="watch-card__serial">Serial: ${escapeHtml(shortSerial(watch.serial))}</p>
        <p class="watch-card__secondary">Owned since ${escapeHtml(watch.ownedSince)}</p>
      </div>
      <div class="watch-card__footer">
        <span class="watch-card__tag">View details</span>
        <span class="watch-card__chevron" aria-hidden="true">›</span>
      </div>
    </div>
  `;

  card.addEventListener('click', () => {
    openWatchDetails(watch);
    console.log('Navigate to Watch Details', watch);
  });

  return card;
}

function createPrimaryButton(label, onClick, disabled = false) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'primary-button';
  button.textContent = label;
  button.disabled = disabled;
  button.addEventListener('click', onClick);
  return button;
}

function createContent() {
  const content = document.createElement('section');
  content.className = 'app-stage__content';
  return content;
}

function getSelectedWatch() {
  return state.watches.find((watch) => watch.id === state.selectedWatchId) || null;
}

function openWatchDetails(watch) {
  state.selectedWatchId = watch.id;
  render();
}

function closeWatchDetails() {
  state.selectedWatchId = null;
  render();
}

function removeWatch(watchId) {
  state.watches = state.watches.filter((watch) => watch.id !== watchId);
  state.selectedWatchId = null;
  saveWatches(state.watches);
  render();
}

window.handleWatchManagerBack = function handleWatchManagerBack() {
  if (state.selectedWatchId) {
    closeWatchDetails();
    return;
  }

  console.log('Navigate back');
};

function createHero(count) {
  const hero = document.createElement('header');
  hero.className = 'watch-screen__hero';

  const copy = document.createElement('div');

  const title = document.createElement('h1');
  title.className = 'watch-screen__title';
  title.textContent = 'My watches';

  const lede = document.createElement('p');
  lede.className = 'watch-screen__lede';
  lede.textContent = 'Register watches, track ownership, and open a mock details flow from each card.';

  copy.append(title, lede);

  const meta = document.createElement('div');
  meta.className = 'watch-screen__meta';

  const countLabel = document.createElement('div');
  countLabel.className = 'watch-screen__count';
  countLabel.textContent = `${count} watch${count === 1 ? '' : 'es'} linked`;

  const action = createPrimaryButton(
    state.isRegistering ? 'Scanning NFC...' : 'Register Watch',
    handleRegisterWatch,
    state.isRegistering,
  );

  meta.append(countLabel);

  hero.append(copy, meta, action);
  return hero;
}

function createWatchDetailHeader(watch) {
  const header = document.createElement('div');
  header.className = 'watch-detail__header';

  const title = document.createElement('h1');
  title.className = 'watch-detail__title';
  title.textContent = watch.modelName;

  const serial = document.createElement('p');
  serial.className = 'watch-detail__serial';
  serial.textContent = `Serial ${shortSerial(watch.serial)}`;

  const status = document.createElement('span');
  status.className = 'watch-detail__status';
  status.textContent = watch.status || 'Active';

  header.append(title, serial, status);
  return header;
}

function createWatchDetailStats(watch) {
  const stats = [
    { label: 'Model', value: watch.modelCode },
    { label: 'Owned since', value: watch.ownedSince },
    { label: 'Status', value: watch.status || 'Active' },
  ];

  const grid = document.createElement('div');
  grid.className = 'watch-detail__stats';

  stats.forEach((item) => {
    const block = document.createElement('div');
    block.className = 'watch-detail__stat';

    const label = document.createElement('div');
    label.className = 'watch-detail__stat-label';
    label.textContent = item.label;

    const value = document.createElement('div');
    value.className = 'watch-detail__stat-value';
    value.textContent = String(item.value);

    block.append(label, value);
    grid.appendChild(block);
  });

  return grid;
}

function createWatchDetailView(watch) {
  const detail = document.createElement('section');
  detail.className = 'watch-detail';

  const imageWrap = document.createElement('div');
  imageWrap.className = 'watch-detail__image-wrap';
  imageWrap.innerHTML = `
    <img class="watch-detail__image" src="${createWatchImage(watch)}" alt="${escapeHtml(watch.modelName)}" />
  `;

  const copy = document.createElement('div');
  copy.className = 'watch-detail__copy';
  copy.append(createWatchDetailHeader(watch), createWatchDetailStats(watch));

  const note = document.createElement('p');
  note.className = 'watch-detail__note';
  note.textContent = 'This is a mock detail surface for the selected watch. Real NFC and server-backed data can be connected later.';

  const actions = document.createElement('div');
  actions.className = 'watch-detail__actions';

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'watch-detail__remove';
  removeButton.textContent = 'Remove watch';
  removeButton.addEventListener('click', () => {
    console.log('Remove watch', watch);
    removeWatch(watch.id);
  });

  actions.append(removeButton);

  detail.append(imageWrap, copy, note, actions);
  return detail;
}

function createWatchList(watches) {
  const list = document.createElement('section');
  list.className = 'watch-list';

  watches.forEach((watch) => {
    list.appendChild(createWatchCard(watch));
  });

  return list;
}

function createEmptyState() {
  const empty = document.createElement('section');
  empty.className = 'watch-empty';

  const panel = document.createElement('div');
  panel.className = 'watch-empty__panel';

  const iconWrap = document.createElement('div');
  iconWrap.className = 'watch-empty__icon';
  iconWrap.setAttribute('aria-hidden', 'true');
  iconWrap.innerHTML = window.SFIcons?.watch || '';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'watch-empty__eyebrow';
  eyebrow.textContent = 'VAULT STATUS';

  const title = document.createElement('h1');
  title.className = 'watch-empty__title';
  title.textContent = 'No watches locked in yet';

  const text = document.createElement('p');
  text.className = 'watch-empty__text';
  text.textContent = 'Add your first SevenFriday and turn this empty vault into a live collection.';

  const hint = document.createElement('p');
  hint.className = 'watch-empty__hint';
  hint.textContent = 'One registration unlocks tracking, ownership history, and detail views.';

  const actionWrap = document.createElement('div');
  actionWrap.className = 'watch-empty__action';

  const button = createPrimaryButton('Register your first watch', handleRegisterWatch, state.isRegistering);
  actionWrap.appendChild(button);

  panel.append(iconWrap, eyebrow, title, text, hint, actionWrap);
  empty.appendChild(panel);
  return empty;
}

function render() {
  if (!app) {
    return;
  }

  app.innerHTML = '';

  const selectedWatch = getSelectedWatch();
  const appBarTitle = selectedWatch ? selectedWatch.modelName : 'My Watches';

  if (window.renderAppBar) {
    app.appendChild(
      window.renderAppBar(appBarTitle, {
        showBack: Boolean(selectedWatch),
        onBack: window.handleWatchManagerBack,
      }),
    );
  }

  const content = createContent();
  const screen = document.createElement('section');
  screen.className = 'watch-screen';

  if (selectedWatch) {
    screen.appendChild(createWatchDetailView(selectedWatch));
  } else if (state.watches.length === 0) {
    screen.appendChild(createEmptyState());
  } else {
    screen.appendChild(createHero(state.watches.length));
    const divider = document.createElement('div');
    divider.className = 'watch-screen__divider';
    screen.append(divider, createWatchList(state.watches));
  }

  content.appendChild(screen);
  app.appendChild(content);

  if (window.renderNavbar) {
    app.appendChild(window.renderNavbar());
  }
}

function handleRegisterWatch(event) {
  if (event) {
    event.preventDefault();
  }

  if (state.isRegistering) {
    return;
  }

  state.isRegistering = true;
  render();
  console.log('Simulating NFC scan...');

  window.setTimeout(() => {
    const watch = createMockWatch();
    state.watches = [watch, ...state.watches];
    state.isRegistering = false;
    saveWatches(state.watches);
    render();
    console.log('Registered mock watch', watch);
  }, 900);
}

render();
