/* ==========================================================================
   ISA HERNANDEZ | PHOTO & MAKE UP
   FAQ Accordion & Search Filter Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const accordionItems = document.querySelectorAll('.accordion-item');
  const searchInput = document.querySelector('.faq-search-input');

  // Accordion Toggle
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');

    if (header && content) {
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Close others in same group or keep independent
        item.classList.toggle('active', !isOpen);
        content.style.maxHeight = !isOpen ? content.scrollHeight + 'px' : '0px';
      });
    }
  });

  // Search Filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();

      accordionItems.forEach(item => {
        const q = item.querySelector('.accordion-question').textContent.toLowerCase();
        const a = item.querySelector('.accordion-text').textContent.toLowerCase();

        if (q.includes(term) || a.includes(term)) {
          item.style.display = 'block';
          if (term.length > 2) {
            item.classList.add('active');
            const content = item.querySelector('.accordion-content');
            if (content) content.style.maxHeight = content.scrollHeight + 'px';
          }
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
});
