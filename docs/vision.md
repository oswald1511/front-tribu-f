# Visión Unificada

| Campo                    | Valor      |
| ------------------------ | ---------- |
| **Tribu**                | F          |
| **Fecha de creación**    | 30/11/2025 |
| **Última actualización** | 30/11/2025 |

## Resumen Ejecutivo

EL Modulo de Carga de Horas permite que cada recurso pueda registrar, visualizar y gestionar las horas que dedica a cada tarea de un proyecto, y que esas horas después puedan ser usadas por Finanzas para calcular costos.
En esencia, el módulo busca poner orden donde antes había planillas sueltas, mails y cálculos manuales, y convertir todo ese caos en datos limpios que el resto del sistema pueda aprovechar.

El Módulo de Finanzas, en el alcance del MVP, se centra en el cálculo de costos de mano de obra a partir de horas cargadas por proyecto y los costos por hora de cada rol. Su objetivo es proveer el mínimo necesario para combinar horas y tarifas y construir el reporte básico de costo por recurso y por proyecto.

En esta primera iteración, Finanzas expone operaciones simples para configurar el costo por hora mensual de cada rol, aplicar incrementos porcentuales y obtener los costos consolidados por proyecto y período. Toda la información estructural de proyectos, tareas, roles y recursos se obtiene desde servicios externos controlados por el docente, sin almacenarse localmente, lo que mantiene el módulo liviano y enfocado en su responsabilidad principal: transformar horas en costos.

El módulo está diseñado para integrarse tempranamente con el módulo de Carga de Horas y con los servicios externos provistos, de modo que se pueda recorrer end-to-end el flujo “cargar horas → obtener costos → generar el reporte principal”.

## Funcionalidades Principales

### Funcionalidades Core

- Registro de horas por proyecto, tarea y fecha
  Cada recurso puede cargar su trabajo diario indicando proyecto → tarea → día → cantidad de horas.
- Validaciones de integridad:Asegurar que la tarea pertenezca al proyecto, evita duplicados, valida fechas y confirma que el recurso exista en la API externa.
- Tareas filtradas por proyecto: Al seleccionar un proyecto, solo se muestran las tareas asociadas a ese proyecto.
- Configuración de costo por hora mensual por rol: mantener una tabla de roles con su tarifa por hora para un mes determinado, sin gestión compleja de vigencias ni históricos detallados.
- Actualización masiva por incrementos porcentuales: posibilidad de aplicar un aumento porcentual a los costos por hora de uno o varios roles para un mes dado.
- Cálculo de costo de mano de obra por proyecto: combinar las horas cargadas (provenientes del módulo de Carga de Horas) con el costo por hora de cada rol para obtener el costo total por recurso y por proyecto en un período.
- Exposición de datos para reportes: API que permita obtener, para un proyecto y año determinados, el detalle de costo mensual por recurso (horas x tarifa), insumo principal para el reporte de costos del sistema.

### Funcionalidades Secundarias

- Operaciones de consulta para explorar costos históricos a nivel mes/proyecto/rol, sin filtros avanzados ni capacidades de exportación.
- Preparación de contratos y acuerdos futuros: dejar explícito el lugar donde, en versiones posteriores, se integrarán ingresos, facturación, licencias y otros costos, sin implementarlos en este MVP.
- Visualización, edición y eliminación de horas semanales
  El recurso ve su semana completa (lun–dom), puede modificar una carga existente o eliminarla, y todo se actualiza en tiempo real.

## Interacciones con Otros Módulos

### Módulos que este Módulo Consume

| Módulo / Sistema Externo | Tipo de Interacción | Descripción                                                                                                                                                                                                                          |
| ------------------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| API de Proyectos         | API externa         | Obtiene la lista de proyectos y sus identificadores para agrupar las horas y los costos; los proyectos no se persisten localmente.                                                                                                   |
| API de Tareas            | API externa         | Consulta tareas asociadas a proyectos cuando es necesario para el cálculo y la trazabilidad; las tareas no se almacenan en la base de datos de Finanzas.                                                                             |
| API de Roles             | API externa         | Consulta los roles válidos y sus IDs externos; Finanzas solo persiste el costo por hora mensual asociado a cada perfil. El módulo de Carga de Horas usa estos roles para calcular el costo de un proyecto en un determinado periodo. |
| API de Recursos          | API externa         | Consulta los recursos con su nombre, apellido y que tipo de rol cumple en un proyecto.                                                                                                                                               |

## Consideraciones Técnicas

### Tecnologías Principales

- Backend: servicio REST (tecnología específica a definir) para exponer operaciones de configuración de costos y cálculo de costos por proyecto.
- Base de datos relacional mínima para almacenar la tabla de costos por hora por rol y mes, y los resultados de cálculos cuando sea necesario cachearlos.
- Integración vía APIs con el módulo de Carga de Horas y con microservicios externos de proyectos, tareas y roles, sin replicar esos datos localmente.
-

### Dependencias Externas

- Microservicios externos de Proyectos, Tareas, Roles y Recursos, provistos por el docente, desde los que se consulta toda la información estructural sin almacenarla localmente.
- Servicios de autenticación/autorización corporativos para control de acceso básico y auditoría.

## Notas Adicionales

En el alcance reducido del MVP se dejan explícitamente fuera:

- Cualquier manejo de ingresos, facturación completa, impuestos, licencias, infraestructura u otros costos indirectos.
- Reglas complejas de vigencia, borrado lógico o reconstrucción histórica de proyectos, tareas, roles o recursos: esas reglas viven en los microservicios externos y no deben replicarse en este módulo.
- Validaciones avanzadas sobre la carga de horas (franjas horarias, estados de tareas, workflows de aprobación, límites diarios, gestión de ausencias o vacaciones).
- Almacenamiento local de información externa: proyectos, tareas, roles y recursos siempre se consultan en tiempo real a través de APIs externas.

El foco del MVP es soportar, de extremo a extremo, los casos de uso necesarios para:

- Registrar horas por tarea (en el módulo de Carga de Horas).
- Registrar y exponer costos por hora de cada rol, mes a mes.
- Calcular el costo de mano de obra combinando horas y tarifas por rol y período.
- Exponer el reporte de costos por proyecto y recurso/mes.

## Supuestos y Convenciones

- Todos los montos se registran en moneda "ARS" por defecto, salvo que se indique lo contrario.
- El formato de mes utilizado en todos los registros es "YYYY-MM".
- Los nombres de atributos siguen la convención snake_case.
- Los IDs son strings, los montos son decimales, y la moneda es string.

---

**Versión:** 2.1  
**Estado:** En revisión
