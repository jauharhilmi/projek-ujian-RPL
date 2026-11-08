document.addEventListener('DOMContentLoaded', () => {
        /* ===================================================
       0. ANIMASI JARINGAN KONSTELASI CYAN
       =================================================== */

    const constellationCanvas = document.getElementById(
        'constellationCanvas'
    );

    const ctx = constellationCanvas.getContext('2d');

    let particles = [];
    let animationFrame;

    
const particleConfig = {
    count: 170,
    maxDistance: 145,
    speed: 0.55,
    color: '0, 255, 255'
};


    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;

    // Mengatur ukuran canvas sesuai layar
    function resizeConstellationCanvas() {

        const pixelRatio = Math.min(
            window.devicePixelRatio || 1,
            2
        );

        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;

        constellationCanvas.width =
            canvasWidth * pixelRatio;

        constellationCanvas.height =
            canvasHeight * pixelRatio;

        constellationCanvas.style.width =
            canvasWidth + 'px';

        constellationCanvas.style.height =
            canvasHeight + 'px';

        ctx.setTransform(
            pixelRatio,
            0,
            0,
            pixelRatio,
            0,
            0
        );

        createParticles();
    }

    // Membuat partikel konstelasi
    class ConstellationParticle {

        constructor() {

            this.x = Math.random() * canvasWidth;
            this.y = Math.random() * canvasHeight;

            this.radius = Math.random() * 1.8 + 0.8;

            this.speedX =
                (Math.random() - 0.5) *
                particleConfig.speed;

            this.speedY =
                (Math.random() - 0.5) *
                particleConfig.speed;

            this.opacity =
                Math.random() * 0.5 + 0.4;
        }

        // Menggerakkan partikel
        update() {

            this.x += this.speedX;
            this.y += this.speedY;

            // Partikel muncul kembali dari sisi berlawanan
            if (this.x > canvasWidth) {
                this.x = 0;
            }

            if (this.x < 0) {
                this.x = canvasWidth;
            }

            if (this.y > canvasHeight) {
                this.y = 0;
            }

            if (this.y < 0) {
                this.y = canvasHeight;
            }
        }

        // Menggambar titik cyan
        draw() {

            ctx.beginPath();

            ctx.arc(
                this.x,
                this.y,
                this.radius,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                `rgba(${particleConfig.color}, ${this.opacity})`;

            ctx.shadowBlur = 12;

            ctx.shadowColor = '#00ffff';

            ctx.fill();

            ctx.shadowBlur = 0;
        }
    }

    // Membuat kumpulan partikel
    function createParticles() {

        particles = [];

        const particleCount =
    window.innerWidth < 768
        ? 65
        : particleConfig.count;

        for (let i = 0; i < particleCount; i++) {

            particles.push(
                new ConstellationParticle()
            );
        }
    }

    // Menghubungkan partikel yang berdekatan
    function drawConnections() {

        for (let i = 0; i < particles.length; i++) {

            for (
                let j = i + 1;
                j < particles.length;
                j++
            ) {

                const particleA = particles[i];
                const particleB = particles[j];

                const dx =
                    particleA.x - particleB.x;

                const dy =
                    particleA.y - particleB.y;

                const distance = Math.sqrt(
                    dx * dx + dy * dy
                );

                // Hanya menghubungkan partikel yang dekat
                if (
                    distance <
                    particleConfig.maxDistance
                ) {

                    const opacity =
                        1 -
                        distance /
                        particleConfig.maxDistance;

                    ctx.beginPath();

                    ctx.moveTo(
                        particleA.x,
                        particleA.y
                    );

                    ctx.lineTo(
                        particleB.x,
                        particleB.y
                    );

                    ctx.strokeStyle =
                        `rgba(${particleConfig.color}, ${opacity * 0.35})`;

                    ctx.lineWidth = 0.7;

                    ctx.shadowBlur = 5;

                    ctx.shadowColor = '#00ffff';

                    ctx.stroke();

                    ctx.shadowBlur = 0;
                }
            }
        }
    }

    // Animasi utama
    function animateConstellation() {

        ctx.clearRect(
            0,
            0,
            canvasWidth,
            canvasHeight
        );

        // Update posisi partikel
        particles.forEach(particle => {

            particle.update();

            particle.draw();

        });

        // Menggambar jaringan konstelasi
        drawConnections();

        animationFrame =
            requestAnimationFrame(
                animateConstellation
            );
    }

    // Menyesuaikan ukuran layar
    window.addEventListener(
        'resize',
        resizeConstellationCanvas
    );

    // Inisialisasi animasi
    resizeConstellationCanvas();

    animateConstellation();

    
/* ===================================================
   1. MODE GELAP PERMANEN
   =================================================== */

// Website selalu menggunakan mode gelap
document.body.classList.add('dark-mode');



    /* ===================================================
       2. Scroll Reveal Animation
       =================================================== */
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        revealElements.forEach(el => {
            const revealTop = el.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();


    /* ===================================================
       3. Menu Hamburger (Mobile Toggle)
       =================================================== */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        });
    });


    /* ===================================================
       4. Filter Ulasan Shopee
       =================================================== */
    const tagBtns = document.querySelectorAll('.tag-btn');
    const reviewCards = document.querySelectorAll('.shopee-review-card');

    tagBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tagBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            reviewCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                } else if (filter === 'photo' && card.getAttribute('data-has-photo') === 'true') {
                    card.style.display = 'block';
                } else if (filter === '5star' && card.getAttribute('data-rating') === '5') {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });


    /* ===================================================
       5. Form Ulasan Mandiri Ala Shopee
       =================================================== */
    const reviewForm = document.getElementById('reviewForm');
    const reviewAlert = document.getElementById('reviewAlert');
    const reviewsContainer = document.getElementById('reviewsContainer');

    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('reviewName').value.trim();
        const product = document.getElementById('reviewProduct').value.trim();
        const rating = parseInt(document.getElementById('reviewRating').value);
        const productPhoto = document.getElementById('reviewProductPhoto').value.trim() || 'https://via.placeholder.com/100x100?text=Foto+Produk';
        const comment = document.getElementById('reviewComment').value.trim();

        let starsHtml = '';
        for (let i = 0; i < 5; i++) {
            if (i < rating) {
                starsHtml += '<i class="fa-solid fa-star"></i>';
            } else {
                starsHtml += '<i class="fa-regular fa-star"></i>';
            }
        }

        const dateStr = new Date().toISOString().split('T')[0];

        const newReviewCard = document.createElement('div');
        newReviewCard.className = 'shopee-review-card';
        newReviewCard.setAttribute('data-rating', rating);
        newReviewCard.setAttribute('data-has-photo', 'true');
        newReviewCard.innerHTML = `
            <div class="user-meta">
                <img src="https://via.placeholder.com/50?text=User" class="avatar" alt="${name}">
                <div>
                    <h4>${name}</h4>
                    <div class="stars-sm">${starsHtml}</div>
                    <span class="review-time">${dateStr} | Variasi: ${product}</span>
                </div>
            </div>
            <div class="review-body">
                <p class="review-text">${comment}</p>
                <div class="product-photos">
                    <div class="photo-item">
                        <img src="${productPhoto}" alt="Foto ${product}">
                    </div>
                </div>
            </div>
        `;

        reviewsContainer.prepend(newReviewCard);

        reviewAlert.textContent = 'Ulasan Shopee Anda berhasil dipublikasikan!';
        reviewAlert.classList.add('success');
        reviewForm.reset();
    });


    /* ===================================================
       6. Form Validation Kontak
       =================================================== */
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    
    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    const messageError = document.getElementById('messageError');
    const alertMessage = document.getElementById('alertMessage');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        nameError.textContent = '';
        phoneError.textContent = '';
        messageError.textContent = '';
        alertMessage.className = 'alert-message';
        alertMessage.textContent = '';

        if (nameInput.value.trim() === '') {
            nameError.textContent = 'Nama lengkap wajib diisi.';
            isValid = false;
        }

        const phoneRegex = /^[0-9+\s-]{9,15}$/;
        if (phoneInput.value.trim() === '') {
            phoneError.textContent = 'Nomor HP/WhatsApp wajib diisi.';
            isValid = false;
        } else if (!phoneRegex.test(phoneInput.value.trim())) {
            phoneError.textContent = 'Format nomor HP tidak valid.';
            isValid = false;
        }

        if (messageInput.value.trim() === '') {
            messageError.textContent = 'Pertanyaan atau pesan tidak boleh kosong.';
            isValid = false;
        }

        if (isValid) {
            alertMessage.textContent = 'Terima kasih! Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.';
            alertMessage.classList.add('success');
            contactForm.reset();
        }
    });

});