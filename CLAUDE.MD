# ClassMate AI - Memoria del Proyecto

> Documento de contexto para Claude AI Assistant y José (agente experto)
> Última actualización: 2 de Enero de 2026

**📚 Documentos relacionados:**
- [CLAUDE.MD](CLAUDE.MD) - Este archivo (memoria técnica completa)
- [Project.MD](Project.MD) - Visión, propósito y research del proyecto
- [AGENT-EXPERT.MD](AGENT-EXPERT.MD) - Guía del agente experto José

### 📖 Cómo Usar Estos Documentos

**Para entender el "por qué" del proyecto:**
→ Lee [Project.MD](Project.MD) - Contiene la fundamentación educativa, research académico, y propósito del sistema

**Para entender el "cómo" técnico:**
→ Lee este archivo (CLAUDE.MD) - Arquitectura, Firebase schema, bugs resueltos, convenciones de código

**Para obtener ayuda experta:**
→ Usa `@jose` siguiendo las instrucciones en [AGENT-EXPERT.MD](AGENT-EXPERT.MD) - Agente especializado en Node.js, React, Firebase e IA educativa

**Flujo recomendado para nuevos colaboradores:**
1. Project.MD → Entender el problema educativo y visión
2. CLAUDE.MD → Familiarizarse con arquitectura técnica
3. src/App.js → Revisar código principal
4. @jose → Pedir ayuda cuando necesites implementar features

---

## 📋 Resumen Ejecutivo

**ClassMate AI** es un sistema de asistencia en el aula que permite a estudiantes hacer preguntas anónimas durante clases en tiempo real, recibir respuestas simuladas por IA (método Wizard of Oz), y proporciona analytics a profesores sobre confusion hotspots y engagement.

### Visión del Proyecto (ver [Project.MD](Project.MD) para detalles completos)

**Problema identificado (respaldado por research):**
- Los profesores hacen 300-400 preguntas/día vs estudiantes 1 pregunta/semana (Almeida, 2012)
- 80%+ de estudiantes evitan preguntar por miedo al juicio social o quieren resolver problemas solos (van der Meij, 1988)
- Brecha entre lo que profesores creen que estudiantes entienden vs realidad
- Estudiantes normalizan independencia y temen juicio negativo de sus pares
- Bajos niveles de preguntas estudiantiles correlacionan con menor rendimiento académico

**Nuestra solución:**
- Canal de comunicación anónima en tiempo real (elimina barreras psicológicas)
- AI responde preguntas basadas en curriculum del profesor (continuidad pedagógica)
- Dashboard de "confusion hotspots" para el profesor (visibilidad en tiempo real)
- Post-class insights sobre engagement y patrones de aprendizaje
- Sistema híbrido: AI + educador profesional para insights valiosos y confiables
- Tecnología como actividad que agrega valor, no como reemplazo

### Estado Actual del Proyecto
- ✅ Versión funcional desplegada localmente
- ✅ Bug de confusion hotspots corregido (2 Ene 2026)
- 🚧 En fase de prototyping con Wizard of Oz testing
- 📝 Preparado para integración futura de IA real

---

## 🎯 Objetivos y Propósito del Proyecto

### Objetivo Principal
Mejorar el engagement estudiantil y la comprensión del profesor sobre el proceso de aprendizaje mediante tecnología que **agrega valor** sin reemplazar al educador.

### Research Questions (ver [Project.MD](Project.MD) para contexto completo)

**Preguntas de investigación principales:**
1. ¿El anonimato aumenta la participación estudiantil y elimina barreras psicológicas?
2. ¿Los confusion hotspots ayudan al profesor a ajustar su enseñanza en tiempo real?
3. ¿Los estudiantes confían en las respuestas proporcionadas por el sistema AI?
4. ¿Qué patrones de confusión emergen durante las clases?
5. ¿Cómo se compara el engagement digital con la percepción del profesor?
6. ¿El sistema permite identificar estudiantes que "necesitan atención"?

**Método de investigación:**
- Wizard of Oz testing (operador humano simula IA)
- Permite evaluar confianza en IA sin implementarla completamente
- Facilita iteración rápida del diseño UX
- Genera insights sobre qué características de IA serán más valiosas

### Stakeholders y Beneficios

**Estudiantes:**
- Preguntar sin miedo al juicio (elimina exposición social)
- Respuestas inmediatas durante clase (no después en homework/tests)
- Clarificación de conceptos en tiempo real
- Canal de comunicación sin vulnerabilidad ante el profesor
- Fomenta cultura de hacer preguntas vs pretender que se entiende

