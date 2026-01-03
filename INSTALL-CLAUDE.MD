# Guía de Instalación y Uso de Claude Code CLI

## ✅ Estado de la Instalación

Claude Code CLI **v2.0.76** está instalado y funcionando.

## 🚀 Cómo Usar Claude Code

### Opción 1: Usar el script helper (Recomendado para Git Bash)

Desde el directorio del proyecto:

```bash
./claude.sh --version
./claude.sh "tu pregunta aquí"
```

**Ejemplo:**
```bash
./claude.sh "Analiza el código de App.js y sugiere mejoras"
```

### Opción 2: Usar comando directo (PowerShell/CMD)

**IMPORTANTE:** Necesitas **cerrar y reabrir** tu terminal PowerShell para que el PATH se actualice.

Después de reiniciar PowerShell:

```powershell
claude --version
claude "tu pregunta aquí"
```

### Opción 3: Ruta completa (Funciona siempre)

```bash
"C:\Program Files\nodejs\node.exe" "C:\Users\amara\AppData\Roaming\npm\node_modules\@anthropic-ai\claude-code\cli.js" --version
```

## 📝 Configuración Permanente para Git Bash

El alias de `claude` se agregó a tu `~/.bashrc`. Para que funcione en **nuevas** sesiones de Git Bash:

1. Cierra Git Bash
2. Abre una nueva ventana de Git Bash
3. Ejecuta: `claude --version`

## 🔐 Autenticación (Próximo Paso)

Para usar Claude Code CLI completamente, necesitas autenticarte:

```bash
./claude.sh auth login
```

Esto te pedirá:
- Tu API key de Anthropic, O
- Te llevará al flujo de OAuth

**Requisitos:**
- Cuenta de Anthropic con billing activo, O
- Suscripción Claude Pro/Max

## 🤖 Usando el Agente José

Una vez autenticado, puedes usar José de dos formas:

### Forma 1: Directamente con el skill
```bash
./.claude/skills/jose.skill "feature: añadir notificaciones en tiempo real"
```

### Forma 2: A través de mí (Claude en VSCode)
Simplemente escribe en el chat:
```
@jose status
@jose feature: añadir sistema de notificaciones
```

## 📍 Ubicación de Archivos

- **Claude CLI instalado en:** `C:\Users\amara\AppData\Roaming\npm\node_modules\@anthropic-ai\claude-code`
- **Script helper:** `./claude.sh` (en la raíz del proyecto)
- **Skill de José:** `./.claude/skills/jose.skill`

## 🐛 Troubleshooting

### "claude: command not found" en Git Bash

**Solución:** Usa `./claude.sh` en lugar de `claude`

### "claude: command not found" en PowerShell

**Solución:** Cierra y reabre PowerShell (el PATH necesita recargarse)

### "node: command not found"

**Solución:** Usa la ruta completa a node.exe (Opción 3 arriba)

## 📚 Más Información

- [Documentación Claude Code](https://code.claude.com/docs)
- [CLAUDE.MD](CLAUDE.MD) - Memoria técnica del proyecto
- [AGENT-EXPERT.MD](AGENT-EXPERT.MD) - Guía completa de José
