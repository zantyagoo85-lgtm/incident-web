# 🌐 Frontend de Gestión de Incidentes

Frontend desarrollado con **Angular 21** para la visualización y gestión de incidentes. Enfocado en una arquitectura modular, mantenible y altamente testeable.

---

## 🛠️ Versión Actual
- **Angular**: 21.2.0
- **Node.js**: 18.x o superior
- **NPM**: 10.x o superior

---

## 🚀 Cómo Ejecutar el Proyecto

### 1. Instalación de dependencias
```bash
npm install
```

### 2. Configuración de Variables de Entorno
Copia el archivo de ejemplo y ajusta los valores:
```bash
cp src/environments/environment.ts.example src/environments/environment.ts
```

Variables necesarias:
- `apiBaseUrl`: La dirección de tu API Backend (ej: https://localhost:5000/api).
- `dockerApiBaseUrl`: URL del API cuando se ejecuta en Docker (ej: http://incident-api:8080/api).
- `isDocker`: Bandera para indicar si la aplicación se ejecuta en contenedor Docker.

### 3. Ejecución en desarrollo
```bash
npm start
# o
ng serve
```
**Accede a**: http://localhost:4200

### 4. Construcción para producción
```bash
npm run build:prod
```
Los archivos optimizados se generan en `dist/incident-web/`.

---

## 🏗️ Decisiones de Arquitectura

| Decisión | Justificación | Trade-off |
|----------|-------------|-----------|
| **Estructura Feature-First** | Organización por dominios de negocio para escalar. | Requiere disciplina para mover componentes a shared. |
| **RxJS + Observables** | Manejo de flujos de datos asíncronos en tiempo real. | Curva de aprendizaje alta para evitar memory leaks. |
| **Standalone Components** | Menos boilerplate y mejor rendimiento. | Cambio de paradigma respecto a módulos tradicionales. |
| **Angular Material + CDK** | Componentes UI robustos y accesibles con diseño consistente. | Mayor bundle size inicial. |
| **ESLint + Prettier** | Código consistente y calidad automatizada. | Configuración de reglas personalizada necesaria. |
| **Husky + lint-staged** | Pre-commit hooks para mantener calidad de código. | Ligera sobrecarga en cada commit. |

---

## 🧪 Testing

### Pruebas unitarias
Ejecuta la suite de pruebas unitarias para validar la lógica de los componentes y servicios:
```bash
npm test          # Modo watch
npm run test:ci   # Para CI/CD (sin watch, Chrome headless)
```

### Validación de código
```bash
npm run validate      # Ejecuta lint, format check y type-check
```

---

## 🔍 Probar Endpoints desde el Frontend

Para validar la integración sin usar la UI, puedes capturar las peticiones desde la pestaña Network de tu navegador (F12) o utilizar este comando curl para verificar que tu servicio recibe los datos correctamente:

### Autenticación
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@company.com",
    "password": "123456"
  }'
```

### Listar Incidentes
```bash
curl -X GET http://localhost:5000/api/incidents \
  -H "Authorization: Bearer <TU_TOKEN_JWT>" \
  -H "Content-Type: application/json"
```

### Crear Incidente
```bash
curl -X POST http://localhost:5000/api/incidents \
  -H "Authorization: Bearer <TU_TOKEN_JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test desde Frontend",
    "description": "Incidente de prueba",
    "severity": "MEDIUM",
    "serviceId": "svc-01"
  }'
```

### Obtener Detalle
```bash
curl -X GET http://localhost:5000/api/incidents/<ID> \
  -H "Authorization: Bearer <TU_TOKEN_JWT>" \
  -H "Content-Type: application/json"
```

### Actualizar Estado
```bash
curl -X PATCH http://localhost:5000/api/incidents/<ID>/status \
  -H "Authorization: Bearer <TU_TOKEN_JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress"
  }'
```

### Endpoints principales
- `GET /api/incidents` - Listar incidentes con filtros y paginación
- `POST /api/incidents` - Crear nuevo incidente
- `GET /api/incidents/{id}` - Obtener incidente específico con timeline
- `PATCH /api/incidents/{id}/status` - Actualizar estado del incidente

### Filtros soportados
- `status`: Estado del incidente (open, in_progress, resolved, closed)
- `severity`: Severidad (low, medium, high, critical)
- `serviceId`: ID del servicio
- `searchQuery`: Búsqueda por título (contains)
- `page`: Número de página (0-based)
- `pageSize`: Tamaño de página
- `sort`: Ordenamiento (ej: createdAt_desc)

---

## 🎨 UI/UX

### Diseño
- **Material Design** con Angular Material
- **Paleta de colores** coherente y accesible
- **Iconos intuitivos** para acciones
- **Feedback visual** en todas las interacciones

### Responsividad
- **Mobile-first** approach
- **Grid system** adaptable
- **Touch-friendly** interactions
- **Optimized** para tablets y móviles

---

## 🐳 Docker

### Build de imagen
```bash
docker build -t incident-web .
```

### Ejecutar contenedor
```bash
docker run -p 80:80 incident-web
```

### URL de Acceso
**Frontend disponible en**: http://localhost:4200

---

## 📊 Estructura del Proyecto

```
src/
├── app/
│   ├── core/                 # Servicios singleton e inyección de dependencias
│   │   ├── services/         # Servicios HTTP y negocio
│   │   └── constants/        # Constantes y configuraciones
│   ├── features/             # Módulos por dominio de negocio
│   │   └── incidents/        # Módulo de incidentes
│   │       ├── pages/        # Páginas (listado, crear, detalle)
│   │       └── services/     # Servicios específicos
│   ├── models/               # Interfaces y tipos de datos
│   ├── shared/               # Componentes y utilidades reutilizables
│   ├── app.config.ts   # Configuración de la aplicación
│   └── app.routes.ts   # Definición de rutas
├── environments/         # Configuración por entorno
├── styles.scss          # Estilos globales
└── index.html           # Template principal
```

---

## � Scripts Disponibles

```bash
# Desarrollo
npm start              # Servidor de desarrollo en http://localhost:4200
npm run watch          # Build con watch