**Profesores:**
- Visibilidad en tiempo real de confusion hotspots
- Insights post-clase sobre engagement (activos vs inactivos)
- Identificar estudiantes que necesitan atención
- Ver razonamiento y patrones de pensamiento de estudiantes
- Datos para mejorar pedagogía y planificar futuras clases
- Entender brecha entre percepción y realidad de comprensión
- Capacidad de re-explicar conceptos confusos durante la clase

**Sistema educativo:**
- Mejores outcomes de aprendizaje (research muestra correlación entre preguntas y rendimiento)
- Integración suave de tecnología en el aula (sin reemplazar educador)
- Research sobre patrones de aprendizaje y adquisición de conocimiento tácito
- Transición hacia tecnología como valor agregado
- Ciclo virtuoso: mejor comprensión → enseñanza más efectiva → mayor engagement

---

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico

**Frontend:**
- React 18.2.0
- Tailwind CSS (vía CDN)
- Single Page Application (SPA)

**Backend:**
- Firebase Realtime Database
- No servidor tradicional (serverless)

**Infraestructura:**
- Node.js 24.12.0
- npm 11.6.2
- Git (usuario: amarazioli)

### Estructura del Proyecto

```
ClassMateCode/
├── public/
│   └── index.html           # HTML base con Tailwind CDN
├── src/
│   ├── App.js              # Componente principal (1033 líneas)
│   └── index.js            # Entry point de React
├── package.json            # Dependencias del proyecto
├── .gitignore
├── README.md
└── CLAUDE.MD              # Este archivo
```

### Componentes Principales (src/App.js)

```javascript
App
├── LandingPage          // Página de inicio con selección de roles
├── StudentView          // Interfaz para estudiantes
├── OperatorView         // Panel Wizard of Oz (operador)
├── TeacherView          // Dashboard para profesores
└── AllViewsPage         // Vista demo con las 3 interfaces
```

---

## 🔥 Firebase Database Schema

```javascript
sessions/
  class-session-1/           // ID de sesión hardcodeado
    ├── messages/            // Todas las conversaciones
    │   └── [messageId]/
    │       ├── id           // ID único del mensaje
    │       ├── type         // 'student' o 'ai'
    │       ├── text         // Contenido del mensaje
    │       ├── timestamp    // Unix timestamp
    │       ├── studentId    // ID del estudiante
    │       ├── studentName  // Nombre del estudiante
    │       ├── status       // 'pending' | 'solved' | 'flagged'
    │       ├── replyTo      // ID del mensaje al que responde (solo AI)
    │       ├── confusionTopic  // Tema de confusión (opcional)
    │       ├── feedbackGiven   // Boolean
    │       ├── feedbackType    // 'solved' | 'flagged'
    │       ├── isFollowUp      // NUEVO: Boolean - si es follow-up (2 min window)
    │       └── followsUpOn     // NUEVO: messageId - ID de pregunta anterior
    │
    ├── queue/               // Cola de preguntas pendientes
    │   └── [messageId]      // Copia del mensaje student
    │
    ├── students/            // Estudiantes conectados
    │   └── [studentId]/
    │       ├── name
    │       ├── joinedAt
    │       ├── active
    │       ├── lastActivity
    │       └── questionsAsked
    │
    ├── confusion/           // Contadores de confusion por tema
    │   └── [topic]/
    │       └── count        // Número de veces que se flaggeó
    │
    └── flagged/             // Preguntas marcadas para profesor
        └── [flagId]/
            ├── id
            ├── questionId   // ID del mensaje original
            ├── text         // Texto de la pregunta
            ├── topic        // Tema de confusión
            ├── timestamp
            ├── aiResponse   // Respuesta que dio el AI
            ├── studentId
            └── studentName
```

### Firebase Configuration
- **Database URL:** `https://classmate-ai-41020-default-rtdb.europe-west1.firebasedatabase.app`
- **Project ID:** `classmate-ai-41020`
- **Region:** Europe West 1

---

## 👥 Roles del Sistema

### 1. Student (Estudiante)
**URL:** `#student`

**Funcionalidades:**
- Seleccionar identidad de lista predefinida (10 estudiantes)
- Hacer preguntas anónimas en tiempo real
- Recibir respuestas del "AI" (operador)
- **NUEVO:** Ver indicador animado "AI is thinking..." mientras espera respuesta
- Dar feedback: "Yes, solved!" o "Flag for teacher"
- Ver historial de su conversación

