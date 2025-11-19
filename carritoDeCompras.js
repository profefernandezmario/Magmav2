// ===== SISTEMA DE CARRITO DE COMPRAS - MAGMA FIT HOUSE =====
// Versión completamente rediseñada - Responsive y optimizada

class CarritoManager {
    constructor() {
        this.carrito = this.obtenerCarritoLocalStorage();
        this.init();
    }

    // Inicializar el sistema
    init() {
        this.configurarEventListeners();
        this.actualizarVistaCarrito();
        this.actualizarContadores();
        this.configurarTooltipsMoviles();
    }

    // ===== GESTIÓN DEL CARRITO =====

    // Agregar producto al carrito
    agregarProducto(nombre, precio) {
        const producto = {
            id: this.generarIdUnico(),
            nombre: nombre,
            precio: precio,
            cantidad: 1,
            fechaAgregado: new Date().toISOString()
        };

        this.carrito.push(producto);
        this.guardarCarritoLocalStorage();
        this.actualizarVistaCarrito();
        this.actualizarContadores();
        this.mostrarNotificacion('✅ Producto agregado al carrito');
    }

    // Quitar producto del carrito
    quitarProducto(indice) {
        if (indice >= 0 && indice < this.carrito.length) {
            const productoEliminado = this.carrito.splice(indice, 1)[0];
            this.guardarCarritoLocalStorage();
            this.actualizarVistaCarrito();
            this.actualizarContadores();
            this.mostrarNotificacion('🗑️ Producto eliminado del carrito');
        }
    }

