/* ============================================================
   Colun — Premium Worsted Wool Fabrics
   JavaScript: Navigation, Animations, Form Handling
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    // --- Elements -------------------------------------------
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const allNavLinks = document.querySelectorAll('.nav-link');

    // --- Navbar scroll effect --------------------------------
    function updateNavbar() {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar(); // initial state

    // --- Mobile menu toggle ----------------------------------
    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    allNavLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (e) {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // --- Scroll-Reveal Animations ----------------------------
    var observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(function (el) {
        observer.observe(el);
    });

    // Also auto-add fade-in to key elements for progressive reveal
    var fadeTargets = document.querySelectorAll(
        '.feature-card, .product-card, .cert-badge, .substance-item, .quality-table, .contact-info'
    );

    fadeTargets.forEach(function (el, index) {
        if (!el.classList.contains('fade-in')) {
            el.classList.add('fade-in');
        }
        // Add staggered delay based on position within parent
        var siblings = el.parentElement ? el.parentElement.children : [];
        var pos = Array.prototype.indexOf.call(siblings, el);
        if (pos >= 0) {
            el.style.transitionDelay = (pos * 0.1) + 's';
        }
        observer.observe(el);
    });

    // --- Contact Form Handling -------------------------------
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Simple validation
        var name = document.getElementById('name').value.trim();
        var email = document.getElementById('email').value.trim();
        var message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            // Shake the form gently
            contactForm.style.animation = 'none';
            contactForm.offsetHeight; // trigger reflow
            contactForm.style.animation = 'shake 0.5s ease';
            return;
        }

        // Email format check
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('email').style.borderColor = '#c94e4e';
            setTimeout(function () {
                document.getElementById('email').style.borderColor = '';
            }, 2000);
            return;
        }

        // In a production site, you'd send this to a backend.
        // For the static demo, show a success message.
        contactForm.reset();
        formSuccess.style.display = 'block';

        // Hide success message after 6 seconds
        setTimeout(function () {
            formSuccess.style.display = 'none';
        }, 6000);
    });

    // Clear email error on input
    document.getElementById('email').addEventListener('input', function () {
        this.style.borderColor = '';
    });

    // --- Active nav link highlighting ------------------------
    var sections = document.querySelectorAll('section[id]');

    function highlightNavLink() {
        var scrollY = window.pageYOffset;
        var currentId = '';

        sections.forEach(function (section) {
            var sectionTop = section.offsetTop - 120;
            var sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentId = section.getAttribute('id');
            }
        });

        allNavLinks.forEach(function (link) {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === '#' + currentId) {
                link.classList.add('active-link');
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink, { passive: true });

    // --- Smooth scroll offset for fixed header ---------------
    // Handle hash links with offset to account for fixed navbar
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var navHeight = navbar.offsetHeight + 16;
                var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// --- Shake animation keyframes (injected via JS) ------------
var style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-6px); }
        40% { transform: translateX(6px); }
        60% { transform: translateX(-4px); }
        80% { transform: translateX(4px); }
    }

    .active-link {
        color: #c9a96e !important;
    }

    .active-link::after {
        width: 100% !important;
    }
`;
document.head.appendChild(style);

/* ============================================================
   Gallery & Lightbox System
   ============================================================ */

// --- Gallery Data -------------------------------------------
// Define image directories for each product gallery
var galleryData = {
    'four-seasons': {
        title: '四时锦·Solstice — Fabric Gallery',
        tabs: true,
        subGalleries: [
            { id: 'fs-excellence', label: 'Super 110s Excellence', dir: 'four-seasons-excellence' },
            { id: 'fs-flannel', label: 'Super 110s Flannel', dir: 'four-seasons-flannel' },
            { id: 'fs-cashmere', label: 'Super 130s Cashmere', dir: 'four-seasons-cashmere' },
            { id: 'fs-superfine', label: 'Super 150s Superfine', dir: 'four-seasons-superfine' }
        ]
    },
    'wool-silk-linen': {
        title: '云裳·Aether — Fabric Gallery',
        tabs: false,
        subGalleries: [
            { id: 'wsl', label: 'All Fabrics', dir: 'wool-silk-linen' }
        ]
    },
    'high-twist-stretch': {
        title: '凌风·Tempest — Fabric Gallery',
        tabs: false,
        subGalleries: [
            { id: 'hts', label: 'All Fabrics', dir: 'high-twist-stretch' }
        ]
    },
    'wool-poly': {
        title: '恒锦·Perennial — Fabric Gallery',
        tabs: false,
        subGalleries: [
            { id: 'wp', label: 'All Fabrics', dir: 'wool-poly' }
        ]
    },
    'business': {
        title: '君行·Nobilis — Fabric Gallery',
        tabs: false,
        subGalleries: [
            { id: 'biz', label: 'All Fabrics', dir: 'business' }
        ]
    }
};

// --- DOM Elements -------------------------------------------
var galleryOverlay = document.getElementById('galleryOverlay');
var galleryTitle = document.getElementById('galleryTitle');
var galleryTabs = document.getElementById('galleryTabs');
var galleryGrid = document.getElementById('galleryGrid');
var galleryClose = document.getElementById('galleryClose');