**Características:**
- Las preguntas son anónimas para otros estudiantes
- El profesor puede ver quién preguntó (para analytics)
- Interfaz de chat limpia y simple
- **NUEVO:** Follow-up questions se trackean automáticamente (si pregunta en <2 min)

### 2. Operator (Operador - Wizard of Oz)
**URL:** `#operator`

**Funcionalidades:**
- Ver cola de preguntas pendientes en tiempo real
- **NUEVO:** Detección automática de preguntas duplicadas con alerta visual
- **NUEVO:** Botón "Reuse previous answer" para preguntas similares
- **NUEVO:** Indicador de follow-up questions (preguntas dentro de 2 minutos)
- Seleccionar tema de confusión (opcional): "Quadratic Formula", "Factoring", etc.
- Escribir respuestas simulando ser IA
- Quick replies predefinidas
- Las respuestas aparecen como "AI" para los estudiantes

**Proceso:**
1. Pregunta llega al queue
2. **NUEVO:** Sistema detecta si es similar a preguntas anteriores (50% word overlap)
3. **NUEVO:** Sistema detecta si es follow-up del mismo estudiante
4. Operador selecciona pregunta
5. Operador selecciona tema (opcional)
6. Operador escribe respuesta (o reutiliza respuesta anterior)
7. Respuesta se envía al estudiante como "AI"

### 3. Teacher (Profesor)
**URL:** `#teacher`

**Funcionalidades:**

**Modo Live:**
- Ver métricas en tiempo real:
  - Número de estudiantes conectados
  - Total de preguntas
  - Preguntas resueltas
  - Preguntas flagged
- **Confusion Hotspots:** Visualización de temas que causan más confusión
- Sugerencias automáticas cuando un tema tiene 2+ flags

**Modo Post-Class:**
- Lista de estudiantes participantes
- Todas las preguntas con sus estados
- Estadísticas de la sesión

### 4. All Views (Demo)
**URL:** `#all`

Muestra las 3 interfaces (Student, Operator, Teacher) lado a lado para demos y testing.

---

## 🔄 Flujo de Datos Principal

### 1. Estudiante hace pregunta
```javascript
sendMessage() {
  1. Crear mensaje en /messages con status='pending'
  2. Agregar a /queue
  3. Actualizar /students/{id}/lastActivity
}
```

### 2. Operador responde
```javascript
sendReply() {
  1. Crear respuesta AI en /messages con replyTo=questionId
  2. Incluir confusionTopic si fue seleccionado
  3. Remover de /queue
}
```

### 3. Estudiante da feedback
```javascript
handleFeedback(type) {
  1. Actualizar mensaje AI con feedbackGiven=true
  2. Actualizar mensaje estudiante con status=type

  Si type === 'flagged' && confusionTopic:
    3. Incrementar /confusion/{topic}/count (ATOMIC)
    4. Crear entrada en /flagged/
}
```

---

## 🐛 Bugs Corregidos

### Bug #1: Confusion Hotspots no aparecen (RESUELTO)
**Fecha:** 2 de Enero de 2026

**Problema:**
Cuando estudiantes flaggeaban preguntas, a veces no aparecían en confusion hotspots.

**Causa Raíz:**
1. **Lookup de mensaje local:** El código buscaba el mensaje original en el state local de React (`messages.find()`), que podía estar desincronizado con Firebase.
2. **Race condition:** Uso de `onValue` + `set` en lugar de transacciones atómicas para incrementar contadores.

**Solución Implementada:**

```javascript
// ANTES (línea 322):
const originalQuestion = messages.find(m => m.id === studentMsgId);

// DESPUÉS (línea 329-347):
const questionRef = ref(db, `sessions/${SESSION_ID}/messages/${studentMsgId}`);
onValue(questionRef, (snapshot) => {
  const originalQuestion = snapshot.val();
  // ... crear flagged entry
}, { onlyOnce: true });
```

```javascript
// ANTES (líneas 316-320):
onValue(confusionRef, (snapshot) => {
  const current = snapshot.val()?.count || 0;
  set(confusionRef, { count: current + 1 });
}, { onlyOnce: true });

// DESPUÉS (líneas 318-323):
runTransaction(confusionRef, (current) => {
  if (current) {
    return { count: (current.count || 0) + 1 };
  } else {
    return { count: 1 };
  }
});
```

