window.renderAppBar = function renderAppBar(titleText = 'My Watches', options = {}) {
  const { showBack = false, onBack } = options;

  const header = document.createElement('header');
  header.className = 'appbar';
  header.setAttribute('aria-label', `Top app bar: ${titleText}`);

  const leftGroup = document.createElement('div');
  leftGroup.className = 'appbar__left';

  if (showBack) {
    const action = document.createElement('button');
    action.type = 'button';
    action.className = 'appbar__action';
    action.setAttribute('aria-label', 'Back');
    action.innerHTML = `
      <span class="appbar__icon" aria-hidden="true">${window.SFIcons.backHome}</span>
    `;
    action.addEventListener('click', () => {
      if (typeof onBack === 'function') {
        onBack();
        return;
      }

      if (typeof window.handleWatchManagerBack === 'function') {
        window.handleWatchManagerBack();
        return;
      }

      console.log('Navigate back');
    });

    leftGroup.append(action);
  }

  const title = document.createElement('div');
  title.className = 'appbar__title';
  title.textContent = titleText;

  leftGroup.append(title);

  const rightGroup = document.createElement('div');
  rightGroup.className = 'appbar__right';

  const brand = document.createElement('div');
  brand.className = 'appbar__brand';
  brand.innerHTML = `
    <img src="./assets/logo.svg" alt="SevenFriday" class="appbar__logo" />
  `;

  rightGroup.append(brand);

  header.append(leftGroup, rightGroup);
  return header;
};
