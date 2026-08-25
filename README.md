# Owlbear Character sheet for Dragonbane RPG

This is a comprehensive character sheet extension built for Owlbear Rodeo. For full instructions on use and features please see the [store.md](public/store.md)

## Building and development

### Caveats

  * I do not merge vibe-code PRs. If you didn't write your own code all you're doing is creating technical debt.
  * This application is configured to be built with [Deno](https://deno.land) rather than npm/yarn/bun etc

### Building

1. Install quasar globally with Deno using
```bash
deno install -g @quasar/cli
```

2. Modify the quasar startup script at ~/.deno/bin/quasar and either add the -A flag to grant all permissions or create a fine-tuned permission set in ~/.deno/bin/.quasar/deno.json and enable those permissions instead.

3. Clone this repository and run

```bash
deno install
```

Attempt a test build with either

```bash
deno task build
```

or

```bash
quasar b
```

If you encounter any initial build issues you may need to run ```deno task postinstall``` to ensure all build dependencies and env requirements are properly satisfied.
