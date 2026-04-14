document.addEventListener('DOMContentLoaded', () => {
  const tags = Array.from(document.querySelectorAll('[data-filter]'));
  const cards = Array.from(document.querySelectorAll('[data-tags]'));

  if (tags.length === 0 || cards.length === 0) return;

  tags.forEach((tag) => {
    tag.addEventListener('click', () => {
      const filter = tag.getAttribute('data-filter');
      tags.forEach((button) => button.classList.remove('active'));
      tag.classList.add('active');

      cards.forEach((card) => {
        const cardTags = card.getAttribute('data-tags') || '';
        const visible = filter === 'all' || cardTags.includes(filter);
        card.style.display = visible ? 'block' : 'none';
      });
    });
  });
});
