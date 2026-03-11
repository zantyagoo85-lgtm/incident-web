# Gestión de Incidentes - Frontend

Aplicación web Angular para la gestión de incidentes productivos, parte de una solución completa que incluye backend API e infraestructura Docker.

## 🚀 Características

- **Listado de incidentes** con filtros avanzados y paginación
- **Creación de incidentes** con formulario validado
- **Detalle de incidentes** con timeline completo de eventos
- **Actualización de estado** en tiempo real
- **Diseño responsivo** y moderno con Angular Material
- **Arquitectura limpia** siguiendo principios SOLID

## 🛠️ Stack Tecnológico

- **Frontend**: Angular 21 con TypeScript
- **UI Framework**: Angular Material
- **Build Tool**: Angular CLI
- **Testing**: Jasmine/Karma para unit tests
- **Container**: Docker con Nginx para producción
- **HTTP Client**: Angular HttpClient con RxJS

## 📋 Prerrequisitos

- Node.js 18+ 
- Angular CLI 21+
- Docker y Docker Compose (para despliegue)

## 🏃‍♂️ Ejecución Local

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Editar `src/environments/environment.ts` si es necesario:
```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:5000/api'  // URL del backend API
};
```

### 3. Iniciar servidor de desarrollo
```bash
ng serve
```

La aplicación estará disponible en `http://localhost:4200/`

### 4. Ejecutar tests
```bash
# Unit tests
ng test

# E2E tests (si configurados)
ng e2e
```

## � CI/CD Pipeline

Este proyecto incluye un pipeline completo de Integración Continua y Despliegue Continuo utilizando GitHub Actions.

### 📋 Workflows Automatizados

- **CI Pipeline**: Validación completa en cada push y PR
- **PR Validation**: Validación específica para Pull Requests  
- **Release**: Creación automática de releases

### 🔍 Calidad de Código Automatizada

- ✅ Formato (Prettier)
- 🔍 Linting (ESLint + Angular ESLint)
- 🔷 Type checking (TypeScript)
- 🧪 Tests unitarios con cobertura
- 🏗️ Build automatizado

### 🔄 Pre-commit Hooks

El proyecto utiliza Husky + lint-staged para garantizar calidad antes de cada commit:

```bash
# Formateo y linting automático en cada commit
git add .
git commit -m "feat: nueva funcionalidad"
# Los hooks se ejecutan automáticamente
```

### 📊 Scripts Disponibles

```bash
# Desarrollo
npm start              # Servidor de desarrollo
npm run watch          # Build con watch

# Calidad de código
npm run lint          # Ejecuta ESLint
npm run lint:fix       # Corrige problemas de linting
npm run format        # Formatea código con Prettier
npm run format:check   # Verifica formato
npm run type-check    # Type checking con TypeScript

# Tests
npm test              # Ejecuta tests en modo watch
npm run test:ci       # Ejecuta tests para CI (headless + coverage)
npm run test:watch    # Tests en modo interactivo

# Build
npm run build         # Build de desarrollo
npm run build:prod    # Build de producción
```

📖 **Documentación completa**: [CI-CD.md](./CI-CD.md)

## �🐳 Despliegue con Docker

### Build de imagen
```bash
docker build -t incident-web .
```

### Ejecutar contenedor
```bash
docker run -p 80:80 incident-web
```

### Con Docker Compose (recomendado)
Desde el repositorio `incident-infra`:
```bash
docker compose up --build
```

## 🏗️ Arquitectura

```
src/
├── app/
│   ├── core/                 # Servicios y utilidades core
│   │   ├── services/         # Servicios HTTP y negocio
│   │   └── constants/        # Constantes y configuraciones
│   ├── features/             # Características por dominio
│   │   └── incidents/        # Módulo de incidentes
│   │       ├── pages/        # Páginas (listado, crear, detalle)
│   │       └── services/     # Servicios específicos
│   ├── models/               # Modelos de datos
│   └── environments/         # Configuración por entorno
├── styles.scss               # Estilos globales
└── index.html                # Template principal
```

## 📡 API Integration

La aplicación consume los siguientes endpoints del backend API:

### Incidentes
- `GET /incidents` - Listar incidentes con filtros y paginación
- `POST /incidents` - Crear nuevo incidente
- `GET /incidents/{id}` - Obtener detalle con timeline
- `PATCH /incidents/{id}/status` - Actualizar estado

### Filtros soportados
- `status`: Estado del incidente (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
- `severity`: Severidad (LOW, MEDIUM, HIGH, CRITICAL)
- `serviceId`: ID del servicio
- `q`: Búsqueda por título (contains)
- `page`: Número de página
- `pageSize`: Tamaño de página
- `sort`: Ordenamiento (ej: createdAt_desc)

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

## 🧪 Testing

### Tests Unitarios
- **Servicios**: Cobertura de lógica de negocio
- **Componentes**: Comportamiento de UI
- **Utilidades**: Funciones puras

### Ejecución
```bash
# Todos los tests
ng test

# Con cobertura
ng test --coverage

# Watch mode
ng test --watch
```

## 🔧 Configuración

### Variables de Entorno
```typescript
// development
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:5000/api'
};

// production  
export const environment = {
  production: true,
  apiBaseUrl: '/api'  // Proxy a través de Nginx
};
```

### Build Optimizations
```bash
# Producción
ng build --configuration production

# Con source maps (debug)
ng build --configuration production --source-map
```

## 📊 Performance

### Optimizaciones implementadas
- **Lazy loading** de componentes
- **Tree shaking** automático
- **Bundle splitting** por ruta
- **Image optimization** en assets
- **Service Worker** para caché (opcional)

### Métricas
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s  
- **Bundle size**: < 500KB gzipped

## 🚀 Despliegue

### Producción
```bash
# Build optimizado
ng build --configuration production

# Docker build
docker build -t incident-web .

# Deploy
docker push registry/incident-web:latest
```

### CDN
Los assets estáticos están optimizados para servirse desde CDN:
- JS/CSS minificados y gzipped
- Imágenes optimizadas
- Cache headers configurados

## 🔒 Seguridad

### Implementaciones
- **Content Security Policy** headers
- **XSS Protection** activado
- **HTTPS enforcement** en producción
- **Secure cookies** si aplica

### Best Practices
- **Sanitización** de inputs
- **Validación** en frontend y backend
- **Error handling** seguro
- **No secrets** en el cliente

## 🤝 Contribución

### Flujo de trabajo
1. **Feature branch** desde `main`
2. **Commits atómicos** y descriptivos
3. **PR con tests** incluidos
4. **Code review** obligatorio
5. **Merge** con squash

### Standards
- **TypeScript** strict mode
- **ESLint** configurado
- **Prettier** para formato
- **Husky** para pre-commit hooks

## 📝 TODOs

### Mejoras planeadas
- [ ] **Autenticación** con JWT
- [ ] **Notificaciones** real-time (WebSocket)
- [ ] **Offline support** con PWA
- [ ] ** Internacionalización** (i18n)
- [ ] **Dashboard** con métricas
- [ ] **Export** a PDF/Excel

### Bugs conocidos
- [ ] **Scroll** en mobile en ciertos componentes
- [ ] **Performance** en listados grandes (>1000 items)

## 📞 Soporte

### Issues
Reportar bugs y feature requests en [GitHub Issues](https://github.com/tu-org/incident-web/issues)

### Documentación
- [Angular Docs](https://angular.dev)
- [Material Design](https://material.io/design)
- [API Documentation](./docs/api.md)

---

**Desarrollado con ❤️ siguiendo principios SOLID y mejores prácticas Angular**
