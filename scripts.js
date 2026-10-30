document.addEventListener('DOMContentLoaded', () => {
  initLibraryFilters();
  buildPaperToc();
});

function initLibraryFilters() {
  const tags = Array.from(document.querySelectorAll('[data-filter]'));
  const cards = Array.from(document.querySelectorAll('[data-tags]'));
  const searchInput = document.getElementById('search-input');
  const resultCount = document.getElementById('result-count');

  if (tags.length === 0 || cards.length === 0) return;

  let activeFilter = 'all';

  const applyFilters = () => {
    const query = (searchInput && searchInput.value.trim().toLowerCase()) || '';
    let visibleCount = 0;

    cards.forEach((card) => {
      const cardTags = card.getAttribute('data-tags') || '';
      const matchesTag = activeFilter === 'all' || cardTags.includes(activeFilter);
      const text = card.textContent.toLowerCase();
      const matchesQuery = query === '' || text.includes(query);
      const visible = matchesTag && matchesQuery;
      card.style.display = visible ? 'block' : 'none';
      if (visible) visibleCount += 1;
    });

    if (resultCount) {
      resultCount.textContent = `Showing ${visibleCount} of ${cards.length} papers`;
    }
  };

  tags.forEach((tag) => {
    tag.addEventListener('click', () => {
      activeFilter = tag.getAttribute('data-filter');
      tags.forEach((button) => {
        button.classList.remove('active');
        button.setAttribute('aria-pressed', 'false');
      });
      tag.classList.add('active');
      tag.setAttribute('aria-pressed', 'true');
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  applyFilters();
}

function buildPaperToc() {
  const article = document.querySelector('article.paper');
  if (!article) return;

  const heading = article.querySelector('h1');
  const sections = Array.from(article.querySelectorAll(':scope > section.paper-section > h2'));
  if (!heading || sections.length < 3) return;

  const toc = document.createElement('nav');
  toc.className = 'paper-toc';
  toc.setAttribute('aria-label', 'On this page');

  const title = document.createElement('p');
  title.className = 'paper-toc-title';
  title.textContent = 'On this page';
  toc.appendChild(title);

  const list = document.createElement('ul');
  sections.forEach((section, index) => {
    if (!section.id) {
      section.id = `section-${index + 1}-${slugify(section.textContent)}`;
    }
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${section.id}`;
    link.textContent = section.textContent;
    item.appendChild(link);
    list.appendChild(item);
  });
  toc.appendChild(list);

  heading.insertAdjacentElement('afterend', toc);
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
