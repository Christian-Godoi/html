// Alternar Tipo de Usuário
function toggleUserType(button) {
    const allButtons = document.querySelectorAll('.user-type');
    allButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
}

// Smooth scroll customizado
function smoothScrollTo(targetElement, duration = 900) {
    if (!targetElement) return;
    const offset = 20;
    const startY = window.pageYOffset;
    const targetY = targetElement.getBoundingClientRect().top + startY - offset;
    const distance = targetY - startY;
    const startTime = performance.now();

    function ease(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, startY + distance * ease(progress));
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

function handleScrollToApp(event) {
    event.preventDefault();
    const targetId = this.dataset.scrollTarget || this.getAttribute('href')?.replace('#', '') || 'faq';
    const target = document.getElementById(targetId);
    smoothScrollTo(target);
}

document.querySelectorAll('.scroll-to-app, .menu-link, a[href="#faq"]').forEach(function(element) {
    element.addEventListener('click', handleScrollToApp);
});

// Adicionar efeito de scroll na navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('header.navbar');
    if (window.scrollY > 100) {
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.2)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Ações de Botão
function scrollToFaq(event) {
    if (event) event.preventDefault();
    const target = document.getElementById('faq');
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

document.querySelectorAll('.scroll-to-app').forEach(function(element) {
    element.addEventListener('click', scrollToFaq);
});

document.querySelector('.btn-google')?.addEventListener('click', function() {
    alert('Abrindo Google Play Store...');
});

document.querySelector('.btn-apple')?.addEventListener('click', function() {
    alert('Abrindo App Store...');
});

let carouselCurrentIndex = 0;

// Carousel and search setup
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const searchInput = document.getElementById('site-search');
    const suggestions = document.getElementById('search-suggestions');
    const carouselTitle = document.querySelector('.carousel-info h3');
    const carouselDesc = document.querySelector('.carousel-info .desc');
    const carouselPrice = document.querySelector('.carousel-info .price strong');
    const nextButton = document.querySelector('.carousel-btn.next');
    const prevButton = document.querySelector('.carousel-btn.prev');

    const carouselSlides = track ? Array.from(track.querySelectorAll('.carousel-slide')) : [];
    const items = [
        {
            name: 'Fusão Nuclear',
            subtitle: 'Dupla de carnes, chédar e caro',
            price: 'R$ 48,00',
            oldPrice: 'R$ 60,00',
            image: 'https://i.ibb.co/SXQYZ5Bt/hamburguer.png',
            targetId: 'riders',
            slideIndex: 0
        },
        {
            name: 'Fissão Nuclear',
            subtitle: 'Burger clássico com sabor tradicional',
            price: 'R$ 42,00',
            oldPrice: 'R$ 52,50',
            image: 'https://static.vecteezy.com/system/resources/previews/055/780/507/non_2x/classic-fast-food-burger-free-png.png',
            targetId: 'riders',
            slideIndex: 1
        },
        {
            name: 'Supernova',
            subtitle: 'Explosão de sabor com chédar derretido',
            price: 'R$ 35,00',
            oldPrice: 'R$ 43,75',
            image: 'https://png.pngtree.com/png-vector/20240829/ourmid/pngtree-delicious-and-testy-cheese-burger-png-image_13659847.png',
            targetId: 'riders',
            slideIndex: 2
        },
        {
            name: 'Cheese Storm',
            subtitle: 'Tempestade de queijos variados',
            price: 'R$ 38,00',
            oldPrice: 'R$ 47,50',
            image: 'https://png.pngtree.com/png-clipart/20240816/original/pngtree-giant-hamburger-with-dripping-mayonnaise-png-image_15780816.png',
            targetId: 'riders',
            slideIndex: 3
        },
        {
            name: 'Big Bigorna',
            subtitle: 'O maior dos nossos burgers',
            price: 'R$ 52,00',
            oldPrice: 'R$ 65,00',
            image: 'https://i.ibb.co/CKWvpRvJ/hamburguer4.png',
            targetId: 'riders',
            slideIndex: 4
        },
        {
            name: 'Curto-Circuito',
            subtitle: 'Combinação perfeita de sabores',
            price: 'R$ 32,00',
            oldPrice: 'R$ 40,00',
            image: 'https://static.vecteezy.com/system/resources/thumbnails/044/771/065/small/a-stack-of-three-chocolate-brownies-on-a-white-background-ai-generate-png.png',
            targetId: 'riders',
            slideIndex: 5
        },
        {
            name: 'Chapa Fria',
            subtitle: 'Toque refrescante e diferente',
            price: 'R$ 29,90',
            oldPrice: 'R$ 37,38',
            image: 'https://png.pngtree.com/png-clipart/20241124/original/pngtree-ice-cream-cones-png-image_17290026.png',
            targetId: 'riders',
            slideIndex: 6
        },
        {
            name: 'Brasa Viva',
            subtitle: 'Hambúrguer com ingredientes quentes e suculentos',
            price: 'R$ 34,50',
            oldPrice: 'R$ 43,13',
            image: 'https://static.vecteezy.com/system/resources/thumbnails/047/312/082/small/hamburger-with-soft-bun-and-vegetables-png.png',
            targetId: 'riders',
            slideIndex: 7
        }
    ];

    function updateSlideInfo(index) {
        const item = items[index] || items[0];
        if (carouselTitle) carouselTitle.textContent = item.name;
        if (carouselDesc) carouselDesc.textContent = item.subtitle;
        if (carouselPrice) carouselPrice.textContent = item.price;
        const carouselOldPrice = document.querySelector('.carousel-info .old-price');
        if (carouselOldPrice) carouselOldPrice.textContent = item.oldPrice || '';
    }

    function updateCarousel(index) {
        if (!track || !carouselSlides.length) return;
        carouselCurrentIndex = ((index % carouselSlides.length) + carouselSlides.length) % carouselSlides.length;
        track.style.transform = `translateX(-${carouselCurrentIndex * 100}%)`;
        carouselSlides.forEach((slide, slideIndex) => {
            slide.classList.toggle('current-slide', slideIndex === carouselCurrentIndex);
        });
        updateSlideInfo(carouselCurrentIndex);
    }

    if (nextButton) {
        nextButton.addEventListener('click', function() {
            updateCarousel(carouselCurrentIndex + 1);
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', function() {
            updateCarousel(carouselCurrentIndex - 1);
        });
    }

    window.addEventListener('resize', function() {
        updateCarousel(carouselCurrentIndex);
    });

    updateCarousel(carouselCurrentIndex);

    function normalize(str) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }

    function renderSuggestions(matches) {
        if (!suggestions) return;
        suggestions.innerHTML = '';
        if (!matches.length) {
            suggestions.hidden = true;
            return;
        }

        matches.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('suggestion-item');

            const thumb = document.createElement('img');
            thumb.classList.add('suggestion-thumb');
            thumb.src = item.image || 'img/hamburguer.jpg';
            thumb.alt = item.name;

            const content = document.createElement('div');
            content.classList.add('suggestion-content');

            const title = document.createElement('strong');
            title.classList.add('suggestion-title');
            title.textContent = item.name;

            const subtitle = document.createElement('span');
            subtitle.classList.add('suggestion-subtitle');
            subtitle.textContent = item.subtitle || '';

            const price = document.createElement('span');
            price.classList.add('suggestion-price');
            price.textContent = item.price || '';

            content.appendChild(title);
            content.appendChild(subtitle);
            content.appendChild(price);
            li.appendChild(thumb);
            li.appendChild(content);

            li.addEventListener('mousedown', function(e) {
                e.preventDefault();
                const target = document.getElementById(item.targetId);
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                updateCarousel(item.slideIndex);
                const info = document.querySelector('.carousel-info');
                if (info) {
                    info.classList.add('highlight');
                    setTimeout(() => info.classList.remove('highlight'), 2000);
                }
                suggestions.hidden = true;
            });
            suggestions.appendChild(li);
        });
        suggestions.hidden = false;
    }

    if (searchInput && suggestions) {
        searchInput.addEventListener('input', function() {
            const q = normalize(this.value.trim());
            if (!q) {
                suggestions.hidden = true;
                return;
            }
            const matches = items.filter(i => normalize(i.name).includes(q));
            renderSuggestions(matches);
        });

        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const first = suggestions.querySelector('li');
                if (first) { first.dispatchEvent(new MouseEvent('mousedown')); }
            }
        });

        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !suggestions.contains(e.target)) {
                suggestions.hidden = true;
            }
        });
    }
});