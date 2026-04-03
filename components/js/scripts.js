document.addEventListener('DOMContentLoaded', () => {

    const initCommonJS = () => {
        // --- Smooth Scrolling ---
        document.querySelectorAll('a[href^="#"], a[href^="index.html#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                // Only prevent default if it's an anchor on the same page
                const href = this.getAttribute('href');
                if (href.startsWith('#') || (href.startsWith('index.html#') && window.location.pathname.endsWith('index.html'))) {
                    e.preventDefault();
                    
                    const targetId = href.split('#')[1];
                    const target = document.getElementById(targetId);
                    
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });

        // --- FAQ Accordion ---
        const accordions = document.querySelectorAll('.accordion-header');
        
        accordions.forEach(acc => {
            // Remove previous event listeners if initialized multiple times
            const newAcc = acc.cloneNode(true);
            acc.parentNode.replaceChild(newAcc, acc);
            
            newAcc.addEventListener('click', function() {
                // Close other items
                document.querySelectorAll('.accordion-header').forEach(otherAcc => {
                    if (otherAcc !== this) {
                        otherAcc.classList.remove('active');
                        if(otherAcc.nextElementSibling) otherAcc.nextElementSibling.style.maxHeight = null;
                    }
                });
                
                // Toggle current item
                this.classList.toggle('active');
                const content = this.nextElementSibling;
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            });
        });
    };

    // --- Component Loader ---
    const loadComponents = async () => {
        try {
            const headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                const headerRes = await fetch('components/header.html');
                if (headerRes.ok) {
                    headerPlaceholder.innerHTML = await headerRes.text();
                }
            }
            
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) {
                const footerRes = await fetch('components/footer.html');
                if (footerRes.ok) {
                    footerPlaceholder.innerHTML = await footerRes.text();
                }
            }
            
            // Initialize scripts that depend on the newly loaded DOM
            initCommonJS();
        } catch (e) {
            console.warn('Could not load components dynamically. If you are opening this via file:// protocol, CORS will block the fetch. Please use Live Server.', e);
            initCommonJS(); // fallback initialization
        }
    };

    // Initialize Component Loading
    loadComponents();

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal-text, .reveal-card, .reveal-image, .reveal-pill');
    
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger on load

    // --- Media Modal Logic ---
    const modal = document.getElementById('mediaModal');
    const modalVideo = document.getElementById('modalVideo');
    const modalImage = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.close-modal');
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    const imageThumbnails = document.querySelectorAll('.image-thumbnail');

    if (modal && modalVideo && modalImage && closeBtn) {
        
        // Open modal for videos
        videoThumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                const videoSrc = this.getAttribute('data-video');
                if (videoSrc) {
                    modalImage.style.display = 'none';
                    modalVideo.style.display = 'block';
                    modalVideo.src = videoSrc;
                    modal.classList.add('active');
                    modalVideo.play();
                }
            });
        });

        // Open modal for images
        imageThumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                const imgSrc = this.getAttribute('data-image');
                if (imgSrc) {
                    modalVideo.style.display = 'none';
                    modalVideo.pause();
                    modalImage.style.display = 'block';
                    modalImage.src = imgSrc;
                    modal.classList.add('active');
                }
            });
        });

        // Close modal function
        const closeModal = () => {
            modal.classList.remove('active');
            modalVideo.pause();
            setTimeout(() => {
                modalVideo.src = ""; // Clear source
                modalImage.src = ""; // Clear source
            }, 300); // Wait for fade out
        };

        // Close when clicking the X button
        closeBtn.addEventListener('click', closeModal);

        // Close when clicking outside the media
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

});
