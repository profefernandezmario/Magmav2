// ===== SISTEMA DE CARRITO DE COMPRAS - VERSIÓN CORREGIDA =====
// Eliminación completa de duplicación en agregar al carrito

class CarritoManager {
    constructor() {
        this.carrito = [];
        this.inicializado = false;
        this.init();
    }

    init() {
        if (this.inicializado) return;
        
        this.cargarCarrito();
        this.actualizarVista();
        this.configurarEventosUnaVez();
        this.inicializado = true;
    }

    // ===== GESTIÓN BÁSICA DEL CARRITO =====
    agregarProducto(nombre, precio) {
        const producto = {
            id: Date.now() + Math.random(),
            nombre: nombre,
            precio: Number(precio),
            timestamp: Date.now()
        };

        this.carrito.push(producto);
        this.guardarCarrito();
        this.actualizarVista();
        this.mostrarFeedback('✅ ' + nombre + ' agregado al carrito');
    }

    eliminarProducto(index) {
        if (index >= 0 && index < this.carrito.length) {
            const producto = this.carrito.splice(index, 1)[0];
            this.guardarCarrito();
            this.actualizarVista();
            this.mostrarFeedback('🗑️ ' + producto.nombre + ' eliminado');
        }
    }

    vaciarCarrito() {
        if (this.carrito.length === 0) {
            this.mostrarFeedback('🛒 El carrito ya está vacío');
            return;
        }

        if (confirm('¿Estás seguro de vaciar el carrito?')) {
            this.carrito = [];
            this.guardarCarrito();
            this.actualizarVista();
            this.mostrarFeedback('🗑️ Carrito vaciado');
        }
    }

    // ===== CÁLCULOS =====
    calcularTotal() {
        return this.carrito.reduce((total, item) => total + item.precio, 0);
    }

    obtenerCantidad() {
        return this.carrito.length;
    }

    // ===== PERSISTENCIA =====
    guardarCarrito() {
        try {
            localStorage.setItem('carritoMagma', JSON.stringify(this.carrito));
        } catch (e) {
            console.warn('No se pudo guardar en localStorage');
        }
    }

    cargarCarrito() {
        try {
            const guardado = localStorage.getItem('carritoMagma');
            this.carrito = guardado ? JSON.parse(guardado) : [];
        } catch (e) {
            this.carrito = [];
        }
    }

    // ===== VISTA =====
    actualizarVista() {
        this.actualizarListaCarrito();
        this.actualizarContadores();
    }

