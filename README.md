# Sistema de Facturación - Frontend

Sistema frontend de facturación profesional desarrollado con React, TypeScript y Tailwind CSS para consumir una API REST en NestJS.

## Tecnologías

- **React 19** + **TypeScript**
- **Vite** - Build tool
- **TailwindCSS** + **Shadcn UI** - Estilos y componentes
- **Zustand** - Gestión de estado global
- **Formik** + **Yup** - Formularios y validaciones
- **React Router** - Enrutamiento
- **date-fns** - Manejo de fechas

## Estructura del Proyecto

```
src/
├── components/
│   ├── ui/              # Componentes UI de Shadcn
│   └── Layout.tsx       # Layout principal con navegación
├── pages/
│   ├── customers/       # Módulo de Clientes
│   │   ├── CustomerList.tsx
│   │   └── CustomerForm.tsx
│   ├── invoices/        # Módulo de Facturas
│   │   ├── InvoiceList.tsx
│   │   └── CreateInvoice.tsx
│   └── Home.tsx         # Página de inicio
├── store/               # Zustand stores
│   ├── useCustomerStore.ts
│   ├── useInvoiceStore.ts
│   └── useCompanyStore.ts
├── types/               # Tipos TypeScript
│   └── index.ts
├── utils/               # Utilidades
│   └── httpClient.ts    # Cliente HTTP
└── lib/
    └── utils.ts         # Utilidades compartidas
```

## Características Principales

### Módulo de Clientes
- ✅ Listado de clientes con tabla paginada
- ✅ Crear nuevo cliente
- ✅ Editar cliente existente
- ✅ Búsqueda de RNC automática con integración a API externa
- ✅ Validaciones con Formik + Yup

### Módulo de Facturas
- ✅ Crear facturas con 5 tipos:
  - **GOVERNMENTAL** - Gubernamental (requiere cliente)
  - **QUOTE** - Cotización (requiere cliente)
  - **CREDIT** - Crédito Fiscal (requiere cliente)
  - **BASIC** - Básica (solo nombre de cliente)
  - **ENDCONSUMER** - Consumidor Final (sin cliente)
- ✅ Gestión dinámica de items/productos
- ✅ Cálculo automático de subtotal, ITBIS (18%) y total
- ✅ Selector de fecha editable
- ✅ Listado de facturas con:
  - Filtros por tipo y cliente
  - Paginación
  - Formato de moneda (RD$)

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear archivo .env en la raíz con:
VITE_API_URL=http://localhost:3000
```

## Comandos Disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

## Configuración de API

El proyecto está configurado para consumir una API REST en `http://localhost:3000` por defecto. Puedes cambiar esta URL en el archivo `.env`:

```env
VITE_API_URL=http://tu-api-url.com
```

## Endpoints Utilizados

### Clientes
- `GET /customers` - Obtener todos los clientes
- `GET /customers/:id` - Obtener un cliente
- `POST /customers` - Crear cliente
- `PATCH /customers/:id` - Actualizar cliente

### Facturas
- `GET /invoices` - Obtener todas las facturas
- `GET /invoices/:id` - Obtener una factura
- `POST /invoices` - Crear factura

### Company/Misceláneos
- `GET /company/current` - Obtener datos de la empresa
- `GET /company/rnc?rnc=...` - Consultar RNC externo

## Flujo de Trabajo

### Crear Factura
1. Seleccionar tipo de factura
2. Si requiere cliente, seleccionar del dropdown (busca por RNC)
3. Si es BASIC, ingresar nombre del cliente manualmente
4. Agregar productos con nombre, precio y cantidad
5. El sistema calcula automáticamente subtotal, ITBIS (18%) y total
6. Seleccionar fecha (por defecto hoy)
7. Crear factura

### Gestionar Clientes
1. Ver listado de clientes con información completa
2. Crear nuevo cliente con búsqueda automática de RNC
3. Editar clientes existentes
4. Todos los campos son validados antes de guardar

## Tipos de Datos

```typescript
// InvoiceType
type InvoiceType = 'GOVERNMENTAL' | 'QUOTE' | 'ENDCONSUMER' | 'CREDIT' | 'BASIC'

// Customer
interface Customer {
  id: number
  name: string
  document: string
  phone?: string
  address?: string
  createdAt: string
}

// Invoice
interface Invoice {
  id: number
  customerId?: number
  customer?: Customer
  customerName?: string
  type: InvoiceType
  document?: string
  items: InvoiceItem[]
  subtotal: number
  taxes: number
  total: number
  createdAt: string
}

// InvoiceItem
interface InvoiceItem {
  name: string
  price: number
  quantity: number
}
```

## Rutas

- `/` - Página de inicio
- `/customers` - Listado de clientes
- `/customers/new` - Crear nuevo cliente
- `/customers/edit/:id` - Editar cliente
- `/invoices` - Listado de facturas
- `/invoices/new` - Crear nueva factura

## Personalización

### Colores
Los colores se pueden personalizar en `src/index.css` modificando las variables CSS.

### Componentes UI
Los componentes están basados en Shadcn UI y se pueden personalizar en `src/components/ui/`.

## Notas Técnicas

- **Validación de formularios**: Todos los formularios usan Formik + Yup
- **Estado global**: Zustand maneja el estado de clientes, facturas y empresa
- **HTTP Client**: Cliente personalizado con fetch (ver `src/utils/httpClient.ts`)
- **Tipos seguros**: 100% TypeScript con tipos estrictos
- **Responsive**: Diseño adaptable a móviles y escritorio

## Próximas Mejoras

- [ ] Modo oscuro
- [ ] Exportar facturas a PDF
- [ ] Dashboard con estadísticas
- [ ] Búsqueda avanzada en listados
- [ ] Edición de facturas
- [ ] Autenticación de usuarios

## Licencia

MIT
