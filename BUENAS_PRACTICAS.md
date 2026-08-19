# Manual de Buenas Prácticas — Piggy Landing

Este documento compila las mejores prácticas, estándares de desarrollo, directrices de calidad y protocolos de sincronización mediante MCP para la landing page de **Piggy App**.

---

## 📌 Tabla de Contenidos
1. [Estructura y Organización](#1-estructura-y-organización)
2. [Estándares de Código](#2-estándares-de-código)
3. [Accesibilidad (A11y) y SEO](#3-accesibilidad-a11y-y-seo)
4. [Rendimiento Web](#4-rendimiento-web)
5. [Conexión con el Ecosistema Piggy](#5-conexión-con-el-ecosistema-piggy)
6. [Protocolo Obligatorio MCP y Flujo de Git](#6-protocolo-obligatorio-mcp-y-flujo-de-git)

---

## 1. Estructura y Organización
* `index.html`: Estructura semántica principal.
* `style.css`: Importación central de módulos y estilos globales.
* `css/`: Módulos específicos (`base.css`, `header.css`, `hero.css`, `sections.css`, `footer.css`).
* `main.js`: Lógica interactiva con Vanilla JS nativo.
* `public/assets/`: Recursos multimedia optimizados.

---

## 2. Estándares de Código

### HTML
* Usar etiquetas semánticas (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`).
* Mantener jerarquía estricta de encabezados (`<h1>` único por página, seguido por `<h2>`, `<h3>` según corresponda).
* Todo elemento interactivo debe ser accesible por teclado y lector de pantalla.

### CSS
* Enfoque **Mobile-First** con media queries claras (`@media (min-width: ...)`).
* Uso de variables nativas CSS (tokens de diseño) para colores, fuentes y radios de borde.
* Evitar el uso de `!important` y especificidades innecesariamente altas.

### JavaScript
* Código modular y sin dependencias externas pesadas.
* Empleo de `IntersectionObserver` para triggers de visibilidad y animaciones en scroll.
* Limpieza y gestión defensiva de eventos en el DOM.

---

## 3. Accesibilidad (A11y) y SEO
* **Contraste de color:** Cumplir con WCAG AA en combinaciones de fondo y texto.
* **Textos alternativos:** Todo `<img>` debe contar con un `alt` descriptivo.
* **Metadatos Open Graph / Twitter Cards:** Mantener previsualizaciones actualizadas para compartir en redes sociales y mensajería (WhatsApp, Telegram).

---

## 4. Rendimiento Web
* Minimizar el bloqueo del renderizado principal.
* Uso de fuentes optimizadas (`font-display: swap`, preconnect a Google Fonts).
* Compresión de imágenes a formatos modernos (WebP, SVG vectorial, PNG optimizado).

---

## 5. Conexión con el Ecosistema Piggy
* **Aplicación Principal:** [Piggy App V2](https://piggy-app-v2-gvm.vercel.app/)
* **Pasarela y Backend:** Los CTAs dirigen al flujo de registro/login respaldado por Supabase y Wompi.

---

## 6. Protocolo Obligatorio MCP y Flujo de Git

### 🚀 A. Sincronización Exclusiva vía MCP
* **Sin almacenamiento local permanente:** Todos los ajustes, correcciones o mejoras realizadas durante cada conversación deben subirse y sincronizarse **inmediatamente y de forma exclusiva a través del MCP de GitHub**.
* **Integración Continua:** Cada cambio empujado vía MCP dispara automáticamente la compilación y despliegue en producción en **Vercel** (`main`).

### ⚠️ B. Regla de Límite de Archivos (>1000 Líneas)
* **Prohibido subir archivos de más de 1000 líneas por llamada monolítica de MCP:**
  * **Análisis de Vigencia:** Esta regla es **100% correcta y vigente**. Las herramientas del servidor MCP de GitHub (como `create_or_update_file`) y la serialización de payloads en LLMs son propensas a **truncamiento silencioso (*silent truncation*)** y pérdida de datos en archivos extensos (>500 a 1000 líneas), aun cuando la API reporte un estado exitoso.
* **Procedimiento ante Archivos Extensos:**
  1. **Modularizar:** Dividir el código en archivos/módulos de menos de 1000 líneas antes de la subida.
  2. **Verificación de Integridad:** Comprobar siempre la consistencia del commit generado tras la sincronización.