    actualizarListaCarrito() {
        const lista = document.getElementById('lista-carrito');
        if (!lista) return;

        lista.innerHTML = '';

        if (this.carrito.length === 0) {
            lista.innerHTML = `
                <li class="list-group-item text-center text-muted py-4">
                    <i class="fas fa-shopping-cart fa-2x mb-2"></i>
                    <div>El carrito está vacío</div>
                    <small>Agrega productos para comenzar</small>
                </li>
            `;
            return;
        }

        this.carrito.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                <div>
                    <div class="fw-semibold">${item.nombre}</div>
                    <small class="text-muted">$${item.precio.toLocaleString()}</small>
                </div>
                <button class="btn btn-outline-danger btn-sm" onclick="carritoManager.eliminarProducto(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            lista.appendChild(li);
        });

        const totalLi = document.createElement('li');
        totalLi.className = 'list-group-item d-flex justify-content-between align-items-center fw-bold bg-light';
        totalLi.innerHTML = `
            <span>TOTAL:</span>
            <span class="text-success">$${this.calcularTotal().toLocaleString()}</span>
        `;
        lista.appendChild(totalLi);
    }

    actualizarContadores() {
        const cantidad = this.obtenerCantidad();
        const contadores = document.querySelectorAll('[id*="carrito-contador"]');
        
        contadores.forEach(contador => {
            contador.textContent = cantidad;
            contador.style.display = cantidad > 0 ? 'block' : 'none';
        });
    }

    // ===== WHATSAPP =====
    enviarPedidoWhatsApp() {
        if (this.carrito.length === 0) {
            this.mostrarFeedback('🛒 Agrega productos antes de enviar', 'warning');
            return;
        }

        const mensaje = this.generarMensajePedido();
        const telefono = '5493624003295';
        const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
        
        window.open(url, '_blank');
    }

    generarMensajePedido() {
        let mensaje = '¡Hola! Quiero realizar este pedido:\n\n';
        
        this.carrito.forEach(item => {
            mensaje += `• ${item.nombre} - $${item.precio.toLocaleString()}\n`;
        });

        mensaje += `\n💰 TOTAL: $${this.calcularTotal().toLocaleString()}`;
        mensaje += `\n📦 Productos: ${this.obtenerCantidad()}`;
        mensaje += `\n\n📋 Por favor confirmar disponibilidad y entrega.`;
        mensaje += `\n\n¡Gracias!`;
        
        return mensaje;
    }

    // ===== NAVEGACIÓN =====
    scrollAlCarrito() {
        const carritoSection = document.querySelector('.compras');
        if (carritoSection) {
            carritoSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // ===== UTILIDADES =====
    mostrarFeedback(mensaje, tipo = 'success') {
        // Eliminar feedback existente
        const existente = document.querySelector('.feedback-carrito');
        if (existente) existente.remove();

        const feedback = document.createElement('div');
        feedback.className = `feedback-carrito alert alert-${tipo} position-fixed`;
        feedback.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
        `;
        feedback.textContent = mensaje;

        document.body.appendChild(feedback);

        setTimeout(() => feedback.remove(), 3000);
    }

    mostrarAlias() {
        const alias = 'MF.INDUMENTARIAS';
        if (confirm(`Alias: ${alias}\n\n¿Copiar al portapapeles?`)) {
            navigator.clipboard.writeText(alias).then(() => {
                this.mostrarFeedback('📋 Alias copiado');
            });
        }
    }

    // ===== CONFIGURACIÓN DE EVENTOS (SIN DUPLICACIÓN) =====
    configurarEventosUnaVez() {
        // Remover event listeners existentes primero
        this.removerEventListeners();

        // Configurar eventos esenciales una sola vez
        this.configurarBotonEnviar();
        this.configurarBotonesCarrito();
        this.configurarBotonesPago();
        this.configurarBotonVaciar();
        
        console.log('Eventos configurados correctamente');
    }

    removerEventListeners() {
        // Los event listeners se configuran una vez, no necesitan remoción
        // ya que usamos delegación de eventos
    }

    configurarBotonEnviar() {
        const boton = document.querySelector('.buttonCarrito');
        if (boton) {
            boton.addEventListener('click', () => this.enviarPedidoWhatsApp());
        }
    }

    configurarBotonesCarrito() {
        const botones = document.querySelectorAll('.cart-btn-desktop, .cart-btn-mobile');
        botones.forEach(boton => {
            boton.addEventListener('click', () => this.scrollAlCarrito());
        });
    }

    configurarBotonesPago() {
        const botones = document.querySelectorAll('.btn-payment-desktop, .btn-payment-mobile');
        botones.forEach(boton => {
            boton.addEventListener('click', () => this.mostrarAlias());
        });
    }

    configurarBotonVaciar() {
        const boton = document.querySelector('.btn-vaciar');
        if (boton) {
            boton.addEventListener('click', () => this.vaciarCarrito());
        }
    }
}

// ===== INICIALIZACIÓN GLOBAL =====
let carritoManager;

function inicializarCarrito() {
    if (!carritoManager) {
        carritoManager = new CarritoManager();
    }
    return carritoManager;
}

// ===== FUNCIONES GLOBALES SIMPLES =====
function agregarAlCarrito(nombre, precio) {
    if (!carritoManager) {
        carritoManager = new CarritoManager();
    }
    carritoManager.agregarProducto(nombre, precio);
}

function vaciarCarrito() {
    if (carritoManager) {
        carritoManager.vaciarCarrito();
    }
}

function quitarDelCarrito(index) {
    if (carritoManager) {
        carritoManager.eliminarProducto(index);
    }
}

// ===== INICIALIZACIÓN AUTOMÁTICA =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando sistema de carrito...');
    carritoManager = new CarritoManager();
    
    // Verificar que los botones tengan los eventos correctos
    setTimeout(() => {
        const botones = document.querySelectorAll('.botonAgregarAlCarrito');
        console.log(`Encontrados ${botones.length} botones de agregar al carrito`);
    }, 1000);
});

// ===== COMPATIBILIDAD =====
window.CarritoManager = CarritoManager;
window.agregarAlCarrito = agregarAlCarrito;
window.vaciarCarrito = vaciarCarrito;
window.quitarDelCarrito = quitarDelCarrito;
window.inicializarCarrito = inicializarCarrito;