**Archivos modificados:**
- `src/App.js` (líneas 3, 316-347)
  - Añadido `runTransaction` al import de Firebase
  - Reemplazado lookup local por lectura directa de Firebase
  - Implementado transacción atómica para contadores

**Estado:** ✅ Resuelto y testeado

---

## 🎯 Features Clave

### 1. Anonimato Selectivo
- Preguntas anónimas entre estudiantes
- Profesor puede ver autoría (para analytics)

### 2. Confusion Hotspots
- Detección automática de temas problemáticos
- Visualización en barras de progreso
- Sugerencias automáticas al profesor

### 3. Real-time Sync
- Todos los datos sincronizan en tiempo real
- Firebase listeners en todos los componentes
- Sin necesidad de refrescar

### 4. Wizard of Oz (Mejoras implementadas 2 Ene 2026)
- Operador humano simula IA
- Estudiantes creen que es IA real
- Útil para research y testing

**Mejoras Wizard of Oz implementadas:**

**Mejora #5 - Detección de Duplicados:**
- Algoritmo de word overlap (50% similitud)
- Alerta visual automática cuando pregunta es similar a otra
- Botón "Reuse previous answer" para eficiencia del operador
- Filtra palabras cortas (<3 caracteres) para mejor precisión
- Muestra preview de pregunta similar detectada

**Mejora #7 - Tracking de Follow-ups:**
- Detección automática de follow-up questions (ventana de 2 minutos)
- Campo `isFollowUp: boolean` en Firebase para cada pregunta
- Campo `followsUpOn: messageId` para rastrear cadena de preguntas
- Indicador visual "↩️ Follow-up question" en OperatorView
- Útil para medir efectividad de respuestas y engagement

**Mejora #11 - Indicador "AI is thinking...":**
- Indicador animado con 3 puntos parpadeantes
- Se muestra mientras estudiante espera respuesta del AI
- Mejora UX y mantiene engagement
- CSS animations para efecto profesional
- Solo visible cuando pregunta está en queue sin respuesta aún

### 5. Analytics Básicos
- Engagement de estudiantes
- Rate de resolución de preguntas
- Temas más confusos

---

## 🚀 Features Planeadas (Ideas)

### Análisis con IA
1. **Clasificador automático de preguntas** (NLP)
2. **Detector de urgencia**
3. **Evaluador de calidad de respuestas**

### Asistencia Inteligente
4. **Auto-sugerencias de respuestas**
5. **Predictor de confusión**
6. **Agrupación inteligente de preguntas similares**

### Analytics Avanzados
7. **Predictor de engagement**
8. **Análisis de learning paths**
9. **Detector de misconceptions**

### UX Mejorado
10. **Chatbot assistant para profesor**
11. **UI adaptativa según contexto**
12. **Input por voz**

---

## 📦 Dependencias del Proyecto

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "firebase": "^10.7.0"
  }
}
```

### Scripts Disponibles
```bash
npm start    # Ejecutar dev server (puerto 3000)
npm build    # Build para producción
```

---

## 🔧 Configuración del Entorno

### Node.js
- Versión: 24.12.0 LTS
- Instalado vía: winget (Windows)
- PATH configurado: `C:\Program Files\nodejs`

### Git
- Usuario: `amarazioli`
- Email: `amarazioli@users.noreply.github.com`
- Repositorio: https://github.com/amarazioli/classmate-ai.git

### Servidor de Desarrollo

**⚠️ IMPORTANTE: Método correcto para iniciar el servidor desde Claude Code**

El entorno Git Bash de Claude tiene problemas de PATH con Node.js. El ÚNICO método que funciona es:

**Método 1 (Recomendado - PowerShell Script):**
```bash
# Crear script temporal y ejecutarlo
# 1. Crear archivo start-dev-server.ps1 con:
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH
Set-Location "C:\Users\amara\Downloads\ClassMateCode"
& "C:\Program Files\nodejs\npm.cmd" start

