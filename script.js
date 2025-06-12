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

    // --- BURBUJA DE ADMINISTRACIÓN FLOTANTE IZQUIERDA (tipo floating-bubbles, pero a la izquierda) ---
    async function renderAdminBubble() {
        const container = document.getElementById('admin-bubble-container');
        if (!container) return;

        container.innerHTML = '';
        // Cambia el left para separar más del margen
        container.style.position = 'fixed';
        container.style.top = '180px';
        container.style.left = '60px'; // Antes: 18px
        container.style.zIndex = '1002';
        container.style.display = 'none';

        const usuarioActivo = localStorage.getItem('usuarioActivo');
        if (!usuarioActivo) return;

        // Consulta a la base de datos para obtener el rol real del usuario activo
        let rol = null;
        try {
            // Buscar el id_cedula correspondiente a la cédula string
            const { data: cedulaObj } = await supabase
                .from('cedulas')
                .select('id_cedula')
                .eq('cedula', usuarioActivo)
                .maybeSingle();

            if (!cedulaObj) return;

            // Buscar usuario por id_cedula (campo cedula en usuarios)
            const { data: usuario } = await supabase
                .from('usuarios')
                .select('rol')
                .eq('cedula', cedulaObj.id_cedula)
                .maybeSingle();

            if (!usuario || !usuario.rol) return;
            rol = usuario.rol.toLowerCase();
        } catch (e) {
            return;
        }

        if (!['rector', 'vicerrector', 'administrador'].includes(rol)) {
            container.style.display = 'none';
            return;
        }

        container.style.display = 'flex';
        container.innerHTML = `
            <div class="floating-bubble admin-bubble" title="Administración" tabindex="0" style="margin-bottom: 0;">
                <img src="icon-admin.png" alt="Administración">
                <span class="floating-bubble-label">Administración</span>
                <div class="admin-bubble-menu">
                    <a href="verUsuarios.html">Usuarios</a>
                    <a href="solicitudMatriculacion.html">Solicitudes de Matriculación</a>
                    <a href="actualizar-datos.html">Actualizar Datos de Estudiantes</a>
                </div>
            </div>
        `;

        // Mostrar menú al pasar mouse o enfocar
        const bubble = container.querySelector('.admin-bubble');
        const menu = container.querySelector('.admin-bubble-menu');
        bubble.addEventListener('mouseenter', () => { menu.style.display = 'flex'; });
        bubble.addEventListener('mouseleave', () => { setTimeout(()=>{menu.style.display='none'}, 200); });
        menu.addEventListener('mouseenter', () => { menu.style.display = 'flex'; });
        menu.addEventListener('mouseleave', () => { menu.style.display = 'none'; });
        bubble.addEventListener('focus', () => { menu.style.display = 'flex'; });
        bubble.addEventListener('blur', () => { menu.style.display = 'none'; });
    }

    // Llama a la función al cargar y cuando cambie el usuario
    window.addEventListener('DOMContentLoaded', function() {
        renderAdminBubble();
    });
    window.addEventListener('storage', function(e) {
        if (e.key === 'usuarioActivo') {
            renderAdminBubble();
        }
    });

    // --- ESTILOS PARA LA BURBUJA DE ADMINISTRACIÓN (tipo floating-bubbles, pero a la izquierda) ---
    if (!document.getElementById('admin-bubble-style')) {
        const styleAdmin = document.createElement('style');
        styleAdmin.id = 'admin-bubble-style';
        styleAdmin.innerHTML = `
            #admin-bubble-container {
                position: fixed;
                top: 180px;
                left: 60px; /* Antes: 18px */
                z-index: 1002;
                display: none;
                flex-direction: column;
                align-items: flex-start;
            }
            .admin-bubble {
                background: linear-gradient(120deg,#2f5597 60%,#548235 100%);
                color: #fff;
                border-radius: 50%;
                width: 54px;
                height: 54px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 18px rgba(44,130,201,0.13);
                cursor: pointer;
                margin-bottom: 0.5em;
                position: relative;
                transition: background 0.2s, transform 0.2s;
                outline: none;
                
            }
            @keyframes floatingBubbleAnim {
                0% { transform: translateY(0) scale(1);}
                50% { transform: translateY(-10px) scale(1.06);}
                100% { transform: translateY(0) scale(1);}
            }
            .admin-bubble img {
                width: 38px;
                height: 38px;
            }
            .admin-bubble:hover, .admin-bubble:focus {
                background: linear-gradient(120deg,#548235 60%,#2f5597 100%);
                transform: scale(1.08);
            }
            .admin-bubble .floating-bubble-label {
                display: none;
                position: absolute;
                left: 60px;
                top: 50%;
                transform: translateY(-50%);
                background: #fff;
                color: #2f5597;
                font-weight: bold;
                font-size: 1.05rem;
                border-radius: 8px;
                padding: 0.4em 1em;
                box-shadow: 0 2px 8px rgba(44,130,201,0.10);
                white-space: nowrap;
                z-index: 10;
            }
            .admin-bubble:hover .floating-bubble-label,
            .admin-bubble:focus .floating-bubble-label {
                display: block;
            }
            .admin-bubble-menu {
                display: none;
                flex-direction: column;
                position: absolute;
                left: 55px;
                top: 0;
                background: #fff;
                border-radius: 12px;
                box-shadow: 0 4px 18px rgba(44,130,201,0.13);
                padding: 0.7em 0.5em;
                min-width: 180px;
                z-index: 1003;
                gap: 0.5em;
                animation: adminBubbleMenuFadeIn 0.18s;
            }
            .admin-bubble-menu a {
                color: #2f5597;
                font-weight: bold;
                font-size: 1.08rem;
                text-decoration: none;
                padding: 0.4em 1em;
                border-radius: 7px;
                transition: background 0.15s, color 0.15s;
                display: block;
            }
            .admin-bubble-menu a:hover {
                background: #eaf2fb;
                color: #548235;
            }
            @keyframes adminBubbleMenuFadeIn {
                from { opacity: 0; transform: translateY(10px);}
                to { opacity: 1; transform: translateY(0);}
            }
            @media (max-width: 900px) {
                #admin-bubble-container { left: 24px; }
                .admin-bubble-menu { left: 58px; min-width: 120px; }
            }
            @media (max-width: 600px) {
                #admin-bubble-container { left: 0; top: 120px; }
                .admin-bubble-menu { left: 54px; }
            }
        `;
        document.head.appendChild(styleAdmin);
    }

    // --- ELIMINAR OPCIÓN DE ADMINISTRACIÓN DEL MENÚ DEL ENCABEZADO ---
    // Usa otro nombre para la variable del menú aquí para evitar el error de declaración duplicada
    const menuHeader = document.querySelector('.menu');
    if (menuHeader) {
        // Busca y elimina cualquier <li> que tenga "Administración"
        Array.from(menuHeader.querySelectorAll('li')).forEach(li => {
            const a = li.querySelector('a');
            if (a && a.textContent.trim().toLowerCase().includes('administración')) {
                li.remove();
            }
        });
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
                            <li><a href="actualizar-datos.html">Actualizar Datos de Estudiantes</a></li>
                        </ul>
                    </div>
                ` : ''}
                <a href="perfil.html">Perfil</a>
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

    // Mostrar enlaces de autenticación en el encabezado, incluyendo "Perfil"
    if (authLinks) {
        if (usuarioActivo) {
            authLinks.innerHTML = `
                <a href="matricularse.html">Matricularse</a>
                <a href="perfil.html">Perfil</a>
                <a href="#" id="logout">Cerrar Sesión</a>
            `;
            document.getElementById('logout').addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('usuarioActivo');
                alert('Sesión cerrada exitosamente.');
                window.location.href = 'index.html';
            });
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

async function borrarEstudiantePorCedula(cedula) {
    // 1. Buscar id_cedula
    const { data: cedulaRow } = await supabase
        .from('cedulas')
        .select('id_cedula')
        .eq('cedula', cedula)
        .maybeSingle();
    if (!cedulaRow) return alert('No se encontró la cédula.');

    const id_cedula = cedulaRow.id_cedula;

    // 2. Buscar estudiante(s) por id_cedula
    const { data: estudiantes } = await supabase
        .from('estudiante')
        .select('id_estudiante, id_inscripcion')
        .eq('id_cedula', id_cedula);

    for (const est of estudiantes) {
        // 3. Eliminar datos relacionados
        await supabase.from('contacto_emergencia_estudiante').delete().eq('id_estudiante', est.id_estudiante);
        await supabase.from('representante_estudiante').delete().eq('id_estudiante', est.id_estudiante);
        await supabase.from('madre_estudiante').delete().eq('id_estudiante', est.id_estudiante);
        await supabase.from('padre_estudiante').delete().eq('id_estudiante', est.id_estudiante);
        await supabase.from('direccion_estudiante').delete().eq('id_estudiante', est.id_estudiante);
        await supabase.from('solicitud_matriculacion').delete().eq('id_estudiante', est.id_estudiante);
        // 4. Eliminar inscripción si existe
        if (est.id_inscripcion) {
            await supabase.from('solicitud_inscripcion').delete().eq('id', est.id_inscripcion);
        }
        // 5. Eliminar estudiante
        await supabase.from('estudiante').delete().eq('id_estudiante', est.id_estudiante);
    }

    // 6. Eliminar la cédula
    await supabase.from('cedulas').delete().eq('id_cedula', id_cedula);

    // 7. Eliminar usuario (si el email es la cédula)
    await supabase.from('usuarios').delete().eq('email', cedula);

    alert('Estudiante y todos sus datos eliminados correctamente.');
}

// Uso:
// await borrarEstudiantePorCedula('1234567890');
// No es necesario modificar nada aquí para el botón de la foto de perfil
