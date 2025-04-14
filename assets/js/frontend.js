/**
 * OFFERS CAROUSEL - FRONTEND JS
 * Complete Implementation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Select all carousel instances on page
    const carousels = document.querySelectorAll('.oc-carousel-wrapper');
    
    // Initialize each carousel
    carousels.forEach(carousel => {
        // DOM Elements
        const container = carousel.querySelector('.oc-carousel-container');
        const slides = Array.from(carousel.querySelectorAll('.oc-slide'));
        const prevBtn = carousel.querySelector('.oc-carousel-nav.prev');
        const nextBtn = carousel.querySelector('.oc-carousel-nav.next');
        const dots = Array.from(carousel.querySelectorAll('.oc-carousel-dot'));
        
        // Configuration from data attributes
        const config = {
            slidesPerView: parseInt(carousel.dataset.slidesPerView) || 3,
            autoplay: carousel.dataset.autoplay === 'true',
            autoplayDelay: parseInt(carousel.dataset.autoplayDelay) || 3000
        };
        
        // State management
        const state = {
            currentIndex: 0,
            autoplayInterval: null,
            isMobile: window.innerWidth < 768
        };

        // Layout Calculators
        const getDesktopLayout = (offset) => {
            const absOffset = Math.abs(offset);
            
            if (offset === 0) {
                return {
                    transform: 'translateX(0) scale(1)',
                    opacity: 1,
                    zIndex: 3,
                    class: 'active'
                };
            }
            else if (offset === -1) {
                return {
                    transform: 'rotateY(30deg) translateX(40%) scale(0.9)',
                    opacity: 0.8,
                    zIndex: 1,
                    class: 'prev'
                };
            }
            else if (offset === 1) {
                return {
                    transform: 'rotateY(-30deg) translateX(-40%) scale(0.9)',
                    opacity: 0.8,
                    zIndex: 1,
                    class: 'next'
                };
            }
            else {
                return {
                    transform: '',
                    opacity: 0,
                    zIndex: 0
                };
            }
        };

        const getMobileLayout = (offset) => {
            const absOffset = Math.abs(offset);
            
            if (offset === 0) {
                return {
                    transform: 'translateX(0%) scale(1)',
                    opacity: 1,
                    zIndex: 3,
                    class: 'active'
                };
            }
            else if (offset === -1) {
                return {
                    transform: 'translateX(-60%) scale(0.8)',
                    opacity: 0.5,
                    zIndex: 1,
                    class: 'prev'
                };
            }
            else if (offset === 1) {
                return {
                    transform: 'translateX(60%) scale(0.8)',
                    opacity: 0.5,
                    zIndex: 1,
                    class: 'next'
                };
            }
            else {
                return {
                    transform: '',
                    opacity: 0,
                    zIndex: 0
                };
            }
        };

        // Navigation Controls
        const navigate = (direction) => {
            goToSlide(state.currentIndex + direction);
        };

        const goToSlide = (index) => {
            state.currentIndex = (index + slides.length) % slides.length;
            updateCarousel();
        };

        const updatePagination = () => {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === state.currentIndex);
            });
        };

        // Autoplay Functions
        const startAutoplay = () => {
            stopAutoplay();
            state.autoplayInterval = setInterval(() => {
                navigate(1);
            }, config.autoplayDelay);
        };

        const stopAutoplay = () => {
            if (state.autoplayInterval) {
                clearInterval(state.autoplayInterval);
                state.autoplayInterval = null;
            }
        };

        // Responsive Handling
        const handleResize = () => {
            const newIsMobile = window.innerWidth < 768;
            if (newIsMobile !== state.isMobile) {
                state.isMobile = newIsMobile;
                updateCarousel();
            }
        };

        // Touch Event Handling
        const setupTouchEvents = () => {
            let touchStartX = 0;
            let touchEndX = 0;

            container.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            container.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });

            const handleSwipe = () => {
                const swipeThreshold = 50;
                const swipeDistance = touchEndX - touchStartX;

                if (swipeDistance > swipeThreshold) {
                    navigate(-1);
                } else if (swipeDistance < -swipeThreshold) {
                    navigate(1);
                }
            };
        };

        // Core Functions
        const updateCarousel = () => {
            const layoutTransform = state.isMobile ? getMobileLayout : getDesktopLayout;
            
            slides.forEach((slide, index) => {
                const offset = index - state.currentIndex;
                const position = layoutTransform(offset);
                
                slide.classList.remove('active', 'prev', 'next');
                slide.style.transform = position.transform;
                slide.style.opacity = position.opacity;
                slide.style.zIndex = position.zIndex;
                
                if (position.class) {
                    slide.classList.add(position.class);
                }
            });
            
            updatePagination();
        };

        const setupEventListeners = () => {
            if (prevBtn) prevBtn.addEventListener('click', () => navigate(-1));
            if (nextBtn) nextBtn.addEventListener('click', () => navigate(1));
            
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => goToSlide(index));
            });
            
            if (config.autoplay) {
                carousel.addEventListener('mouseenter', stopAutoplay);
                carousel.addEventListener('mouseleave', startAutoplay);
            }
            
            window.addEventListener('resize', handleResize);
        };

        const initCarousel = () => {
            updateCarousel();
            setupEventListeners();
            setupTouchEvents();
            
            if (config.autoplay) {
                startAutoplay();
            }
        };

        // Initialize
        initCarousel();
    });
});