# 2. Ejecutar:
powershell.exe -ExecutionPolicy Bypass -File "C:\Users\amara\Downloads\ClassMateCode\start-dev-server.ps1"
```

**Método 2 (Batch file existente):**
```bash
# Ejecutar el script start-server.bat (ya existe en el proyecto)
cmd.exe /c "C:\Users\amara\Downloads\ClassMateCode\start-server.bat"
```

**❌ MÉTODOS QUE NO FUNCIONAN:**
- `npm start` directo desde Git Bash (PATH issues)
- `powershell.exe -Command "npm start"` (PowerShell no hereda PATH)
- Configurar PATH con `export` o `set` (no persiste)

**Verificar que el servidor está corriendo:**
```bash
netstat -ano | findstr :3000
# Debe mostrar: TCP 0.0.0.0:3000 ... LISTENING
```

**Servidor accesible en:**
- Local: http://localhost:3000
- Red: http://192.168.1.50:3000

---

## 📝 Convenciones de Código

### Estilo de Componentes
- Functional components con hooks
- State management local (useState, useEffect)
- Firebase listeners con cleanup en useEffect

### Naming Conventions
- Componentes: PascalCase (`StudentView`)
- Funciones: camelCase (`handleFeedback`)
- Constantes: UPPER_SNAKE_CASE (`SESSION_ID`)

### Firebase Operations
- Usar `runTransaction` para operaciones atómicas
- Incluir `{ onlyOnce: true }` para lecturas únicas
- Siempre limpiar listeners en useEffect cleanup

---

## 🎨 Design System

### Colores Principales
- **Student:** Azul (`#3b82f6` → `#2563eb`)
- **Teacher:** Verde (`#34d399` → `#059669`)
- **Operator:** Rojo (`#f87171` → `#dc2626`)
- **Background:** Slate (`#eff3f7`, `#1e293b`, `#0f172a`)

### Gradientes
```css
linear-gradient(135deg, color1 0%, color2 100%)
linear-gradient(145deg, #1e293b 0%, #0f172a 100%)
```

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Estudiante puede hacer pregunta
- [ ] Operador ve pregunta en queue
- [ ] Operador puede responder con/sin topic
- [ ] Estudiante recibe respuesta
- [ ] Feedback "solved" funciona
- [ ] Feedback "flagged" incrementa confusion
- [ ] Confusion hotspots aparecen en teacher view
- [ ] Reset session limpia todos los datos

### Test Participants (Hardcoded)
```javascript
const TEST_PARTICIPANTS = [
  { id: "emma", name: "Emma V." },
  { id: "lucas", name: "Lucas D." },
  { id: "sophie", name: "Sophie M." },
  // ... 7 más (total 10)
];
```

---

## 🔐 Seguridad y Consideraciones

### Firebase Security Rules
⚠️ **PENDIENTE:** Implementar Firebase Security Rules
- Actualmente la database es pública (solo para desarrollo)
- Necesario implementar antes de producción

### API Keys
⚠️ Las API keys de Firebase están en `src/App.js` (líneas 8-16)
- Esto es OK para Realtime Database con security rules
- Considerar moverlas a `.env` en producción

---

## 📚 Recursos y Referencias

