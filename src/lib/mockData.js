// Datos mock locales para el frontend. El backend NestJS aún no existe, así que
// todo el contenido vive aquí por ahora. La forma sigue docs/06-modelo-datos.md,
// extendida con commands / quickLinks / codeFiles que aún no están en ese doc.

export const CLUSTERS = {
	personal: { label: 'Personal', color: '#4fd1c5' },
	trabajo: { label: 'Trabajo formal', color: '#e0935a' }
};

export const STATUS = {
	activo: { label: 'Activo', color: '#7cc58f' },
	pausado: { label: 'Pausado', color: '#8a8798' },
	archivado: { label: 'Archivado', color: '#6b6680' }
};

export const ROLES = {
	colaborador: 'Colaborador',
	director: 'Director'
};

export const STACK_OPTIONS = ['Node', 'NestJS', 'Svelte', 'SvelteKit', 'React', 'MongoDB', 'PostgreSQL', 'Docker', 'Kafka', 'Python', 'Raspberry Pi', 'MQTT'];

const projects = [
	// ─── Cluster Personal ────────────────────────────────────────────────
	{
		id: 'exocortex',
		title: 'Exocortex',
		cluster: 'personal',
		role: null,
		status: 'activo',
		locked: false,
		stack: ['SvelteKit', 'NestJS', 'MongoDB'],
		links: {
			repo: 'https://github.com/kevin-martineze/exocortex',
			board: '',
			cicd: ''
		},
		position: { x: 27, y: 24 },
		related: ['huerto-iot'],
		notes: `# Estado del proyecto
Segundo cerebro personal. En fase de scaffolding del frontend.

## Pendientes
- Arrancar backend NestJS
- Conectar GitHub OAuth para preview de código
- Definir export de proyecto completo`,
		docs: [
			{
				id: 'exo-doc-1',
				title: 'Arquitectura',
				content: `# Arquitectura

- **Frontend**: SvelteKit (este repo).
- **Backend**: NestJS, en repo separado exocortex-api.
- **Base de datos**: MongoDB.

Los secretos se cifran end-to-end con una passphrase maestra que nunca se envía al servidor.`
			},
			{
				id: 'exo-doc-2',
				title: 'Despliegue',
				content: `# Despliegue

Frontend y backend corren como contenedores Docker en una instancia EC2.

~~~bash
docker compose up -d
~~~

MongoDB corre en el mismo host, con respaldos programados.`
			}
		],
		bitacora: [
			{ id: 'exo-b1', date: '2026-10-15', text: 'Arranqué el scaffolding del frontend con SvelteKit.' },
			{ id: 'exo-b2', date: '2026-10-14', text: 'Cerrado el alcance y el modelo de datos.' },
			{ id: 'exo-b3', date: '2026-10-13', text: 'Validado el prototipo de la vista de constelación.' }
		],
		environments: [
			{
				id: 'exo-env-local',
				name: 'Local',
				url: 'http://localhost:5173',
				vars: [
					{ id: 'exo-v1', key: 'VITE_API_URL', value: 'http://localhost:3000' },
					{ id: 'exo-v2', key: 'MONGO_URI', value: 'mongodb://localhost:27017/exocortex' }
				]
			}
		],
		commands: [
			{ id: 'exo-c1', label: 'Levantar frontend', command: 'npm run dev' }
		],
		quickLinks: []
	},
	{
		id: 'huerto-iot',
		title: 'Huerto IoT',
		cluster: 'personal',
		role: null,
		status: 'pausado',
		locked: false,
		stack: ['Node', 'Raspberry Pi', 'MQTT'],
		links: { repo: 'https://github.com/kevin-martineze/huerto-iot', board: '', cicd: '' },
		position: { x: 23, y: 55 },
		related: ['exocortex'],
		notes: `# Huerto IoT
Sensores de humedad y riego automático en el patio.

## Notas
- El sensor del invernadero se desconecta con el frío.
- Regar manualmente en verano.
- Cambiar baterías del nodo del limonero cada 3 meses.`,
		docs: [
			{
				id: 'huerto-doc-1',
				title: 'Cableado',
				content: `# Cableado

Cada maceta tiene un sensor de humedad conectado por ESP32. Los datos viajan por MQTT a una Raspberry Pi central que decide el riego.`
			}
		],
		bitacora: [
			{ id: 'huerto-b1', date: '2026-09-28', text: 'Agregué el sensor de la maceta de albahaca.' },
			{ id: 'huerto-b2', date: '2026-09-10', text: 'El nodo del invernadero se quedó sin batería; pausado hasta reponerla.' }
		],
		environments: [
			{
				id: 'huerto-env-local',
				name: 'Local',
				url: '',
				vars: [{ id: 'huerto-v1', key: 'MQTT_BROKER', value: 'mqtt://192.168.1.50:1883' }]
			}
		],
		commands: [],
		quickLinks: []
	},
	{
		id: 'fotos-familia',
		title: 'Archivo fotográfico',
		cluster: 'personal',
		role: null,
		status: 'activo',
		locked: false,
		stack: ['Python', 'PostgreSQL'],
		links: { repo: 'https://github.com/kevin-martineze/archivo-fotos', board: '', cicd: '' },
		position: { x: 34, y: 82 },
		related: [],
		notes: `# Archivo fotográfico familiar
Digitalizar álbumes viejos y etiquetar por año.

## Prioridad
Escaneos de los álbumes de 1990-2000.`,
		docs: [
			{
				id: 'fotos-doc-1',
				title: 'Etiquetado',
				content: `# Etiquetado

Convención de nombres: YYYY-MM-DD_evento_numero.jpg. Las fotos sin fecha van en una carpeta pendiente.`
			}
		],
		bitacora: [
			{ id: 'fotos-b1', date: '2026-10-02', text: 'Primera tanda de escaneos lista.' }
		],
		environments: [],
		commands: [],
		quickLinks: []
	},

	// ─── Cluster Trabajo formal ──────────────────────────────────────────
	{
		id: 'plataforma-pagos',
		title: 'Plataforma de pagos',
		cluster: 'trabajo',
		role: 'colaborador',
		status: 'activo',
		locked: false,
		stack: ['NestJS', 'MongoDB', 'Docker'],
		links: {
			repo: 'https://github.com/org/plataforma-pagos',
			board: 'https://jira.example.com/projects/PAG',
			cicd: 'https://github.com/org/plataforma-pagos/actions'
		},
		position: { x: 74, y: 24 },
		related: ['integraciones-api', 'portal-clientes'],
		docs: [
			{
				id: 'pagos-doc-1',
				title: 'Flujo de cobro',
				content: `# Flujo de cobro

1. El frontend crea una intención de pago.
2. El backend valida el monto y la moneda.
3. Se crea el cargo contra el proveedor.
4. Se guarda el resultado en la colección de pagos.`
			},
			{
				id: 'pagos-doc-2',
				title: 'Reconciliación',
				content: `# Reconciliación

Corre un job nocturno que compara los cargos locales contra el reporte del proveedor y marca diferencias para revisión manual.`
			}
		],
		bitacora: [
			{ id: 'pagos-b1', date: '2026-10-14', text: 'Subimos el módulo de reembolsos a QA.' },
			{ id: 'pagos-b2', date: '2026-10-11', text: 'Bloqueado: el webhook de Stripe llega duplicado en sandbox.' },
			{ id: 'pagos-b3', date: '2026-10-06', text: 'Definimos el contrato de la API de cargos con el equipo de front.' }
		],
		environments: [
			{
				id: 'pagos-dev',
				name: 'Dev',
				url: 'https://dev.pagos.example.com',
				vars: [
					{ id: 'pagos-dev-1', key: 'DATABASE_URL', value: 'postgres://user:pass@dev-db:5432/pagos' },
					{ id: 'pagos-dev-2', key: 'STRIPE_SECRET_KEY', value: 'sk_test_dev_4xK7mP2qR9tL' }
				]
			},
			{
				id: 'pagos-testing',
				name: 'Testing',
				url: 'https://testing.pagos.example.com',
				vars: [
					{ id: 'pagos-testing-1', key: 'DATABASE_URL', value: 'postgres://user:pass@testing-db:5432/pagos' },
					{ id: 'pagos-testing-2', key: 'STRIPE_SECRET_KEY', value: 'sk_test_testing_5mP8qR2sT7uV' }
				]
			},
			{
				id: 'pagos-qa',
				name: 'QA',
				url: 'https://qa.pagos.example.com',
				vars: [
					{ id: 'pagos-qa-1', key: 'DATABASE_URL', value: 'postgres://user:pass@qa-db:5432/pagos' },
					{ id: 'pagos-qa-2', key: 'STRIPE_SECRET_KEY', value: 'sk_test_qa_8nY3vB6cD1eF' }
				]
			},
			{
				id: 'pagos-pre',
				name: 'Pre-producción',
				url: 'https://pre.pagos.example.com',
				vars: [
					{ id: 'pagos-pre-1', key: 'DATABASE_URL', value: 'postgres://user:pass@pre-db:5432/pagos' },
					{ id: 'pagos-pre-2', key: 'STRIPE_SECRET_KEY', value: 'sk_live_pre_6bN2wT8eR4uY' }
				]
			},
			{
				id: 'pagos-prod',
				name: 'Producción',
				url: 'https://pagos.example.com',
				vars: [
					{ id: 'pagos-prod-1', key: 'DATABASE_URL', value: 'postgres://user:pass@prod-db:5432/pagos' },
					{ id: 'pagos-prod-2', key: 'STRIPE_SECRET_KEY', value: 'sk_live_prod_2jH5wN9eR3tY' }
				]
			}
		],
		codeFiles: [
			{
				id: 'pagos-f1',
				path: 'src/payments/payments.service.ts',
				language: 'typescript',
				snippet: `import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  async charge(orderId: string, amount: number) {
    const charge = await this.provider.createCharge({ orderId, amount });
    return this.repository.save(charge);
  }
}`
			},
			{
				id: 'pagos-f2',
				path: 'src/payments/payments.controller.ts',
				language: 'typescript',
				snippet: `import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post('charge')
  charge(@Body() body: { orderId: string; amount: number }) {
    return this.payments.charge(body.orderId, body.amount);
  }
}`
			},
			{
				id: 'pagos-f3',
				path: 'src/payments/schemas/payment.schema.ts',
				language: 'typescript',
				snippet: `import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true })
  orderId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'charged' })
  status: string;
}`
			}
		],
		commands: [
			{ id: 'pagos-c1', label: 'Levantar entorno', command: 'docker compose up' },
			{ id: 'pagos-c2', label: 'Migrar base de datos', command: 'npm run migrate' },
			{ id: 'pagos-c3', label: 'Correr tests', command: 'npm test' }
		],
		quickLinks: [
			{ id: 'pagos-l1', label: 'Swagger', url: 'https://swagger.example.com' },
			{ id: 'pagos-l2', label: 'Grafana', url: 'https://grafana.example.com' },
			{ id: 'pagos-l3', label: 'Sentry', url: 'https://sentry.example.com' }
		]
	},
	{
		id: 'portal-clientes',
		title: 'Portal de clientes',
		cluster: 'trabajo',
		role: 'director',
		status: 'activo',
		locked: false,
		stack: ['React', 'Node', 'PostgreSQL'],
		links: {
			repo: 'https://github.com/org/portal-clientes',
			board: 'https://linear.example.com/team/portal',
			cicd: 'https://github.com/org/portal-clientes/actions'
		},
		position: { x: 76, y: 56 },
		related: ['plataforma-pagos'],
		docs: [
			{
				id: 'portal-doc-1',
				title: 'Onboarding',
				content: `# Onboarding de clientes

El cliente se registra, verifica su email y configura su método de pago. El estado inicial es "pendiente de verificación".`
			}
		],
		bitacora: [
			{ id: 'portal-b1', date: '2026-10-13', text: 'Definimos la jerarquía de permisos por rol.' },
			{ id: 'portal-b2', date: '2026-10-08', text: 'Entregado el primer corte del dashboard.' }
		],
		environments: [
			{
				id: 'portal-dev',
				name: 'Dev',
				url: 'https://dev.portal.example.com',
				vars: [
					{ id: 'portal-dev-1', key: 'API_BASE_URL', value: 'https://dev-api.portal.example.com' },
					{ id: 'portal-dev-2', key: 'AUTH0_DOMAIN', value: 'portal-dev.auth0.com' }
				]
			},
			{
				id: 'portal-prod',
				name: 'Producción',
				url: 'https://portal.example.com',
				vars: [
					{ id: 'portal-prod-1', key: 'API_BASE_URL', value: 'https://api.portal.example.com' },
					{ id: 'portal-prod-2', key: 'AUTH0_DOMAIN', value: 'portal.auth0.com' }
				]
			}
		],
		codeFiles: [
			{
				id: 'portal-f1',
				path: 'src/pages/Dashboard.tsx',
				language: 'jsx',
				snippet: `export function Dashboard() {
  const { data } = useQuery('stats', fetchStats);

  return (
    <main>
      <h1>Panel de control</h1>
      <StatsGrid stats={data} />
    </main>
  );
}`
			}
		],
		commands: [
			{ id: 'portal-c1', label: 'Levantar entorno', command: 'docker compose up' },
			{ id: 'portal-c2', label: 'Build de producción', command: 'npm run build' }
		],
		quickLinks: [
			{ id: 'portal-l1', label: 'Swagger', url: 'https://swagger.example.com' },
			{ id: 'portal-l2', label: 'Sentry', url: 'https://sentry.example.com' }
		]
	},
	{
		id: 'integraciones-api',
		title: 'API de integraciones',
		cluster: 'trabajo',
		role: 'colaborador',
		status: 'activo',
		locked: true,
		stack: ['NestJS', 'Kafka'],
		links: {
			repo: 'https://github.com/org/integraciones-api',
			board: '',
			cicd: ''
		},
		position: { x: 71, y: 82 },
		related: ['plataforma-pagos'],
		docs: [
			{
				id: 'integ-doc-1',
				title: 'Colas',
				content: `# Colas de mensajes

Cada integración publica en su tópico de Kafka. Los consumidores son idempotentes y reintentan con backoff exponencial.`
			}
		],
		bitacora: [
			{ id: 'integ-b1', date: '2026-10-05', text: 'Arrancó el desarrollo de la integración con el ERP.' }
		],
		environments: [
			{
				id: 'integ-dev',
				name: 'Dev',
				url: '',
				vars: [{ id: 'integ-dev-1', key: 'KAFKA_BROKERS', value: 'kafka://dev-broker:9092' }]
			}
		],
		codeFiles: [],
		commands: [],
		quickLinks: []
	}
];

export function getProject(id) {
	return projects.find((p) => p.id === id);
}

export function getProjects() {
	return projects;
}

export function projectsByCluster(cluster) {
	return projects.filter((p) => p.cluster === cluster);
}

// Carga de contenido 0-10: proxy de docs + notas + secretos + entornos.
// Determina el brillo del nodo en la constelación.
export function projectLoad(project) {
	const varCount = (project.environments || []).reduce(
		(n, env) => n + (env.vars?.length || 0),
		0
	);
	const total =
		(project.docs?.length || 0) +
		(project.bitacora?.length || 0) +
		varCount +
		(project.environments?.length || 0);
	return Math.max(0, Math.min(10, total));
}
