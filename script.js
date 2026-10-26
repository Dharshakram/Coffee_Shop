// ===== PRELOADER =====
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => preloader.classList.add('hidden'), 1200);
});

// ===== MOBILE MENU =====
const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");

menuOpenButton.addEventListener("click", () => {
    document.body.classList.toggle("show-mobile-menu");
});
menuCloseButton.addEventListener("click", () => menuOpenButton.click());

document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        if (document.body.classList.contains("show-mobile-menu")) menuOpenButton.click();
    });
});

// ===== NAVBAR SCROLL EFFECT =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
        const link = document.querySelector(`.nav-link[href="#${section.getAttribute('id')}"]`);
        if (link && scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
});

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), index * 80);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== STATS COUNTER =====
let statsStarted = false;
function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const step = target / (1800 / 16);
    let current = 0;
    const update = () => {
        current += step;
        if (current < target) { el.textContent = Math.floor(current).toLocaleString(); requestAnimationFrame(update); }
        else { el.textContent = target.toLocaleString() + '+'; }
    };
    update();
}
const statsSection = document.getElementById('stats');
if (statsSection) {
    new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsStarted) {
                statsStarted = true;
                document.querySelectorAll('.stat-number').forEach(el => animateCounter(el));
            }
        });
    }, { threshold: 0.3 }).observe(statsSection);
}

// ===== SWIPER =====
new Swiper('.slider-wrapper', {
    loop: true, grabCursor: true, centeredSlides: true,
    pagination: { el: '.swiper-pagination', clickable: true, dynamicBullets: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    breakpoints: {
        0: { slidesPerView: 1, spaceBetween: 20 },
        768: { slidesPerView: 2, spaceBetween: 25 },
        1024: { slidesPerView: 3, spaceBetween: 30 }
    }
});

// ===== GALLERY LIGHTBOX =====
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const galleryImages = [...galleryItems].map(item => item.querySelector('.gallery-image').src);
let currentIndex = 0;

function openLightbox(index) { currentIndex = index; lightboxImg.src = galleryImages[currentIndex]; lightbox.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeLightbox() { lightbox.classList.remove('open'); document.body.style.overflow = ''; }
function showNext() { currentIndex = (currentIndex + 1) % galleryImages.length; lightboxImg.src = galleryImages[currentIndex]; }
function showPrev() { currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length; lightboxImg.src = galleryImages[currentIndex]; }

galleryItems.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
document.getElementById('lightbox-next').addEventListener('click', showNext);
document.getElementById('lightbox-prev').addEventListener('click', showPrev);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'Escape') closeLightbox();
});

// ===== CART SYSTEM =====
let cart = [];

const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const cartBadge = document.getElementById('cart-badge');
const cartItemsContainer = document.getElementById('cart-items');
const cartEmpty = document.getElementById('cart-empty');
const cartFooter = document.getElementById('cart-footer');
const cartTotalEl = document.getElementById('cart-total');
const cartOrderSuccess = document.getElementById('cart-order-success');

function openCart() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeCart() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

document.getElementById('cart-btn').addEventListener('click', openCart);
document.getElementById('cart-close').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Close cart when clicking "Order Now" inside empty cart
document.getElementById('cart-shop-link').addEventListener('click', closeCart);