### Documentación
- [Firebase Realtime Database](https://firebase.google.com/docs/database)
- [React Hooks](https://react.dev/reference/react)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Conceptos Clave
- **Wizard of Oz:** Técnica de research donde humanos simulan IA
- **Confusion Hotspots:** Visualización de temas problemáticos
- **Anonymous Questions:** Preguntas anónimas para reducir miedo

---

## 🎓 Contexto Educativo y Research

### Fundamentación del Proyecto (ver [Project.MD](Project.MD))

**Problema educativo identificado:**
- Disparidad 300-400 : 1 en preguntas profesor vs estudiante (Almeida, 2012)
- 80%+ estudiantes evitan pedir ayuda por normas de independencia o miedo al juicio (van der Meij, 1988)
- Métricas tradicionales (homework, tests) ocurren después de clase → confusión se acumula
- Profesores no tienen forma de medir comprensión real en tiempo real

**Objetivo Pedagógico:**
Fomentar participación de estudiantes que no se animan a preguntar en clase por:
- Miedo al ridículo y juicio social
- Timidez o introversión
- Percepción de que sus preguntas son "básicas" o "tontas"
- Normas internalizadas de independencia

**Innovación educativa:**
- Confidencialidad del chatbot elimina barreras psicológicas
- Responsividad e interactividad aumentan engagement
- Canal anónimo permite vulnerabilidad sin exposición
- Sistema híbrido mantiene credibilidad del educador profesional

### Características del Sistema Basadas en Research

**Anonimato selectivo:** Estudiantes anónimos entre sí, pero profesor puede ver autoría para analytics (no para juzgar)

**Filtros de seguridad:** Preguntas vulgares u ofensivas bloqueadas para fomentar confianza del educador

**Respuestas basadas en curriculum:** AI solo responde con materiales del profesor (textbooks, slides) para garantizar continuidad pedagógica

**Flagging inteligente:** Preguntas que AI no puede responder con confianza se escalan al profesor

**Post-class insights:** Permite identificar estudiantes inactivos que "necesitan atención"

---

## 🤖 Agente Experto José

### Invocación
Usar sintaxis `@jose [tipo] [descripción]` para activar modo experto.
Ver [AGENT-EXPERT.MD](AGENT-EXPERT.MD) para guía completa del agente.

### Tipos de Tareas
- `feature`: Implementar nueva funcionalidad
- `improve`: Mejorar código existente
- `debug`: Resolver problemas
- `ideate`: Idear features con IA
- `architect`: Consultoría arquitectura
- `review`: Code review

### Expertise
- Node.js y React (hooks, performance, patterns)
- Firebase (Realtime DB, transactions, optimization)
- IA en Educación (NLP, analytics, adaptive learning)
- UX/UI Educativo (a11y, mobile, real-time feedback)

---

## 📊 Métricas del Proyecto

### Código
- **Total líneas:** ~1100
- **Archivo principal:** App.js (1033 líneas)
- **Componentes:** 5 principales
- **Hooks usados:** useState, useEffect, useRef

### Firebase
- **Colecciones:** 5 (messages, queue, students, confusion, flagged)
- **Listeners activos:** ~8 (dependiendo de vistas abiertas)
- **Operaciones:** Reads, writes, transactions

---

## 🔄 Historial de Cambios

### 2 de Enero de 2026
- ✅ Corregido bug de confusion hotspots
- ✅ Implementado `runTransaction` para contadores atómicos
- ✅ Mejorado lookup de mensajes (Firebase directo vs local state)
- ✅ Añadido error handling con `.catch()`
- ✅ Configurado Git (usuario: amarazioli)
- ✅ Creado documento CLAUDE.MD (memoria técnica)
- ✅ Creado AGENT-EXPERT.MD (agente José)
- ✅ Integrado Project.MD en memoria permanente
- ✅ Añadida fundamentación educativa y research a documentación
- ✅ Actualizado cross-references entre los 3 documentos principales
- ✅ Instalado Claude Code CLI v2.0.76 (vía npm)
- ✅ Creado script helper `claude.sh` para ejecutar desde Git Bash
- ✅ Configurado PATH de Windows para incluir npm global
- ✅ Implementadas 3 mejoras Wizard of Oz: Mejora #5 (detección duplicados), #7 (tracking follow-ups), #11 (indicador "AI thinking")
- ✅ Documentado método correcto para iniciar servidor de desarrollo

### Histórico Anterior
- Implementación inicial del sistema
- Integración con Firebase
- Diseño de las 4 vistas principales
- Sistema de confusion hotspots

---

## 💡 Notas para Claude

### Cuando trabajas en este proyecto:
1. **Leer este archivo primero** para contexto técnico completo
2. **Leer [Project.MD](Project.MD)** para entender visión y research questions
3. **Usar @jose** para tareas específicas (ver [AGENT-EXPERT.MD](AGENT-EXPERT.MD))
4. **Revisar** `src/App.js` antes de modificar
5. **Considerar** impacto en Firebase (lecturas/escrituras)
6. **Mantener** diseño consistente con colores establecidos
7. **Testear** con las 3 vistas abiertas simultáneamente
8. **Recordar** que estamos en fase Wizard of Oz (no IA real aún)

### Archivos Clave

**Código:**
- `src/App.js` - Todo el código de la aplicación
- `public/index.html` - HTML base con Tailwind CDN
- `package.json` - Dependencias
- `.gitignore` - Archivos ignorados por Git

**Documentación:**
- `CLAUDE.MD` - Este archivo (memoria técnica)
- `Project.MD` - Visión, research, propósito educativo
- `AGENT-EXPERT.MD` - Guía del agente experto José
- `README.md` - Descripción básica del proyecto

### Firebase Paths Importantes
```javascript
const SESSION_ID = "class-session-1";  // Hardcoded session ID

// Paths principales:
`sessions/${SESSION_ID}/messages`
`sessions/${SESSION_ID}/queue`
`sessions/${SESSION_ID}/students`
`sessions/${SESSION_ID}/confusion`
`sessions/${SESSION_ID}/flagged`
```

---

## 📞 Contacto del Proyecto

**Desarrollador:** Amara Zioli
- GitHub: [@amarazioli](https://github.com/amarazioli)
- Repositorio: https://github.com/amarazioli/classmate-ai.git

---

*Este documento es una memoria viva del proyecto y se actualiza conforme evoluciona ClassMate AI.*