    // Vaciar todo el carrito
    vaciarCarrito() {
        if (this.carrito.length === 0) {
            this.mostrarNotificacion('🛒 El carrito ya está vacío');
            return;
        }

        if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
            this.carrito = [];
            this.guardarCarritoLocalStorage();
            this.actualizarVistaCarrito();
            this.actualizarContadores();
            this.mostrarNotificacion('🗑️ Carrito vaciado');
        }
    }

    // ===== CÁLCULOS Y ESTADÍSTICAS =====

    // Calcular total del carrito
    calcularTotal() {
        return this.carrito.reduce((total, producto) => total + producto.precio, 0);
    }

    // Calcular cantidad total de productos
    calcularCantidadTotal() {
        return this.carrito.length;
    }

    // Obtener resumen del carrito
    obtenerResumenCarrito() {
        return {
            totalProductos: this.calcularCantidadTotal(),
            totalPrecio: this.calcularTotal(),
            productos: this.carrito
        };
    }

    // ===== VISTA Y UI =====

    // Actualizar la vista del carrito
    actualizarVistaCarrito() {
        const listaCarrito = document.getElementById('lista-carrito');
        if (!listaCarrito) return;

        listaCarrito.innerHTML = '';

        if (this.carrito.length === 0) {
            listaCarrito.innerHTML = `
                <li class="list-group-item text-center text-muted py-4">
                    <i class="fas fa-shopping-cart fa-2x mb-2 d-block"></i>
                    <span>El carrito está vacío</span>
                    <br>
                    <small class="text-muted">Agrega algunos productos para comenzar</small>
                </li>
            `;
            return;
        }

        // Mostrar productos
        this.carrito.forEach((producto, indice) => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                <div class="producto-info">
                    <div class="fw-semibold">${producto.nombre}</div>
                    <small class="text-muted">$${producto.precio.toLocaleString('es-AR')}</small>
                </div>
                <button class="btn btn-outline-danger btn-sm quitar-producto" data-indice="${indice}">
                    <i class="fas fa-trash"></i>
                    <span class="d-none d-sm-inline"> Quitar</span>
                </button>
            `;
            listaCarrito.appendChild(li);
        });

        // Mostrar total
        const totalLi = document.createElement('li');
        totalLi.className = 'list-group-item d-flex justify-content-between align-items-center fw-bold bg-light';
        totalLi.innerHTML = `
            <span>TOTAL:</span>
            <span class="text-success">$${this.calcularTotal().toLocaleString('es-AR')}</span>
        `;
        listaCarrito.appendChild(totalLi);

        // Configurar eventos de los botones de quitar
        this.configurarBotonesQuitar();
    }

    // Actualizar contadores en el header
    actualizarContadores() {
        const contadores = [
            'carrito-contador-desktop',
            'carrito-contador-mobile'
        ];

        contadores.forEach(id => {
            const contador = document.getElementById(id);
            if (contador) {
                const cantidad = this.calcularCantidadTotal();
                contador.textContent = cantidad;
                
                // Mostrar/ocultar badge según cantidad
                if (cantidad === 0) {
                    contador.style.display = 'none';
                } else {
                    contador.style.display = 'block';
                }
            }
        });
    }

    // ===== ENVÍO DE PEDIDOS =====

    // Enviar pedido por WhatsApp
    async enviarPedidoWhatsApp() {
        if (this.carrito.length === 0) {
            this.mostrarNotificacion('🛒 El carrito está vacío', 'warning');
            return;
        }

        try {
            const resumen = this.obtenerResumenCarrito();
            const mensaje = this.generarMensajeWhatsApp(resumen);
            const telefono = '5493624003295';
            const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
            
            // Abrir WhatsApp
            window.open(url, '_blank');
            
            // Opcional: vaciar carrito después de enviar
            // this.vaciarCarrito();
            
        } catch (error) {
            console.error('Error al enviar pedido:', error);
            this.mostrarNotificacion('❌ Error al enviar el pedido', 'error');
        }
    }

    // Generar mensaje para WhatsApp
    generarMensajeWhatsApp(resumen) {
        let mensaje = '¡Hola! Quiero realizar el siguiente pedido:\n\n';
        
        // Productos
        resumen.productos.forEach((producto, index) => {
            mensaje += `▫️ ${producto.nombre} - $${producto.precio.toLocaleString('es-AR')}\n`;
        });

        // Totales
        mensaje += `\n💰 *TOTAL: $${resumen.totalPrecio.toLocaleString('es-AR')}*`;
        mensaje += `\n📦 Total de productos: ${resumen.totalProductos}`;
        
        // Información adicional
        mensaje += `\n\n📋 Por favor, confirmen disponibilidad y forma de entrega.`;
        mensaje += `\n📍 Preferencia de entrega: ________`;
        mensaje += `\n\n¡Gracias! 🛍️`;
        
        return mensaje;
    }

    // ===== NAVEGACIÓN Y UX =====

    // Navegar al carrito
    navegarAlCarrito() {
        const seccionCarrito = document.querySelector('.compras');
        if (seccionCarrito) {
            // Efecto visual antes del scroll
            seccionCarrito.style.transition = 'all 0.3s ease';
            seccionCarrito.style.boxShadow = '0 0 0 3px rgba(13, 110, 253, 0.3)';
            
            // Scroll suave
            seccionCarrito.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });

            // Remover efecto después de un tiempo
            setTimeout(() => {
                seccionCarrito.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            }, 1500);
        }
    }

    // Mostrar información de pago
    mostrarInfoPago() {
        const mensaje = `
Alias para transferencias: *MF.INDUMENTARIAS*
Titular: Mario R. Fernández
Banco: Lemon

💡 Podés copiar el alias haciendo clic en "Copiar"
        `;

        if (window.confirm(mensaje + '\n\n¿Querés copiar el alias al portapapeles?')) {
            this.copiarAlPortapapeles('MF.INDUMENTARIAS');
        }
    }

    // ===== HERRAMIENTAS Y UTILIDADES =====

    // Copiar texto al portapapeles
    async copiarAlPortapapeles(texto) {
        try {
            await navigator.clipboard.writeText(texto);
            this.mostrarNotificacion('📋 Alias copiado: MF.INDUMENTARIAS');
        } catch (err) {
            // Fallback para navegadores antiguos
            const textarea = document.createElement('textarea');
            textarea.value = texto;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.mostrarNotificacion('📋 Alias copiado: MF.INDUMENTARIAS');
        }
    }

    // Mostrar notificaciones
    mostrarNotificacion(mensaje, tipo = 'success') {
        // Crear notificación
        const notificacion = document.createElement('div');
        notificacion.className = `alert alert-${tipo === 'error' ? 'danger' : tipo} alert-dismissible fade show position-fixed`;
        notificacion.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        notificacion.innerHTML = `
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(notificacion);

        // Auto-remover después de 3 segundos
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.remove();
            }
        }, 3000);
    }

    // Generar ID único para productos
    generarIdUnico() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // ===== LOCAL STORAGE =====

    // Guardar carrito en localStorage
    guardarCarritoLocalStorage() {
        try {
            localStorage.setItem('magmaCarrito', JSON.stringify(this.carrito));
        } catch (error) {
            console.warn('No se pudo guardar el carrito en localStorage:', error);
        }
    }

    // Obtener carrito desde localStorage
    obtenerCarritoLocalStorage() {
        try {
            const carritoGuardado = localStorage.getItem('magmaCarrito');
            return carritoGuardado ? JSON.parse(carritoGuardado) : [];
        } catch (error) {
            console.warn('No se pudo cargar el carrito desde localStorage:', error);
            return [];
        }
    }

    // ===== CONFIGURACIÓN DE EVENTOS =====

    // Configurar todos los event listeners
    configurarEventListeners() {
        // Botón enviar pedido
        const botonEnviar = document.querySelector('.buttonCarrito');
        if (botonEnviar) {
            botonEnviar.addEventListener('click', () => this.enviarPedidoWhatsApp());
        }

        // Botones del carrito (ambas versiones)
        const botonesCarrito = document.querySelectorAll('.cart-btn-desktop, .cart-btn-mobile');
        botonesCarrito.forEach(boton => {
            boton.addEventListener('click', () => this.navegarAlCarrito());
        });

        // Botones de pago
        const botonesPago = document.querySelectorAll('.btn-payment-desktop, .btn-payment-mobile');
        botonesPago.forEach(boton => {
            boton.addEventListener('click', () => this.mostrarInfoPago());
        });

        // Botón vaciar carrito
        const botonVaciar = document.querySelector('.btn-vaciar');
        if (botonVaciar) {
            botonVaciar.addEventListener('click', () => this.vaciarCarrito());
        }

        // Eventos globales
        document.addEventListener('click', (e) => {
            // Delegación de eventos para botones "Agregar al carrito"
            if (e.target.closest('.botonAgregarAlCarrito')) {
                const boton = e.target.closest('.botonAgregarAlCarrito');
                const nombre = boton.getAttribute('data-nombre') || 
                             boton.closest('.card')?.querySelector('.card-title')?.textContent || 
                             'Producto';
                const precio = parseInt(boton.getAttribute('data-precio')) || 0;
                
                if (precio > 0) {
                    this.agregarProducto(nombre, precio);
                }
            }
        });

        // Prevenir envío de formularios
        document.addEventListener('submit', (e) => e.preventDefault());
    }

    // Configurar botones de quitar productos
    configurarBotonesQuitar() {
        const botonesQuitar = document.querySelectorAll('.quitar-producto');
        botonesQuitar.forEach(boton => {
            boton.addEventListener('click', (e) => {
                const indice = parseInt(e.target.closest('.quitar-producto').getAttribute('data-indice'));
                this.quitarProducto(indice);
            });
        });
    }

    // Configurar tooltips para móviles
    configurarTooltipsMoviles() {
        if (window.innerWidth < 992) {
            const botones = document.querySelectorAll('.contact-btn-mobile, .cart-btn-mobile');
            
            botones.forEach(boton => {
                let tooltipTimer;
                
                boton.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    const titulo = boton.getAttribute('title');
                    
                    if (titulo) {
                        // Remover tooltip existente
                        const tooltipExistente = document.querySelector('.mobile-tooltip');
                        if (tooltipExistente) {
                            tooltipExistente.remove();
                        }
                        
                        // Crear nuevo tooltip
                        const tooltip = document.createElement('div');
                        tooltip.className = 'mobile-tooltip';
                        tooltip.textContent = titulo;
                        tooltip.style.cssText = `
                            position: fixed;
                            bottom: 80px;
                            left: 50%;
                            transform: translateX(-50%);
                            background: rgba(0, 0, 0, 0.9);
                            color: white;
                            padding: 8px 12px;
                            border-radius: 6px;
                            font-size: 0.8rem;
                            white-space: nowrap;
                            z-index: 9999;
                            pointer-events: none;
                        `;
                        
                        document.body.appendChild(tooltip);
                        
                        // Auto-remover
                        tooltipTimer = setTimeout(() => {
                            if (tooltip.parentNode) {
                                tooltip.remove();
                            }
                        }, 2000);
                    }
                });
                
                boton.addEventListener('touchend', () => {
                    clearTimeout(tooltipTimer);
                    const tooltips = document.querySelectorAll('.mobile-tooltip');
                    tooltips.forEach(tooltip => tooltip.remove());
                });
            });
        }
    }

    // ===== MÉTODOS PÚBLICOS PARA HTML =====

    // Método para usar desde onclick en HTML
    agregarAlCarrito(nombre, precio) {
        this.agregarProducto(nombre, precio);
    }
}