function updateCartUI() {
    // Update badge
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartBadge.textContent = totalItems;

    // Show/hide empty state
    if (cart.length === 0) {
        cartEmpty.style.display = 'block';
        cartFooter.style.display = 'none';
        cartItemsContainer.innerHTML = '';
        cartItemsContainer.appendChild(cartEmpty);
        return;
    }

    cartEmpty.style.display = 'none';
    cartFooter.style.display = 'block';
    cartOrderSuccess.style.display = 'none';

    // Render items
    const existingItems = cartItemsContainer.querySelectorAll('.cart-item');
    existingItems.forEach(el => el.remove());

    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <span class="cart-item-name">${item.name}</span>
            <span class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</span>
            <div class="cart-item-qty">
                <button class="qty-minus" data-name="${item.name}">−</button>
                <span>${item.qty}</span>
                <button class="qty-plus" data-name="${item.name}">+</button>
            </div>
            <button class="cart-item-remove" data-name="${item.name}"><i class="fas fa-trash-alt"></i></button>
        `;
        cartItemsContainer.appendChild(div);
    });

    // Update total
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    cartTotalEl.textContent = '$' + total.toFixed(2);

    // Qty & remove button events
    cartItemsContainer.querySelectorAll('.qty-plus').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = cart.find(i => i.name === btn.dataset.name);
            if (item) { item.qty++; updateCartUI(); }
        });
    });
    cartItemsContainer.querySelectorAll('.qty-minus').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = cart.find(i => i.name === btn.dataset.name);
            if (item) {
                item.qty--;
                if (item.qty <= 0) cart = cart.filter(i => i.name !== btn.dataset.name);
                updateCartUI();
            }
        });
    });
    cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            cart = cart.filter(i => i.name !== btn.dataset.name);
            updateCartUI();
        });
    });
}

// Add to Cart buttons
document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        const price = parseFloat(btn.dataset.price);
        const existing = cart.find(i => i.name === name);
        if (existing) { existing.qty++; }
        else { cart.push({ name, price, qty: 1 }); }

        // Visual feedback on button
        btn.classList.add('added');
        btn.innerHTML = '<i class="fas fa-check"></i> Added!';
        setTimeout(() => {
            btn.classList.remove('added');
            btn.innerHTML = '<i class="fas fa-plus"></i> Add';
        }, 1200);

        updateCartUI();
        openCart();
    });
});

// Checkout button
document.getElementById('cart-checkout').addEventListener('click', () => {
    cartOrderSuccess.style.display = 'block';
    cart = [];
    setTimeout(() => {
        updateCartUI();
        closeCart();
    }, 2500);
});

// Init cart UI
updateCartUI();

// ===== CONTACT FORM VALIDATION =====
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

function showError(id, msg) {
    document.getElementById(id).classList.add('error');
    document.getElementById(id + '-error').textContent = msg;
}
function clearError(id) {
    document.getElementById(id).classList.remove('error');
    document.getElementById(id + '-error').textContent = '';
}
['name', 'email', 'message'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => clearError(id));
});

if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        let valid = true;
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        if (!name) { showError('name', 'Please enter your name.'); valid = false; }
        if (!email) { showError('email', 'Please enter your email.'); valid = false; }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('email', 'Enter a valid email address.'); valid = false; }
        if (!message) { showError('message', 'Please write a message.'); valid = false; }
        if (valid) {
            formSuccess.classList.add('show');
            contactForm.reset();
            setTimeout(() => formSuccess.classList.remove('show'), 5000);
        }
    });
}

// ===== TABLE BOOKING FORM =====
const bookingForm = document.getElementById('booking-form');
const bookingSuccess = document.getElementById('booking-success');

// Set min date to today
const dateInput = document.getElementById('b-date');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
}

function showBookingError(id, msg) {
    document.getElementById(id).classList.add('error');
    document.getElementById(id + '-error').textContent = msg;
}
function clearBookingError(id) {
    document.getElementById(id).classList.remove('error');
    document.getElementById(id + '-error').textContent = '';
}
['b-name', 'b-email', 'b-phone', 'b-guests', 'b-date', 'b-time'].forEach(id => {
    document.getElementById(id).addEventListener('change', () => clearBookingError(id));
    document.getElementById(id).addEventListener('input', () => clearBookingError(id));
});

if (bookingForm) {
    bookingForm.addEventListener('submit', e => {
        e.preventDefault();
        let valid = true;
        const bName = document.getElementById('b-name').value.trim();
        const bEmail = document.getElementById('b-email').value.trim();
        const bPhone = document.getElementById('b-phone').value.trim();
        const bGuests = document.getElementById('b-guests').value;
        const bDate = document.getElementById('b-date').value;
        const bTime = document.getElementById('b-time').value;

        if (!bName) { showBookingError('b-name', 'Please enter your name.'); valid = false; }
        if (!bEmail) { showBookingError('b-email', 'Please enter your email.'); valid = false; }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bEmail)) { showBookingError('b-email', 'Enter a valid email.'); valid = false; }
        if (!bPhone) { showBookingError('b-phone', 'Please enter your phone number.'); valid = false; }
        if (!bGuests) { showBookingError('b-guests', 'Please select number of guests.'); valid = false; }
        if (!bDate) { showBookingError('b-date', 'Please select a date.'); valid = false; }
        if (!bTime) { showBookingError('b-time', 'Please select a time.'); valid = false; }

        if (valid) {
            bookingSuccess.classList.add('show');
            bookingForm.reset();
            setTimeout(() => bookingSuccess.classList.remove('show'), 6000);
        }
    });
}

// ===== BACK TO TOP =====
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => backToTop.classList.toggle('visible', window.scrollY > 300));
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