var lightbox = document.getElementById('lightbox');
var lightboxImg = document.getElementById('lightboxImg');
var lightboxClose = document.getElementById('lightboxClose');
var lightboxPrev = document.getElementById('lightboxPrev');
var lightboxNext = document.getElementById('lightboxNext');
var lightboxCounter = document.getElementById('lightboxCounter');

var currentGalleryImages = [];
var currentGalleryDir = '';
var currentLightboxIndex = 0;

// Image counts per directory (generated from PDFs)
var galleryImageCounts = {
    'four-seasons-excellence': 13,
    'four-seasons-flannel': 7,
    'four-seasons-cashmere': 6,
    'four-seasons-superfine': 9,
    'wool-silk-linen': 9,
    'high-twist-stretch': 7,
    'wool-poly': 47,
    'business': 0
};

// --- Open Gallery -------------------------------------------
function openGallery(galleryId) {
    var data = galleryData[galleryId];
    if (!data) return;

    galleryTitle.textContent = data.title;
    galleryTabs.innerHTML = '';

    if (data.tabs && data.subGalleries.length > 1) {
        // Render tabs
        data.subGalleries.forEach(function (sub, index) {
            var tab = document.createElement('button');
            tab.className = 'gallery-tab' + (index === 0 ? ' active' : '');
            tab.textContent = sub.label;
            tab.addEventListener('click', function () {
                // Update active tab
                galleryTabs.querySelectorAll('.gallery-tab').forEach(function (t) {
                    t.classList.remove('active');
                });
                tab.classList.add('active');
                loadGalleryImages(sub.dir, sub.label);
            });
            galleryTabs.appendChild(tab);
        });
        // Load first sub-gallery
        loadGalleryImages(data.subGalleries[0].dir, data.subGalleries[0].label);
    } else if (data.subGalleries.length === 1) {
        // No tabs needed, single sub-gallery
        galleryTabs.style.display = 'none';
        loadGalleryImages(data.subGalleries[0].dir, data.subGalleries[0].label);
    }

    galleryOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// --- Load Images into Grid ----------------------------------
function loadGalleryImages(dirName, label) {
    galleryGrid.innerHTML = '<div class="gallery-empty"><p>Loading...</p></div>';

    var dirPath = 'images/products/' + dirName + '/';
    currentGalleryDir = dirPath;
    var count = galleryImageCounts[dirName] || 0;

    if (count === 0) {
        currentGalleryImages = [];
        galleryGrid.innerHTML = '<div class="gallery-empty"><p>No images available yet.</p><p style="font-size:0.85rem;color:var(--text-muted)">Fabric photos coming soon.</p></div>';
        return;
    }

    // Generate image list (01.jpg, 02.jpg, ...)
    currentGalleryImages = [];
    for (var i = 1; i <= count; i++) {
        currentGalleryImages.push((i < 10 ? '0' : '') + i + '.jpg');
    }

    galleryGrid.innerHTML = '';
    currentGalleryImages.forEach(function (img, index) {
        var item = document.createElement('div');
        item.className = 'gallery-item fade-in';
        item.innerHTML = '<img src="' + dirPath + img + '" alt="' + label + ' - ' + (index + 1) + '" loading="lazy">';
        item.addEventListener('click', function () {
            openLightbox(index);
        });
        galleryGrid.appendChild(item);
        requestAnimationFrame(function () {
            item.classList.add('visible');
        });
    });
}

// --- Close Gallery ------------------------------------------
function closeGallery() {
    galleryOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

galleryClose.addEventListener('click', closeGallery);
galleryOverlay.querySelector('.gallery-backdrop').addEventListener('click', closeGallery);

// --- Open Lightbox ------------------------------------------
function openLightbox(index) {
    if (currentGalleryImages.length === 0) return;
    currentLightboxIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function updateLightboxImage() {
    var img = currentGalleryImages[currentLightboxIndex];
    lightboxImg.src = currentGalleryDir + img;
    lightboxCounter.textContent =
        (currentLightboxIndex + 1) + ' / ' + currentGalleryImages.length;
}

// --- Lightbox Navigation ------------------------------------
function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = galleryOverlay.classList.contains('active') ? 'hidden' : '';
}

function lightboxPrevImage() {
    if (currentGalleryImages.length === 0) return;
    currentLightboxIndex = (currentLightboxIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
    updateLightboxImage();
}

function lightboxNextImage() {
    if (currentGalleryImages.length === 0) return;
    currentLightboxIndex = (currentLightboxIndex + 1) % currentGalleryImages.length;
    updateLightboxImage();
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', lightboxPrevImage);
lightboxNext.addEventListener('click', lightboxNextImage);

// --- Keyboard Navigation ------------------------------------
document.addEventListener('keydown', function (e) {
    if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') lightboxPrevImage();
        if (e.key === 'ArrowRight') lightboxNextImage();
    } else if (galleryOverlay.classList.contains('active')) {
        if (e.key === 'Escape') closeGallery();
    }
});

// --- Bind Gallery Buttons -----------------------------------
document.querySelectorAll('.btn-gallery').forEach(function (btn) {
    btn.addEventListener('click', function () {
        var galleryId = this.getAttribute('data-gallery');
        openGallery(galleryId);
    });
});