# Calidad de código
npm run lint          # Ejecuta ESLint
npm run lint:fix       # Corrige problemas de linting
npm run format        # Formatea código con Prettier
npm run format:check   # Verifica formato
npm run type-check    # Type checking con TypeScript
npm run validate      # Validación completa del código

# Tests
npm test              # Ejecuta tests en modo watch
npm run test:ci       # Ejecuta tests para CI/CD
npm run test:watch    # Tests en modo interactivo

# Build
npm run build         # Build de desarrollo
npm run build:prod    # Build de producción
```

---

## � Pipeline CI/CD

Este proyecto incluye un pipeline completo de Integración Continua y Despliegue Continuo utilizando GitHub Actions.

### 🏗️ Calidad Automatizada
- ✅ **Formateo (Prettier)**
- 🔍 **Linting (ESLint + Angular ESLint)**
- 🔷 **Type checking (TypeScript)**
- 🧪 **Tests unitarios con cobertura**
- 🏗️ **Build automatizado**

### 🔄 Pre-commit Hooks
El proyecto utiliza Husky + lint-staged para garantizar calidad antes de cada commit.

---

## 🚀 Despliegue con Docker

### Build de imagen
```bash
docker build -t incident-web .
```

### Ejecutar contenedor
```bash
docker run -p 80:80 incident-web
```

### URL de Acceso
**Frontend disponible en**: http://localhost:4200

---

## � UI/UX

### Componentes Principales
- **IncidentListComponent**: Listado con filtros avanzados y paginación
- **IncidentDetailComponent**: Vista detallada con timeline y actualización de estado
- **IncidentCreateComponent**: Formulario para crear nuevos incidentes
- **LoginComponent**: Autenticación con JWT

### Características
- **Filtros en tiempo real**: Estado, severidad, servicio, búsqueda
- **Paginación optimizada**: Navegación eficiente entre páginas
- **Actualización de estado**: Cambio inmediato sin recargar página
- **Timeline de eventos**: Seguimiento completo del incidente
- **Diseño responsivo**: Adaptación perfecta a móviles y tablets

---

## 🧪 Testing

### Estrategia de Testing
- **Unit Tests**: Lógica de negocio y servicios
- **Component Tests**: Comportamiento de UI
- **Integration Tests**: Flujo completo usuario-sistema
- **E2E Tests**: Casos de uso reales con Playwright

### Cobertura Objetivo
- **Statements**: >80%
- **Branches**: >70%
- **Functions**: >75%
- **Lines**: >80%

---

## 🔒 Seguridad

### Implementaciones
- **Content Security Policy** headers
- **XSS Protection** activado
- **HTTPS enforcement** en producción
- **JWT tokens** con expiración adecuada
- **Input sanitization** en todos los formularios

---

## 🤝 Contribución

### Flujo de trabajo
1. **Feature branch** desde `main`
2. **Commits atómicos** y descriptivos
3. **PR con tests** incluidos
4. **Code review** obligatorio
5. **Merge con squash** al `main`

### Standards
- **TypeScript** strict mode
- **ESLint** configurado
- **Prettier** para formato
- **Husky** para pre-commit hooks
- **Commits convencionales** (Conventional Commits)

---

## 📝 TODOs

### Mejoras planeadas
- [x] **Autenticación** con JWT y refresh token
- [ ] **Notificaciones** real-time (WebSocket)
- [ ] **Offline support** con PWA
- [x] **Internacionalización** (i18n)
- [ ] **Dashboard** con métricas
- [ ] **Export** a PDF/Excel
- [ ] **Component Library** para proyectos futuros
- [ ] **Performance Monitoring** integrado
- [x] **Error Boundary** implementado

### Bugs conocidos
- [ ] **Scroll** en mobile en ciertos componentes
- [ ] **Performance** en listados grandes (>1000 items)
- [ ] **Memory leaks** en observables no desuscritos

---

## 📞 Soporte

### Issues
Reportar bugs y feature requests en [GitHub Issues](https://github.com/tu-org/incident-web/issues)
### Documentación
- [Angular Docs](https://angular.dev)
- [Material Design](https://material.io/design)
- [API Documentation](./docs/api.md)

---

**Desarrollado con ❤️ siguiendo principios SOLID y mejores prácticas Angular**
