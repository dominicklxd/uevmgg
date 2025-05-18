document.addEventListener("DOMContentLoaded", async () => {
    // Verificar si Supabase está disponible
    if (!window.supabase) {
        console.error("Supabase no está definido. Asegúrate de que el script de Supabase se haya cargado correctamente.");
        return;
    }

    const supabaseUrl = "https://zeijayrxciyzymysbyvp.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplaWpheXJ4Y2l5enlteXNieXZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNjYyMjMsImV4cCI6MjA1OTc0MjIyM30.DxT8_5acA88JxhVV7n2UqmrZ_9d0DPABi6eKSO8cpDE";
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    const forms = document.querySelectorAll("form");
    forms.forEach(form => {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Formulario enviado correctamente.");
        });
    });

    const usuarioActivo = localStorage.getItem('usuarioActivo');
    const menu = document.querySelector('.menu');
    const animatedTitle = document.querySelector('.animated-title');
    const animatedLetters = document.querySelectorAll('.animated-title h1 span');
    const animatedParagraph = document.querySelector('.animated-title p');
    const images = document.querySelectorAll(".carousel-images img");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const progressBar = document.querySelector(".progress-bar");
    let currentIndex = 0;
    let interval;

    const toggleMenuAnimation = () => {
        menu.classList.add('menu'); // Aplicar animación de entrada al menú
    };

    const toggleTitleAnimation = () => {
        animatedTitle.classList.add('hidden'); // Aplicar animación de salida al título animado
        setTimeout(() => {
            animatedTitle.classList.remove('hidden'); // Restaurar el título después de la animación
        }, 500); // Duración de la animación
    };

    const resetAnimations = () => {
        // Reiniciar animación del título
        animatedTitle.classList.remove('hidden');
        void animatedTitle.offsetWidth; // Forzar reflujo para reiniciar la animación
        animatedTitle.classList.add('hidden');

        // Reiniciar animación de las letras
        animatedLetters.forEach((letter, index) => {
            letter.style.animation = 'none';
            void letter.offsetWidth; // Forzar reflujo para reiniciar la animación
            letter.style.animation = `letterBounce 0.8s ease-in-out forwards ${index * 0.1}s`; // Coordinación con delay
        });

        // Reiniciar animación del párrafo
        animatedParagraph.style.animation = 'none';
        void animatedParagraph.offsetWidth; // Forzar reflujo para reiniciar la animación
        animatedParagraph.style.animation = 'slideUpFade 1s ease-in-out forwards 1.5s';
    };

    const resetProgressBar = () => {
        progressBar.style.transition = "none"; // Desactivar transición temporalmente
        progressBar.style.width = "0"; // Restablecer el ancho a 0
        setTimeout(() => {
            progressBar.style.transition = "width 5s linear"; // Reactivar transición
            progressBar.style.width = "100%"; // Llenar la barra
        }, 50); // Pequeño retraso para reiniciar la animación
    };

    const updateCarousel = () => {
        images.forEach((img, index) => {
            img.classList.toggle("active", index === currentIndex);
            if (index === currentIndex) {
                img.style.animation = "none"; // Reiniciar animación
                void img.offsetWidth; // Forzar reflujo para reiniciar la animación
                img.style.animation = "noOpacity 2s ease-in-out"; // Aplicar animación
            }
        });
        resetAnimations(); // Reiniciar las animaciones
        toggleMenuAnimation(); // Alternar animación del menú
        toggleTitleAnimation(); // Alternar animación del título animado
        resetProgressBar(); // Restablecer la barra de carga
    };

    const startAutoSlide = () => {
        interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            updateCarousel();
        }, 5000); // Cambiar cada 5 segundos
    };

    const stopAutoSlide = () => {
        clearInterval(interval);
    };

    prevBtn.addEventListener("click", () => {
        stopAutoSlide();
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateCarousel();
        startAutoSlide();
    });

    nextBtn.addEventListener("click", () => {
        stopAutoSlide();
        currentIndex = (currentIndex + 1) % images.length;
        updateCarousel();
        startAutoSlide();
    });

    updateCarousel(); // Inicializar el carrusel
    startAutoSlide(); // Iniciar el cambio automático

    const adminOption = menu.querySelector('a[href="verUsuarios.html"]');
    if (adminOption) {
        adminOption.parentElement.remove();
    }

    if (usuarioActivo) {
        try {
            // Verificar el rol del usuario activo desde la base de datos
            const { data: usuarios, error } = await supabase
                .from('usuarios')
                .select('rol')
                .eq('email', usuarioActivo);    

            if (error) {
                console.error('Error al verificar el rol del usuario:', error.message);
            } else if (usuarios && usuarios.length > 0 && usuarios[0].rol === 'administrador') {
                // Mostrar el menú de administrador si el rol es "administrador"
                if (!menu.querySelector('a[href="verUsuarios.html"]')) {
                    const adminMenuItem = document.createElement('li');
                    adminMenuItem.innerHTML = '<a href="verUsuarios.html">Administración</a>';
                    menu.appendChild(adminMenuItem);
                }
            }
        } catch (err) {
            console.error('Error inesperado al verificar el rol del usuario:', err);
        }
    }

    const authLinks = document.querySelector('.auth-links');
    const adminEmail = localStorage.getItem('adminEmail') || 'admin@ejemplo.com';

    if (authLinks) {
        if (usuarioActivo) {
            authLinks.innerHTML = `
                <a href="matricularse.html">Matricularse</a>
                ${usuarioActivo === adminEmail ? `
                    <div class="dropdown">
                        <a href="#">Administración</a>
                        <ul class="dropdown-menu">
                            <li><a href="verUsuarios.html">Ver Usuarios</a></li>
                            <li><a href="solicitudMatriculacion.html">Solicitudes de Matriculación</a></li>
                        </ul>
                    </div>
                ` : ''}
                <a href="#" id="logout">Cerrar Sesión</a>
            `;
            const logoutBtn = document.getElementById('logout');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    localStorage.removeItem('usuarioActivo');
                    alert('Sesión cerrada exitosamente.');
                    window.location.href = 'index.html';
                });
            }
        } else {
            authLinks.innerHTML = `
                <a href="registro.html">Registrarse</a>
                <a href="login.html">Iniciar Sesión</a>
            `;
        }
    }

    const dropdowns = document.querySelectorAll(".dropdown");
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener("mouseenter", () => {
            const submenu = dropdown.querySelector(".submenu");
            if (submenu) submenu.style.display = "block";
        });
        dropdown.addEventListener("mouseleave", () => {
            const submenu = dropdown.querySelector(".submenu");
            if (submenu) submenu.style.display = "none";
        });
    });

    if (animatedTitle) {
        animatedTitle.style.display = "block"; // Asegurar que esté visible
    }

    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const authLinks = document.querySelector('.auth-links');
    const header = document.querySelector('header');
    const usuarioActivo = localStorage.getItem('usuarioActivo');

    if (authLinks) {
        if (usuarioActivo) {
            authLinks.innerHTML = `
                <a href="matricularse.html">Matricularse</a>
                <a href="#" id="logout">Cerrar Sesión</a>
            `;
            const logoutBtn = document.getElementById('logout');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    localStorage.removeItem('usuarioActivo');
                    alert('Sesión cerrada exitosamente.');
                    window.location.href = 'index.html';
                });
            }
        } else {
            authLinks.innerHTML = `
                <a href="registro.html">Registrarse</a>
                <a href="login.html">Iniciar Sesión</a>
            `;
        }
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});
