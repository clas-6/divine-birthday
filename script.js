const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) revealObserver.unobserve(entry.target);
    entry.target.classList.toggle('is-visible', entry.isIntersecting);
  });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const progress = document.querySelector('.scroll-progress');
const parallaxItems = document.querySelectorAll('.parallax');
const mobileLayout = window.matchMedia('(max-width: 750px)');
let scrollTicking = false;
const updateScrollEffects = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${scrollable ? (window.scrollY / scrollable) * 100 : 0}%`;
  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.speed || 0.1);
    item.style.transform = mobileLayout.matches ? 'rotate(3deg)' : `translateY(${window.scrollY * speed}px) rotate(3deg)`;
  });
  scrollTicking = false;
};
window.addEventListener('scroll', () => {
  if (!scrollTicking) { window.requestAnimationFrame(updateScrollEffects); scrollTicking = true; }
}, { passive: true });
updateScrollEffects();

document.querySelectorAll('.photo-card').forEach((card) => {
  card.addEventListener('click', () => {
    lightboxImage.src = card.dataset.full;
    lightboxImage.alt = card.querySelector('img').alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  });
});

document.querySelectorAll('.read-letter').forEach((button) => {
  button.addEventListener('click', () => {
    const letter = button.closest('.hanging-letter');
    const isOpen = letter.classList.toggle('is-open');
    button.querySelector('span').textContent = isOpen ? '↙' : '↗';
    button.firstChild.textContent = isOpen ? 'fold the note ' : 'read the full note ';
  });
});

const closeLightbox = () => {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImage.src = '';
};

document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
});

document.querySelectorAll('video').forEach((video) => {
  video.addEventListener('play', () => {
    document.querySelectorAll('video').forEach((otherVideo) => {
      if (otherVideo !== video) otherVideo.pause();
    });
  });
});
