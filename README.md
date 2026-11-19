# 🏊 Planilla Polideportivo

Aplicación web para armar la planilla semanal de turnos del personal de un polideportivo y calcular automáticamente la liquidación de sueldos, con datos compartidos en tiempo real entre varios usuarios.

🔗 **Demo en vivo:** https://polideportivo-demo.vercel.app

> **Credenciales de demo**
> Email: `demo@polideportivo-demo.com`
> Contraseña: `Demo2026!`

## Sobre este proyecto

Este sistema nació como un **proyecto real**: lo desarrollé para reemplazar la planilla de Excel que se usaba cada temporada de verano en un polideportivo municipal, donde la persona a cargo y su jefe necesitaban compartir y consultar los horarios y sueldos del personal.

Este repositorio es una **versión clonada y modificada** del proyecto original. Para no comprometer la confidencialidad ni exponer información sensible, se reemplazaron:

- el nombre y el logo de la institución (el polideportivo "Costa Verde" y su logo son ficticios),
- los nombres del personal,
- los valores de hora y de sueldo,
- el proyecto de Firebase y sus credenciales.

Toda la información que aparece en la demo es inventada. El código y la funcionalidad son los mismos que en la versión real.

## Funcionalidades

- **Planilla semanal editable:** grilla de días y turnos (primer turno, refuerzo y segundo turno) donde se asigna al personal en cada horario.
- **Dos tipos de personal:** profesor / guardavidas y estudiante, cada uno con su propio valor hora.
- **Tarifas diferenciadas:** valor hora distinto para días de semana y para fines de semana o feriados.
- **Lluvia o cancelación por turno:** si llueve o se cancela un turno, se cobra un porcentaje configurable solo de ese turno; los anteriores se cobran completos.
- **Duración de turnos:** se escribe el horario (por ejemplo `14:30 a 17:15`) y las horas se calculan solas.
- **Liquidación semanal:** horas y total de cada persona, separando semana, fin de semana y lluvia.
- **Cierre de semana:** se puede cerrar y congelar una semana para que cambios posteriores en las tarifas no alteren sueldos ya liquidados.
- **Resumen mensual:** selector de mes con el total por persona y por semana.
- **Vista de horarios:** cronograma semanal listo para mirar o imprimir.
- **Gestión de personal y configuración:** altas, bajas y edición de personas, tarifas y turnos.
- **Datos en tiempo real:** lo que carga un usuario lo ve el otro al instante.
- **Acceso con usuario y contraseña.**

## Tecnologías

- HTML, CSS y JavaScript (módulos ES), sin framework ni paso de compilación
- Firebase Authentication (email y contraseña)
- Cloud Firestore (base de datos en tiempo real)
- Vercel (despliegue)

## Estructura

```
├── index.html          # Página principal y pantalla de login
├── styles.css          # Estilos
├── logo.svg            # Logo ficticio
├── firestore.rules     # Reglas de seguridad de Firestore
└── src/
    ├── app.js          # Lógica, eventos y sincronización con Firebase
    ├── state.js        # Datos por defecto y cálculo de sueldos
    ├── views.js        # Pantallas de la aplicación
    └── firebase.js     # Configuración de Firebase
```

## Autora

Desarrollado por **Sol Prinzen**