// ===== INICIALIZACIÓN =====

// Crear instancia global
let carritoManager;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    carritoManager = new CarritoManager();
    
    // Configurar botones existentes en el HTML
    document.querySelectorAll('.botonAgregarAlCarrito').forEach(boton => {
        const nombre = boton.getAttribute('onclick')?.match(/'([^']+)'/)?.[1] || 'Producto';
        const precio = parseInt(boton.getAttribute('onclick')?.match(/, (\d+)\)/)?.[1] || 0);
        
        if (nombre && precio) {
            boton.setAttribute('data-nombre', nombre);
            boton.setAttribute('data-precio', precio);
        }
    });
});

// ===== FUNCIONES GLOBALES PARA BACKWARD COMPATIBILITY =====

// Mantener compatibilidad con código existente
function agregarAlCarrito(nombre, precio) {
    if (carritoManager) {
        carritoManager.agregarAlCarrito(nombre, precio);
    }
}

function vaciarCarrito() {
    if (carritoManager) {
        carritoManager.vaciarCarrito();
    }
}

function quitarDelCarrito(indice) {
    if (carritoManager) {
        carritoManager.quitarProducto(indice);
    }
}

// Exportar para uso global (si es necesario)
window.CarritoManager = CarritoManager;
window.agregarAlCarrito = agregarAlCarrito;
window.vaciarCarrito = vaciarCarrito;
window.quitarDelCarrito = quitarDelCarrito;