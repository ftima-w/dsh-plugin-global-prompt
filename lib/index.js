/**
 * dsh-plugin-global-prompt-switch — Host (server) half.
 *
 * Registers two *volatile* Config fields (`enabled`, `text`) and injects the
 * text as a global system-prompt section while the switch is on.
 *
 * Why this shape makes the switch work everywhere, immediately:
 *
 * - `volatile()` fields are projected by `ctx.settings` into the Settings form
 *   for this profile entry, and a write to them is applied by the Loader
 *   through its volatile-only path (`_commitVolatile`): the running fiber's
 *   config references are updated **in place**, without remounting the plugin.
 *   So toggling in Settings takes effect in the running process.
 * - The section `text` is a function, not a string. `systemPrompt.assemble()`
 *   is called for every model step of every agent (agent-loop's `preStep`), so
 *   the function is re-evaluated each step and reads the latest value from the
 *   reference. A section registered on this plugin's (global) context applies
 *   to every scope, which is what makes it reach **existing sessions** on
 *   their next step, new sessions, and sub-agents alike.
 * - `interpolate: false` keeps user text literal, so a `{{...}}` sequence in
 *   the prompt can never fail prompt-variable resolution.
 *
 * @module dsh-plugin-global-prompt-switch
 */

import z from '@deepseek-ai/schemastery';

/** Prompt section name; deliberately distinct from the legacy plugin's. */
const SECTION_NAME = 'user:global-prompt-switch';

/** Placement fallback used when the section-order helper is unavailable. */
const FALLBACK_ORDER = 5;

/** Offset from the deployment persona: just after it, before tool policy. */
const ORDER_OFFSET = 5;

/** Upper bound protecting the model context from an accidental giant paste. */
const MAX_LENGTH = 20000;

/**
 * Live configuration. Both fields are volatile so a Settings write updates the
 * running plugin instead of restarting it; the defaults keep the feature off.
 */
export const Config = z.object({
  enabled: z.boolean().default(false).volatile(),
  text: z.string().default('').max(MAX_LENGTH).volatile(),
});

/**
 * Resolve the section position relative to the deployment persona, so this
 * plugin lands after the persona but before tool policy even if the numeric
 * table changes in a future release.
 * @param systemPrompt - the prompt registry service.
 * @returns a finite sort order.
 */
function resolveOrder(systemPrompt) {
  try {
    const base = systemPrompt.getSectionOrder?.('DEPLOYMENT_PERSONA_PREFIX');
    if (Number.isFinite(base)) return base + ORDER_OFFSET;
  } catch {
    // An unknown placement name must not stop the plugin from loading.
  }
  return FALLBACK_ORDER;
}

/**
 * Read the current switch state from its live reference.
 * @param reference - volatile config reference for `enabled`.
 * @returns whether injection is on.
 */
function isEnabled(reference) {
  try {
    return reference?.get?.() === true;
  } catch {
    return false;
  }
}

/**
 * Read the current prompt text from its live reference.
 * @param reference - volatile config reference for `text`.
 * @returns the trimmed prompt, or an empty string when nothing is injected.
 */
function currentText(reference) {
  try {
    const value = reference?.get?.();
    return typeof value === 'string' ? value.trim() : '';
  } catch {
    return '';
  }
}

/** Required services: the prompt registry this plugin contributes to. */
export const inject = ['systemPrompt'];

/**
 * Inject the configured text as a global prompt section.
 * @param ctx - Host plugin context.
 * @param config - validated Config holding the volatile references.
 */
export function apply(ctx, config) {
  const enabled = config?.enabled;
  const text = config?.text;
  ctx.effect(() => ctx.systemPrompt.section({
    name: SECTION_NAME,
    order: resolveOrder(ctx.systemPrompt),
    interpolate: false,
    // Re-evaluated on every model step: the switch and the text are live.
    text: () => (isEnabled(enabled) ? currentText(text) : ''),
  }), 'global-prompt-switch: prompt section');
}
