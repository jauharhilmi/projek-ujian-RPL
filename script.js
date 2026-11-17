
document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       BACKGROUND TECHNOLOGY PARTICLE NETWORK
    ========================================= */

    const canvas = document.getElementById('constellationCanvas');
    const ctx = canvas?.getContext('2d');

    if (canvas && ctx) {
        let particles = [];
        let width = window.innerWidth;
        let height = window.innerHeight;
        let animationFrame;
        let lastFrame = 0;

        const particleCount = Math.min(
            220,
            Math.floor((width * height) / 5000)
        );

        const connectionDistance = 180;
        const speed = 0.65;

        function resizeCanvas() {
            width = window.innerWidth;
            height = window.innerHeight;

            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            canvas.width = width * dpr;
            canvas.height = height * dpr;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            particles = [];

            const count = Math.min(
                220,
                Math.floor((width * height) / 5000)
            );

            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * speed,
                    vy: (Math.random() - 0.5) * speed,
                    radius: Math.random() * 2 + 1
                });
            }
        }

        function drawParticles() {
            ctx.clearRect(0, 0, width, height);

            // Gambar titik
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                // Pantulan pada batas layar
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius *1.3, 0, Math.PI * 2);

                ctx.fillStyle = '#38bdf8';
                ctx.shadowBlur = 12;
                ctx.shadowColor = '#38bdf8';
                ctx.fill();

                ctx.shadowBlur = 0;
            });

            // Hubungkan titik yang berdekatan
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        const opacity = 1 - distance / connectionDistance;

                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);

                        ctx.strokeStyle =
                            `rgba(56, 189, 248, ${opacity * 0.35})`;

                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
        }

        function animate(timestamp) {
            if (document.hidden) {
                animationFrame = null;
                return;
            }

            // Batasi animasi sekitar 30 FPS
            if (timestamp - lastFrame >= 33) {
                drawParticles();
                lastFrame = timestamp;
            }

            animationFrame = requestAnimationFrame(animate);
        }

        function startAnimation() {
            if (
                window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ) {
                drawParticles();
                return;
            }

            if (!animationFrame) {
                animationFrame = requestAnimationFrame(animate);
            }
        }

        function stopAnimation() {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }
        }

        resizeCanvas();
        startAnimation();

        window.addEventListener('resize', () => {
            resizeCanvas();
            lastFrame = 0;
        });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAnimation();
            } else {
                startAnimation();
            }
        });
    }


    /* =========================================
       1. MODE GELAP
    ========================================= */

    document.body.classList.add('dark-mode');


    /* =========================================
       2. SCROLL REVEAL ANIMATION
    ========================================= */

    const revealElements = document.querySelectorAll('.reveal');

    function revealOnScroll() {
        const windowHeight = window.innerHeight;

        revealElements.forEach(element => {
            const revealTop = element.getBoundingClientRect().top;

            if (revealTop < windowHeight - 100) {
                element.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll, {
        passive: true
    });

    revealOnScroll();


    /* =========================================
       3. MENU HAMBURGER
    ========================================= */

    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {

        hamburger.addEventListener('click', () => {

            navMenu.classList.toggle('active');

            const icon = hamburger.querySelector('i');

            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {

            link.addEventListener('click', () => {

                navMenu.classList.remove('active');

                const icon = hamburger.querySelector('i');

                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });

        });
    }


    /* =========================================
       4. FILTER ULASAN
    ========================================= */

    const tagBtns = document.querySelectorAll('.tag-btn');
    const reviewsContainer = document.getElementById('reviewsContainer');

    function updateReviewFilter(filter = 'all') {

        if (!reviewsContainer) return;

        const reviewCards = reviewsContainer.querySelectorAll(
            '.shopee-review-card'
        );

        let totalAll = reviewCards.length;
        let totalPhoto = 0;
        let totalFiveStar = 0;

        reviewCards.forEach(card => {

            const hasPhoto =
                card.getAttribute('data-has-photo') === 'true';

            const rating =
                card.getAttribute('data-rating');

            if (hasPhoto) totalPhoto++;
            if (rating === '5') totalFiveStar++;

            let show = false;

            if (filter === 'all') {
                show = true;
            }

            if (filter === 'photo' && hasPhoto) {
                show = true;
            }

            if (filter === '5star' && rating === '5') {
                show = true;
            }

            card.style.display = show ? '' : 'none';
        });

        // Perbarui jumlah ulasan pada tombol
        tagBtns.forEach(btn => {

            const buttonFilter = btn.getAttribute('data-filter');

            if (buttonFilter === 'all') {
                btn.textContent = `Semua (${totalAll})`;
            }

            if (buttonFilter === 'photo') {
                btn.textContent = `Dengan Foto (${totalPhoto})`;
            }

            if (buttonFilter === '5star') {
                btn.textContent = `5 Bintang (${totalFiveStar})`;
            }

        });
    }

    tagBtns.forEach(btn => {

        btn.addEventListener('click', () => {

            tagBtns.forEach(button => {
                button.classList.remove('active');
            });

            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            updateReviewFilter(filter);
        });

    });


    /* =========================================
       5. FORM TAMBAH ULASAN
    ========================================= */

    const reviewForm = document.getElementById('reviewForm');
    const reviewAlert = document.getElementById('reviewAlert');

    if (reviewForm && reviewsContainer && reviewAlert) {

        reviewForm.addEventListener('submit', (e) => {

            e.preventDefault();

            const name = document.getElementById('reviewName')
                .value.trim();

            const product = document.getElementById('reviewProduct')
                .value.trim();

            const rating = parseInt(
                document.getElementById('reviewRating').value
            );

            const comment = document.getElementById('reviewComment')
                .value.trim();

            const photoInput = document.getElementById('reviewProductPhoto');

            const photoUrl = photoInput.value.trim();

            // Validasi
            if (!name || !product || !comment) {
                showReviewAlert('Semua kolom wajib diisi.', false);
                return;
            }

            if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
                showReviewAlert('Pilihan bintang tidak valid.', false);
                return;
            }

            // Validasi URL foto
            let validPhotoUrl = '';

            if (photoUrl) {
                try {
                    const parsedUrl = new URL(photoUrl);

                    if (
                        parsedUrl.protocol === 'https:' ||
                        parsedUrl.protocol === 'http:'
                    ) {
                        validPhotoUrl = parsedUrl.href;
                    } else {
                        showReviewAlert('Link foto harus menggunakan HTTP atau HTTPS.', false);
                        return;
                    }

                } catch {
                    showReviewAlert('Link foto tidak valid.', false);
                    return;
                }
            }

            // Tanggal lokal
            const now = new Date();

            const dateStr = [
                now.getFullYear(),
                String(now.getMonth() + 1).padStart(2, '0'),
                String(now.getDate()).padStart(2, '0')
            ].join('-');

            // Membuat elemen ulasan
            const card = document.createElement('div');

            card.className = 'shopee-review-card';

            card.setAttribute('data-rating', rating);
            card.setAttribute(
                'data-has-photo',
                validPhotoUrl ? 'true' : 'false'
            );

            // Bagian identitas
            const userMeta = document.createElement('div');
            userMeta.className = 'user-meta';

            const avatar = document.createElement('img');
            avatar.src = 'https://via.placeholder.com/50?text=User';
            avatar.className = 'avatar';
            avatar.alt = 'Foto pelanggan';
            avatar.loading = 'lazy';

            const userInfo = document.createElement('div');

            const userName = document.createElement('h4');
            userName.textContent = name;

            const stars = document.createElement('div');
            stars.className = 'stars-sm';

            for (let i = 1; i <= 5; i++) {

                const star = document.createElement('i');

                star.className = i <= rating
                    ? 'fa-solid fa-star'
                    : 'fa-regular fa-star';

                stars.appendChild(star);
            }

            const reviewTime = document.createElement('span');
            reviewTime.className = 'review-time';
            reviewTime.textContent =
                `${dateStr} | Variasi: ${product}`;

            userInfo.append(userName, stars, reviewTime);
            userMeta.append(avatar, userInfo);

            // Bagian isi ulasan
            const reviewBody = document.createElement('div');
            reviewBody.className = 'review-body';

            const reviewText = document.createElement('p');
            reviewText.className = 'review-text';
            reviewText.textContent = comment;

            reviewBody.appendChild(reviewText);

            // Foto hanya ditampilkan jika URL tersedia
            if (validPhotoUrl) {

                const photos = document.createElement('div');
                photos.className = 'product-photos';

                const photoItem = document.createElement('div');
                photoItem.className = 'photo-item';

                const photo = document.createElement('img');
                photo.src = validPhotoUrl;
                photo.alt = `Foto ${product}`;
                photo.loading = 'lazy';
                photo.referrerPolicy = 'no-referrer';

                photoItem.appendChild(photo);
                photos.appendChild(photoItem);
                reviewBody.appendChild(photos);
            }

            card.append(userMeta, reviewBody);

            // Masukkan ulasan baru ke paling atas
            reviewsContainer.prepend(card);

            // Tampilkan semua ulasan
            tagBtns.forEach(button => {
                button.classList.toggle(
                    'active',
                    button.getAttribute('data-filter') === 'all'
                );
            });

            updateReviewFilter('all');

            showReviewAlert('Ulasan berhasil ditambahkan ke halaman.', true);

            reviewForm.reset();

        });
    }

    function showReviewAlert(message, success) {

        if (!reviewAlert) return;

        reviewAlert.textContent = message;

        reviewAlert.className = success
            ? 'alert-message success'
            : 'alert-message error';
    }


    /* =========================================
       6. FORM KONTAK DAN WHATSAPP
    ========================================= */

    const contactForm = document.getElementById('contactForm');

    if (contactForm) {

        contactForm.addEventListener('submit', (e) => {

            e.preventDefault();

            const name = document.getElementById('name');
            const phone = document.getElementById('phone');
            const message = document.getElementById('message');

            const nameError = document.getElementById('nameError');
            const phoneError = document.getElementById('phoneError');
            const messageError = document.getElementById('messageError');
            const alertMessage = document.getElementById('alertMessage');

            if (
                !name || !phone || !message ||
                !nameError || !phoneError ||
                !messageError || !alertMessage
            ) return;

            // Reset pesan kesalahan
            nameError.textContent = '';
            phoneError.textContent = '';
            messageError.textContent = '';

            alertMessage.textContent = '';
            alertMessage.className = 'alert-message';

            let isValid = true;

            const nameValue = name.value.trim();
            const phoneValue = phone.value.trim();
            const messageValue = message.value.trim();

            // Validasi nama
            if (nameValue.length < 2) {

                nameError.textContent =
                    'Nama minimal 2 karakter.';

                isValid = false;
            }

            // Validasi nomor telepon
            const phoneRegex = /^[0-9+\s-]{9,15}$/;

            if (!phoneRegex.test(phoneValue)) {

                phoneError.textContent =
                    'Format nomor HP tidak valid.';

                isValid = false;
            }

            // Validasi pesan
            if (messageValue.length < 3) {

                messageError.textContent =
                    'Pesan harus diisi minimal 3 karakter.';

                isValid = false;
            }

            if (!isValid) return;

            // Nomor WhatsApp toko
            const whatsappNumber = '6282141430354';

            // Susun pesan
            const whatsappMessage =
                `Halo Rafif Copy Center,

Nama: ${nameValue}
Nomor HP: ${phoneValue}

Keperluan:
${messageValue}`;

            const whatsappUrl =
                `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

            // Buka WhatsApp
            window.open(
                whatsappUrl,
                '_blank',
                'noopener,noreferrer'
            );

            alertMessage.textContent =
                'WhatsApp berhasil dibuka. Silakan periksa dan kirim pesan Anda di WhatsApp.';

            alertMessage.classList.add('success');

            contactForm.reset();

        });
    }

});

