const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(element => revealObserver.observe(element));
} else {
    revealElements.forEach(element => element.classList.add('active'));
}

const sectionLinks = [...document.querySelectorAll('.section-nav a')];
const sections = sectionLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(section => section instanceof HTMLElement);

function updateCurrentSection() {
    const marker = window.innerHeight * 0.45;
    const currentSection = sections.find(section => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= marker && bounds.bottom > marker;
    }) ?? sections.reduce((closest, section) => {
        const distance = Math.abs(section.getBoundingClientRect().top - marker);
        return distance < closest.distance ? { section, distance } : closest;
    }, { section: sections[0], distance: Infinity }).section;

    sectionLinks.forEach(link => {
        if (link.hash === `#${currentSection.id}`) {
            link.setAttribute('aria-current', 'location');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

if (sections.length) {
    let updateScheduled = false;
    const scheduleSectionUpdate = () => {
        if (!updateScheduled) {
            updateScheduled = true;
            window.requestAnimationFrame(() => {
                updateCurrentSection();
                updateScheduled = false;
            });
        }
    };

    window.addEventListener('scroll', scheduleSectionUpdate, { passive: true });
    window.addEventListener('resize', scheduleSectionUpdate);
    updateCurrentSection();
}
