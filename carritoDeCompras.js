let carrito = [];

function agregarAlCarrito(nombre, precio) {
    carrito.push({ nombre, precio });
    mostrarCarrito();
    actualizarContadorCarrito();
}

function mostrarCarrito() {
    const lista = document.getElementById('lista-carrito');
    lista.innerHTML = '';

    if (carrito.length === 0) {
        lista.innerHTML = '<li class="list-group-item text-center text-muted">El carrito está vacío</li>';
        return;
    }

    let total = 0;
    carrito.forEach((item, i) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
      <span>${item.nombre} - $${item.precio}</span>
      <button class="btn btn-danger btn-sm" onclick="quitarDelCarrito(${i})">
        <i class="bi bi-trash"></i> Quitar
      </button>
    `;
        lista.appendChild(li);
        total += item.precio;
    });

    // Agregar total
    const totalLi = document.createElement('li');
    totalLi.className = 'list-group-item d-flex justify-content-between align-items-center fw-bold';
    totalLi.innerHTML = `<span>TOTAL:</span><span>$${total}</span>`;
    lista.appendChild(totalLi);
}

function actualizarContadorCarrito() {
    const contador = document.getElementById('carrito-contador');
    if (contador) {
        contador.textContent = carrito.length;
    }
}

function quitarDelCarrito(indice) {
    carrito.splice(indice, 1);
    mostrarCarrito();
    actualizarContadorCarrito();
}

function vaciarCarrito() {
    if (carrito.length === 0) {
        alert('¡El carrito ya está vacío!');
        return;
    }

    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        carrito = [];
        mostrarCarrito();
        actualizarContadorCarrito();
        alert('Carrito vaciado');
    }
}

function enviarPorWhatsApp() {
    if (carrito.length === 0) {
        alert('¡El carrito está vacío! Agrega algunos productos antes de enviar el pedido.');
        return;
    }

    let mensaje = '¡Hola! Quiero realizar el siguiente pedido:\n\n';
    let total = 0;

    carrito.forEach(item => {
        mensaje += `• ${item.nombre} - $${item.precio}\n`;
        total += item.precio;
    });

    mensaje += `\n💰 TOTAL: $${total}`;
    mensaje += `\n\n📦 Por favor, confirmen disponibilidad y forma de entrega.`;
    mensaje += `\n\n¡Gracias!`;

    const telefono = '5493624003295';
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

    // Vaciar carrito después de enviar
    carrito = [];
    mostrarCarrito();
    actualizarContadorCarrito();

    // Abrir WhatsApp
    window.open(url, '_blank');
}

// Conectar el botón bonito de enviar pedido
document.addEventListener('DOMContentLoaded', function () {
    const botonEnviar = document.querySelector('.buttonCarrito');
    if (botonEnviar) {
        botonEnviar.addEventListener('click', enviarPorWhatsApp);
    }

    // Inicializar carrito
    mostrarCarrito();
    actualizarContadorCarrito();
});

// Añadir al final del archivo carritoDeCompras.js

// Mejorar la experiencia del carrito en móviles
function toggleCarrito() {
  const carritoSection = document.querySelector('.compras');
  if (carritoSection) {
    carritoSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// Conectar el botón del carrito para mostrar/ocultar
document.addEventListener('DOMContentLoaded', function () {
  const botonEnviar = document.querySelector('.buttonCarrito');
  const botonCarrito = document.querySelector('.cart-btn');
  
  if (botonEnviar) {
    botonEnviar.addEventListener('click', enviarPorWhatsApp);
  }
  
  if (botonCarrito) {
    botonCarrito.addEventListener('click', toggleCarrito);
  }

  // Inicializar carrito
  mostrarCarrito();
  actualizarContadorCarrito();
  
  // Añadir tooltips para móviles
  const contactButtons = document.querySelectorAll('.contact-btn');
  contactButtons.forEach(btn => {
    btn.addEventListener('touchstart', function() {
      // Mostrar tooltip en dispositivos táctiles
      const title = this.getAttribute('title');
      if (title && window.innerWidth < 768) {
        // Podrías implementar un tooltip personalizado aquí si es necesario
        console.log(title); // Para debugging
      }
    });
  });
});

// Añadir al final del archivo carritoDeCompras.js

// Función para mostrar el carrito con scroll suave
function mostrarCarritoConScroll() {
  const carritoSection = document.querySelector('.compras');
  if (carritoSection) {
    // Cerrar tooltips activos
    document.querySelectorAll('.contact-btn::after, .cart-btn::after').forEach(tooltip => {
      tooltip.style.opacity = '0';
      tooltip.style.visibility = 'hidden';
    });
    
    // Scroll suave al carrito
    carritoSection.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
    
    // Efecto visual de highlight
    carritoSection.style.transition = 'all 0.3s ease';
    carritoSection.style.boxShadow = '0 0 0 3px rgba(13, 110, 253, 0.3)';
    carritoSection.style.backgroundColor = '#f8f9fa';
    
    setTimeout(() => {
      carritoSection.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
      carritoSection.style.backgroundColor = 'white';
    }, 1500);
  }
}

// Tooltips para móviles con mejor UX
function setupMobileTooltips() {
  const buttons = document.querySelectorAll('.contact-btn, .cart-btn');
  
  buttons.forEach(btn => {
    let tooltipTimer;
    
    btn.addEventListener('touchstart', function(e) {
      e.preventDefault();
      const title = this.getAttribute('title');
      
      if (title && window.innerWidth < 768) {
        // Crear tooltip temporal
        const existingTooltip = document.querySelector('.mobile-tooltip');
        if (existingTooltip) {
          document.body.removeChild(existingTooltip);
        }
        
        const tooltip = document.createElement('div');
        tooltip.className = 'mobile-tooltip';
        tooltip.textContent = title;
        tooltip.style.cssText = `
          position: fixed;
          bottom: 70px;
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
          animation: fadeIn 0.2s ease;
        `;
        
        document.body.appendChild(tooltip);
        
        // Remover después de 1.5 segundos
        tooltipTimer = setTimeout(() => {
          if (document.body.contains(tooltip)) {
            tooltip.style.animation = 'fadeOut 0.2s ease';
            setTimeout(() => {
              if (document.body.contains(tooltip)) {
                document.body.removeChild(tooltip);
              }
            }, 200);
          }
        }, 1500);
      }
    });
    
    btn.addEventListener('touchend', function() {
      clearTimeout(tooltipTimer);
      const tooltips = document.querySelectorAll('.mobile-tooltip');
      tooltips.forEach(tooltip => {
        if (document.body.contains(tooltip)) {
          tooltip.style.animation = 'fadeOut 0.2s ease';
          setTimeout(() => {
            if (document.body.contains(tooltip)) {
              document.body.removeChild(tooltip);
            }
          }, 200);
        }
      });
    });
  });
}

// Añadir estilos CSS para las animaciones
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateX(-50%) translateY(10px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; transform: translateX(-50%) translateY(0); }
    to { opacity: 0; transform: translateX(-50%) translateY(10px); }
  }
`;
document.head.appendChild(style);

// Inicialización mejorada
document.addEventListener('DOMContentLoaded', function () {
  const botonEnviar = document.querySelector('.buttonCarrito');
  const botonCarrito = document.querySelector('.cart-btn');
  
  if (botonEnviar) {
    botonEnviar.addEventListener('click', enviarPorWhatsApp);
  }
  
  if (botonCarrito) {
    botonCarrito.addEventListener('click', mostrarCarritoConScroll);
  }

  // Inicializar carrito
  mostrarCarrito();
  actualizarContadorCarrito();
  
  // Configurar tooltips para móviles
  if (window.innerWidth < 768) {
    setupMobileTooltips();
  }
  
  // Reconfigurar en redimensionamiento
  window.addEventListener('resize', function() {
    if (window.innerWidth < 768) {
      setupMobileTooltips();
    }
  });
});