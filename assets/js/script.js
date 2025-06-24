// SCLTRANSFERS - Website JavaScript
// Funcionalidades: Navegación móvil, formulario WhatsApp, animaciones, scroll suave

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contact-form');
    const whatsappFloat = document.getElementById('whatsapp-float');
    const header = document.querySelector('.header');

    // === NAVEGACIÓN MÓVIL ===
    function toggleMobileMenu() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMobileMenu() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event listeners para navegación móvil
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }

    // Cerrar menú al hacer click en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // === HEADER SCROLL EFFECT ===
    function updateHeaderOnScroll() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(26, 47, 69, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'var(--primary-color)';
            header.style.backdropFilter = 'none';
        }
    }

    window.addEventListener('scroll', updateHeaderOnScroll);

    // === SMOOTH SCROLL PARA ENLACES INTERNOS ===
    function setupSmoothScroll() {
        const internalLinks = document.querySelectorAll('a[href^="#"]');
        
        internalLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    closeMobileMenu();
                }
            });
        });
    }

    setupSmoothScroll();

    // === FORMULARIO DE CONTACTO CON WHATSAPP ===
    function setupContactForm() {
        if (!contactForm) return;

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener datos del formulario
            const formData = new FormData(contactForm);
            const name = formData.get('name')?.trim();
            const email = formData.get('email')?.trim();
            const phone = formData.get('phone')?.trim();
            const service = formData.get('service');
            const message = formData.get('message')?.trim();

            // Validación básica
            if (!name || !email || !phone || !service) {
                showNotification('Por favor, complete todos los campos obligatorios.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('Por favor, ingrese un email válido.', 'error');
                return;
            }

            if (!isValidPhone(phone)) {
                showNotification('Por favor, ingrese un teléfono válido.', 'error');
                return;
            }

            // Crear mensaje de WhatsApp
            const whatsappMessage = createWhatsAppMessage(name, email, phone, service, message);
            const whatsappURL = `https://wa.me/56926432934?text=${encodeURIComponent(whatsappMessage)}`;
            
            // Abrir WhatsApp
            window.open(whatsappURL, '_blank');
            
            // Mostrar mensaje de éxito
            showNotification('Redirigiendo a WhatsApp...', 'success');
            
            // Limpiar formulario después de un delay
            setTimeout(() => {
                contactForm.reset();
            }, 1000);
        });
    }

    function createWhatsAppMessage(name, email, phone, service, message) {
        const serviceNames = {
            'aeropuerto': 'Traslado Aeropuerto',
            'tours': 'Tours y Excursiones',
            'ejecutivo': 'Transfer Ejecutivo',
            'otro': 'Otro servicio'
        };

        let whatsappMessage = `🚗 *SOLICITUD DE COTIZACIÓN - SCLTRANSFERS*\n\n`;
        whatsappMessage += `👤 *Nombre:* ${name}\n`;
        whatsappMessage += `📧 *Email:* ${email}\n`;
        whatsappMessage += `📱 *Teléfono:* ${phone}\n`;
        whatsappMessage += `🎯 *Servicio:* ${serviceNames[service] || service}\n`;
        
        if (message) {
            whatsappMessage += `💬 *Mensaje:*\n${message}\n`;
        }
        
        whatsappMessage += `\n📅 *Fecha de solicitud:* ${new Date().toLocaleDateString('es-CL')}\n`;
        whatsappMessage += `⏰ *Hora:* ${new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}`;

        return whatsappMessage;
    }

    // Validaciones
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{8,}$/;
        return phoneRegex.test(phone);
    }

    setupContactForm();

    // === SISTEMA DE NOTIFICACIONES ===
    function showNotification(message, type = 'info') {
        // Remover notificación existente
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Crear nueva notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Estilos inline para la notificación
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            background: type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#007bff',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: '10000',
            maxWidth: '400px',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });

        // Agregar al DOM
        document.body.appendChild(notification);

        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Configurar cierre automático
        const autoCloseTimer = setTimeout(() => {
            closeNotification();
        }, 5000);

        // Configurar cierre manual
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', closeNotification);

        function closeNotification() {
            clearTimeout(autoCloseTimer);
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }

    // === ANIMACIONES DE SCROLL ===
    function setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Elementos a animar
        const animatedElements = document.querySelectorAll(`
            .service-card,
            .gallery-item,
            .contact-item,
            .about-text,
            .about-image,
            .hero-text,
            .hero-image
        `);

        animatedElements.forEach(el => {
            // Configurar estado inicial
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            observer.observe(el);
        });
    }

    // Verificar soporte para IntersectionObserver
    if ('IntersectionObserver' in window) {
        setupScrollAnimations();
    }

    // === WHATSAPP FLOTANTE INTELIGENTE ===
    function setupSmartWhatsAppFloat() {
        if (!whatsappFloat) return;

        let lastScrollY = window.scrollY;
        let isVisible = true;

        function updateWhatsAppFloat() {
            const currentScrollY = window.scrollY;
            const scrollingDown = currentScrollY > lastScrollY;
            const scrollThreshold = 100;

            // Mostrar/ocultar basado en dirección del scroll
            if (scrollingDown && currentScrollY > scrollThreshold && isVisible) {
                whatsappFloat.style.transform = 'scale(0.8)';
                whatsappFloat.style.opacity = '0.7';
                isVisible = false;
            } else if (!scrollingDown && !isVisible) {
                whatsappFloat.style.transform = 'scale(1)';
                whatsappFloat.style.opacity = '1';
                isVisible = true;
            }

            // En la parte superior siempre visible
            if (currentScrollY < scrollThreshold) {
                whatsappFloat.style.transform = 'scale(1)';
                whatsappFloat.style.opacity = '1';
                isVisible = true;
            }

            lastScrollY = currentScrollY;
        }

        // Throttle para optimizar rendimiento
        let ticking = false;
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateWhatsAppFloat);
                ticking = true;
                setTimeout(() => { ticking = false; }, 16); // ~60fps
            }
        }

        window.addEventListener('scroll', requestTick);

        // Efecto hover mejorado
        whatsappFloat.addEventListener('mouseenter', function() {
            this.style.transform = isVisible ? 'scale(1.1)' : 'scale(0.9)';
        });

        whatsappFloat.addEventListener('mouseleave', function() {
            this.style.transform = isVisible ? 'scale(1)' : 'scale(0.8)';
        });
    }

    setupSmartWhatsAppFloat();

    // === LAZY LOADING PARA IMÁGENES ===
    function setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            // Observar imágenes con data-src
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    setupLazyLoading();

    // === UTILIDADES DE RENDIMIENTO ===
    
    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // === MANEJO DE ERRORES ===
    window.addEventListener('error', function(e) {
        console.warn('Error en SCLTRANSFERS:', e.error);
        // En producción, aquí podrías enviar el error a un servicio de logging
    });

    // === ANALYTICS Y TRACKING (Preparado para futuro) ===
    function trackEvent(eventName, eventData = {}) {
        // Preparado para Google Analytics, Facebook Pixel, etc.
        console.log('Event tracked:', eventName, eventData);
        
        // Ejemplo para Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }
    }

    // Tracking de clics en botones WhatsApp
    document.querySelectorAll('a[href*="wa.me"]').forEach(button => {
        button.addEventListener('click', function() {
            const service = this.closest('.service-card')?.querySelector('.service-title')?.textContent || 'General';
            trackEvent('whatsapp_click', {
                service: service,
                button_location: this.id || this.className
            });
        });
    });

    // === INICIALIZACIÓN FINAL ===
    console.log('🚗 SCLTRANSFERS - Website loaded successfully!');
    
    // Pequeña animación de bienvenida
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// === FUNCIONES GLOBALES ===

// Función para abrir WhatsApp con mensaje personalizado
function openWhatsApp(message, phone = '56926432934') {
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Función para scroll suave a elemento
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = element.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// === SERVICE WORKER REGISTRATION (Para futuro PWA) ===
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Preparado para cuando se implemente PWA
        console.log('Service Worker ready for PWA implementation');
    });
}
