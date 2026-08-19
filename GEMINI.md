# Piggy App — Landing Page: Directrices y Buenas Prácticas

Este documento define los estándares técnicos, directrices de arquitectura, diseño UI/UX, rendimiento, SEO, flujo de sincronización mediante MCP y control de versiones para el desarrollo y mantenimiento de la Landing Page de **Piggy App**.

---

## 1. Stack Tecnológico y Arquitectura

* **Build Tool:** Vite 5+ (ES Modules, HMR ultra rápido, optimización en producción).
* **Estructura:**
  * `index.html`: Punto de entrada semántico, estructurado y optimizado para SEO/A11y.
  * `style.css` y `css/`: Estilos modulares con tokens CSS (variables nativas), arquitectura Mobile-First.
  * `main.js`: Lógica interactiva con Vanilla JS y API nativa de `IntersectionObserver`.
  * `public/assets/`: Recursos estáticos optimizados (imágenes comprimidas en WebP/PNG/SVG).
* **Despliegue y CI/CD:** Despliegue continuo en Vercel conectado a la rama `main` del repositorio `amsterdamlab/piggy-landing`.

---

## 2. Buenas Prácticas de Frontend

### A. HTML Semántico y Accesibilidad (A11y)
1. **Estructura:** Utilizar siempre las etiquetas semánticas (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
2. **Atributos ARIA:**
   * Todos los botones interactivos sin texto visible deben incluir `aria-label` descriptivo.
   * Elementos colapsables (menú móvil, acordeones FAQ) deben gestionar dinámicamente `aria-expanded="true|false"`.
3. **Imágenes:** Todo elemento `<img>` debe contar con un atributo `alt` significativo y dimensiones explícitas cuando aplique para evitar Cumulative Layout Shift (CLS).

### B. Estilos y Diseño (CSS)
1. **Variables y Tokens:** Mantener la paleta de colores y espaciados centralizados en `:root` (ej. `#E91E63`, tonos corporativos de Piggy App, tipografías *Outfit* para títulos e *Inter* para cuerpo de texto).
2. **Diseño Adaptativo (Mobile-First):**
   * Todo componente nuevo debe verse óptimo primero en pantallas móviles (`< 768px`) y escalar fluidamente a tablet (`768px - 1024px`) y escritorio (`> 1024px`).
3. **Rendimiento:** Evitar animaciones costosas en CSS; priorizar propiedades aceleradas por GPU (`transform`, `opacity`).

### C. JavaScript y Modularidad (Vanilla JS)
1. **Sin dependencias pesadas:** Mantener el bundle liviano; utilizar APIs modernas del navegador en lugar de librerías externas para animaciones o utilidades básicas.
2. **Gestión de Eventos:**
   * Inicializar componentes tras el evento `DOMContentLoaded`.
   * Realizar delegación de eventos y limpiar listeners cuando aplique.
   * Usar `IntersectionObserver` para scroll spy y animaciones al entrar en viewport.

---

## 3. SEO y Metadatos

1. **Open Graph & Twitter Cards:** Mantener actualizadas las etiquetas de previsualización para WhatsApp, Facebook, LinkedIn y Twitter con URLs canónicas e imágenes con dimensiones recomendadas (1200x630 o 500x500 cuadradas).
2. **Rendimiento de Carga:**
   * `preconnect` y `dns-prefetch` para servicios externos críticos como Google Fonts.
   * Minimizar recursos bloqueantes de renderizado.

---

## 4. Integraciones y Ecosistema Piggy

1. **Enlace a la App:**
   * Todos los llamados a la acción (CTA) de "Iniciar sesión" o "Comenzar" deben apuntar al dominio oficial de la aplicación (`https://piggy-app-v2-gvm.vercel.app/`).
2. **Coherencia de Marca:**
   * La landing debe reflejar la propuesta de valor agro-fintech: inversión digital y engorde porcino de ciclo transparente con Supabase y Wompi en el backend de la app.

---

## 5. Control de Versiones y Protocolo MCP (Reglas Obligatorias)

### A. Sincronización Exclusiva e Inmediata vía MCP
1. **Sin persistencia local exclusiva:** No se deben dejar cambios ni ajustes pendientes en la máquina local. 
2. **Commit y Push Inmediato:** Todos los cambios, ajustes o adiciones generados en cada conversación deben subirse y sincronizarse inmediatamente al repositorio de GitHub a través del **servidor MCP de GitHub**.
3. **Flujo de Trabajo:** Cada conversación debe culminar con la confirmación de la subida a GitHub vía MCP, asegurando que Vercel reciba el trigger de compilación en producción de manera continua.

### B. Límite de Carga por MCP (Regla de >1000 Líneas de Código)
1. **Restricción de Archivos Monolíticos (>1000 líneas):**
   * **No subir archivos de más de 1000 líneas de código a través de herramientas MCP monolíticas (ej. `create_or_update_file`).**
   * **Motivo Técnico y Vigencia:** Los servidores MCP de GitHub y las APIs de serialización de payloads presentan riesgos documentados de **truncamiento silencioso (*silent truncation*)** y desbordamiento de buffer al procesar blobs de gran tamaño en una sola llamada de herramienta, pudiendo corromper archivos o perder líneas sin arrojar error.
2. **Estrategia Obligatoria para Archivos Grandes:**
   * **Modularización:** Dividir los archivos extensos en módulos, componentes o utilidades independientes con menos de 1000 líneas antes de la subida.
   * **Validación de Integridad:** Verificar siempre la integridad del archivo tras la confirmación de commit.
