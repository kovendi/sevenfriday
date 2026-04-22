const navItems = [
  {
    key: 'profile',
    label: 'Profile',
    icon: window.SFIcons.profile,
    href: './my-profile.html',
  },
  {
    key: 'community',
    label: 'Community',
    icon: window.SFIcons.community,
    href: 'https://icnivad.space',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
  {
    key: 'watch',
    label: 'My Watches',
    icon: window.SFIcons.watch,
    href: './index.html',
    prominent: true,
  },
  {
    key: 'shop',
    label: 'Shop',
    icon: window.SFIcons.shop,
    href: './shop.html',
  },
];

function getCurrentNavKey(pathname = window.location.pathname) {
  const page = pathname.split('/').pop() || 'index.html';

  if (page === 'my-profile.html') {
    return 'profile';
  }

  if (page === 'shop.html') {
    return 'shop';
  }

  if (page === 'index.html' || page === '') {
    return 'watch';
  }

  return 'watch';
}

window.getActiveNavKey = getCurrentNavKey;

window.renderNavbar = function renderNavbar(options = {}) {
  const activeKey = options.activeKey || getCurrentNavKey();
  const nav = document.createElement('nav');
  nav.className = 'bottom-nav';
  nav.setAttribute('aria-label', 'Bottom navigation');

  const track = document.createElement('div');
  track.className = 'bottom-nav__track';

  navItems.forEach((item) => {
    const isActive = item.key === activeKey;
    const element = item.href ? document.createElement('a') : document.createElement('button');

    if (item.href) {
      element.href = item.href;
      if (item.target) {
        element.target = item.target;
      }
      if (item.rel) {
        element.rel = item.rel;
      }
    } else {
      element.type = 'button';
      element.addEventListener('click', () => {
        console.log(`Navigate to ${item.label}`);
      });
    }

    element.className = `bottom-nav__item${item.prominent ? ' bottom-nav__item--prominent' : ''}${item.key === 'community' ? ' bottom-nav__item--community' : ''}${isActive ? ' is-active' : ''}`;
    element.setAttribute('aria-label', item.label);
    if (isActive) {
      element.setAttribute('aria-current', 'page');
    }

    element.innerHTML = `
      <span class="bottom-nav__icon" aria-hidden="true">${item.icon}</span>
      <span class="bottom-nav__label">${item.label}</span>
    `;
    track.appendChild(element);
  });

  nav.appendChild(track);
  return nav;
};
