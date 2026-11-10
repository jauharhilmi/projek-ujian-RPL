document.addEventListener('DOMContentLoaded', () => {

    /* ===================================================
       0. ANIMASI JARINGAN KONSTELASI CYAN
       =================================================== */

    const constellationCanvas = document.getElementById(
        'constellationCanvas'
    );

    // Pastikan canvas tersedia
    if (constellationCanvas) {

        const ctx = constellationCanvas.getContext('2d');

        let particles = [];
        let animationFrame = null;

        const particleConfig = {
            count: 100,
            maxDistance: 200,
            speed: 0.4,
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

                // Tanpa shadowBlur agar rendering lebih ringan
                ctx.fill();
            }
        }

        // Membuat kumpulan partikel
        function createParticles() {

            particles = [];

            const particleCount =
                window.innerWidth < 768
                    ? 35
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

                    const distanceSquared =
                        dx * dx + dy * dy;

                    // Hindari akar kuadrat jika partikel terlalu jauh
                    if (
                        distanceSquared <
                        particleConfig.maxDistance *
                        particleConfig.maxDistance
                    ) {

                        const distance =
                            Math.sqrt(distanceSquared);

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

                        ctx.stroke();
                    }
                }
            }
        }

        // Animasi utama
        function animateConstellation() {

            // Hentikan animasi jika tab tidak terlihat
            if (document.hidden) {
                animationFrame = null;
                return;
            }

            // Frame yang sedang berjalan sudah selesai
            animationFrame = null;

            ctx.clearRect(
                0,
                0,
                canvasWidth,
                canvasHeight
            );

            // Update dan gambar partikel
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // Gambar jaringan konstelasi
            drawConnections();

            // Jadwalkan frame berikutnya
            if (!document.hidden) {

                animationFrame =
                    requestAnimationFrame(
                        animateConstellation
                    );
            }
        }

        // Menjalankan animasi jika belum berjalan
        function startConstellationAnimation() {

            if (
                !document.hidden &&
                animationFrame === null
            ) {

                animationFrame =
                    requestAnimationFrame(
                        animateConstellation
                    );
            }
        }

        // Menghentikan animasi
        function stopConstellationAnimation() {

            if (animationFrame !== null) {

                cancelAnimationFrame(
                    animationFrame
                );

                animationFrame = null;
            }
        }

        // Resize canvas saat ukuran layar berubah
        window.addEventListener(
            'resize',
            resizeConstellationCanvas
        );

        // Hentikan animasi ketika tab disembunyikan
        // Jalankan kembali ketika tab dibuka
        document.addEventListener(
            'visibilitychange',
            () => {

                if (document.hidden) {

                    stopConstellationAnimation();

                } else {

                    startConstellationAnimation();
                }
            }
        );

        // Inisialisasi canvas
        resizeConstellationCanvas();

        // Mulai animasi
        startConstellationAnimation();
    }


    /* ===================================================
       1. MODE GELAP PERMANEN
       =================================================== */

    document.body.classList.add('dark-mode');


    /* ===================================================
       2. SCROLL REVEAL ANIMATION
       =================================================== */

    const revealElements =
        document.querySelectorAll('.reveal');

    const revealOnScroll = () => {

        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        revealElements.forEach(el => {

            const revealTop =
                el.getBoundingClientRect().top;

            if (
                revealTop <
                windowHeight - revealPoint
            ) {

                el.classList.add('active');
            }
        });
    };

    window.addEventListener(
        'scroll',
        revealOnScroll,
        { passive: true }
    );

    revealOnScroll();


    /* ===================================================
       3. MENU HAMBURGER (MOBILE TOGGLE)
       =================================================== */

    const hamburger =
        document.getElementById('hamburger');

    const navMenu =
        document.getElementById('navMenu');

    if (hamburger && navMenu) {

        hamburger.addEventListener('click', () => {

            navMenu.classList.toggle('active');

            const icon =
                hamburger.querySelector('i');

            if (icon) {

                if (
                    navMenu.classList.contains('active')
                ) {

                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');

                } else {

                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });

        document.querySelectorAll('.nav-menu a')
            .forEach(link => {

                link.addEventListener('click', () => {

                    navMenu.classList.remove('active');

                    const icon =
                        hamburger.querySelector('i');

                    if (icon) {

                        icon.classList.remove('fa-xmark');
                        icon.classList.add('fa-bars');
                    }
                });
            });
    }


    /* ===================================================
       4. FILTER ULASAN SHOPEE
       =================================================== */

    const tagBtns =
        document.querySelectorAll('.tag-btn');

    const reviewCards =
        document.querySelectorAll('.shopee-review-card');

    tagBtns.forEach(btn => {

        btn.addEventListener('click', () => {

            tagBtns.forEach(b => {
                b.classList.remove('active');
            });

            btn.classList.add('active');

            const filter =
                btn.getAttribute('data-filter');

            reviewCards.forEach(card => {

                if (filter === 'all') {

                    card.style.display = 'block';

                } else if (
                    filter === 'photo' &&
                    card.getAttribute('data-has-photo') === 'true'
                ) {

                    card.style.display = 'block';

                } else if (
                    filter === '5star' &&
                    card.getAttribute('data-rating') === '5'
                ) {

                    card.style.display = 'block';

                } else {

                    card.style.display = 'none';
                }
            });
        });
    });


    /* ===================================================
       5. FORM ULASAN MANDIRI ALA SHOPEE
       =================================================== */

    const reviewForm =
        document.getElementById('reviewForm');

    const reviewAlert =
        document.getElementById('reviewAlert');

    const reviewsContainer =
        document.getElementById('reviewsContainer');

    if (
        reviewForm &&
        reviewAlert &&
        reviewsContainer
    ) {

        reviewForm.addEventListener('submit', (e) => {

            e.preventDefault();

            const name =
                document.getElementById('reviewName')
                    .value.trim();

            const product =
                document.getElementById('reviewProduct')
                    .value.trim();

            const rating =
                parseInt(
                    document.getElementById('reviewRating')
                        .value
                );

            const productPhoto =
                document.getElementById('reviewProductPhoto')
                    .value.trim() ||
                'https://via.placeholder.com/100x100?text=Foto+Produk';

            const comment =
                document.getElementById('reviewComment')
                    .value.trim();

            let starsHtml = '';

            for (let i = 0; i < 5; i++) {

                if (i < rating) {

                    starsHtml +=
                        '<i class="fa-solid fa-star"></i>';

                } else {

                    starsHtml +=
                        '<i class="fa-regular fa-star"></i>';
                }
            }

            const dateStr =
                new Date().toISOString().split('T')[0];

            const newReviewCard =
                document.createElement('div');

            newReviewCard.className =
                'shopee-review-card';

            newReviewCard.setAttribute(
                'data-rating',
                rating
            );

            newReviewCard.setAttribute(
                'data-has-photo',
                'true'
            );

            newReviewCard.innerHTML = `
                <div class="user-meta">
                    <img
                        src="https://via.placeholder.com/50?text=User"
                        class="avatar"
                        alt="${name}"
                    >

                    <div>
                        <h4>${name}</h4>

                        <div class="stars-sm">
                            ${starsHtml}
                        </div>

                        <span class="review-time">
                            ${dateStr} | Variasi: ${product}
                        </span>
                    </div>
                </div>

                <div class="review-body">
                    <p class="review-text">
                        ${comment}
                    </p>

                    <div class="product-photos">
                        <div class="photo-item">
                            <img
                                src="${productPhoto}"
                                alt="Foto ${product}"
                            >
                        </div>
                    </div>
                </div>
            `;

            reviewsContainer.prepend(
                newReviewCard
            );

            reviewAlert.textContent =
                'Ulasan Shopee Anda berhasil dipublikasikan!';

            reviewAlert.classList.add('success');

            reviewForm.reset();
        });
    }


    /* ===================================================
       6. FORM VALIDATION KONTAK
       =================================================== */

    const contactForm =
        document.getElementById('contactForm');

    const nameInput =
        document.getElementById('name');

    const phoneInput =
        document.getElementById('phone');

    const messageInput =
        document.getElementById('message');

    const nameError =
        document.getElementById('nameError');

    const phoneError =
        document.getElementById('phoneError');

    const messageError =
        document.getElementById('messageError');

    const alertMessage =
        document.getElementById('alertMessage');

    if (
        contactForm &&
        nameInput &&
        phoneInput &&
        messageInput &&
        nameError &&
        phoneError &&
        messageError &&
        alertMessage
    ) {

        contactForm.addEventListener('submit', (e) => {

            e.preventDefault();

            let isValid = true;

            nameError.textContent = '';
            phoneError.textContent = '';
            messageError.textContent = '';

            alertMessage.className =
                'alert-message';

            alertMessage.textContent = '';

            // Validasi nama
            if (
                nameInput.value.trim() === ''
            ) {

                nameError.textContent =
                    'Nama lengkap wajib diisi.';

                isValid = false;
            }

            // Validasi nomor telepon
            const phoneRegex =
                /^[0-9+\s-]{9,15}$/;

            if (
                phoneInput.value.trim() === ''
            ) {

                phoneError.textContent =
                    'Nomor HP/WhatsApp wajib diisi.';

                isValid = false;

            } else if (
                !phoneRegex.test(
                    phoneInput.value.trim()
                )
            ) {

                phoneError.textContent =
                    'Format nomor HP tidak valid.';

                isValid = false;
            }

            // Validasi pesan
            if (
                messageInput.value.trim() === ''
            ) {

                messageError.textContent =
                    'Pertanyaan atau pesan tidak boleh kosong.';

                isValid = false;
            }

            // Jika semua valid
            if (isValid) {

                alertMessage.textContent =
                    'Terima kasih! Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.';

                alertMessage.classList.add(
                    'success'
                );

                contactForm.reset();
            }
        });
    }

});