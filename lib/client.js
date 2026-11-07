window.__ModuleLoader__.load({
  id: 'dsh-plugin-global-prompt-switch',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const NS = 'settings.globalPromptSwitch';
    const SETTINGS_ENTRY = 'global-prompt-switch';
    const MAX_LENGTH = 20000;
    const DRAFT_KEY = 'dsh-plugin-global-prompt-switch:draft';
    const OPEN_KEY = 'dsh-plugin-global-prompt-switch:open';

    const zh = {
      'title': '全局提示词',
      'description': '开启后，下面的内容会注入到每一次对话的系统提示词里——已经开着的会话、新会话和子代理都生效。',
      'switchLabel': '启用全局提示词',
      'placeholder': '例如：始终使用中文回答；先给结论，再解释理由……',
      'hint': '点「保存」后下一条回复即生效，无需重启。',
      'count': '{n} / {max}',
      'save': '保存',
      'revert': '还原',
      'dirty': '有未保存的修改',
      'saved': '已保存',
      'saving': '保存中…',
      'error': '保存失败',
      'close': '关闭'
    };

    const en = {
      'title': 'Global prompt',
      'description': 'When on, the text below is added to the system prompt of every conversation.',
      'switchLabel': 'Enable global prompt',
      'placeholder': 'e.g. Always answer in Chinese.',
      'hint': 'Applies to the next reply after you save.',
      'count': '{n} / {max}',
      'save': 'Save',
      'revert': 'Revert',
      'dirty': 'Unsaved changes',
      'saved': 'Saved',
      'saving': 'Saving…',
      'error': 'Failed to save',
      'close': 'Close'
    };

    const css = [
      '.gpst-overlay{position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.28);pointer-events:auto}',
      '.gpst-panel{box-sizing:border-box;width:min(640px,calc(100vw - 48px));max-height:calc(100vh - 96px);overflow:auto;display:flex;flex-direction:column;gap:10px;padding:18px;border-radius:12px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-overlay);box-shadow:0 16px 48px rgba(0,0,0,.28)}',
      '.gpst-panel-head{display:flex;align-items:center;gap:12px}',
      '.gpst-title{color:var(--dsw-alias-label-primary);font-size:14px;line-height:20px}',
      '.gpst-description{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}',
      '.gpst-close{margin-left:auto;flex:none;width:24px;height:24px;padding:0;border:0;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary);font-size:16px;line-height:24px;cursor:pointer}',
      '.gpst-close:hover{background:var(--dsw-alias-bg-layer-2)}',
      '.gpst-switch-row{display:flex;align-items:center;justify-content:space-between;gap:16px;font-size:13px;color:var(--dsw-alias-label-primary)}',
      '.gpst-switch{box-sizing:border-box;position:relative;flex:0 0 auto;width:36px;height:20px;padding:2px;border:0;border-radius:999px;background:var(--dsw-alias-border-l2);cursor:pointer}',
      '.gpst-switch[aria-checked="true"]{background:var(--dsw-alias-brand-primary)}',
      '.gpst-switch:disabled{cursor:default;opacity:.5}',
      '.gpst-thumb{display:block;width:16px;height:16px;border-radius:50%;background:var(--dsw-alias-label-primary);transition:transform .12s ease}',
      '.gpst-switch[aria-checked="true"] .gpst-thumb{transform:translateX(16px)}',
      '.gpst-input-host{display:block}',
      '.gpst-input{box-sizing:border-box;width:100%;min-height:140px;resize:vertical;margin:0;padding:8px 12px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:1.5}',
      '.gpst-input:focus-visible{border-color:var(--dsw-alias-brand-primary);outline:none}',
      '.gpst-foot{display:flex;align-items:center;gap:8px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}',
      '.gpst-count{flex:none;font-variant-numeric:tabular-nums}',
      '.gpst-actions{margin-left:auto;display:flex;align-items:center;gap:8px;flex:none}',
      '.gpst-status{font-size:12px;line-height:18px}',
      '.gpst-btn{box-sizing:border-box;height:26px;padding:0 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:6px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;line-height:18px;cursor:pointer}',
      '.gpst-btn:disabled{opacity:.5;cursor:default}',
      '.gpst-btn-primary{border-color:transparent;background:var(--dsw-alias-brand-primary);color:var(--dsw-alias-label-primary-foreground)}',
      '.gpst-error{color:var(--dsw-alias-state-error-primary)}',
      // Laid out by the sidebar footer slot, not positioned by us, so it can
      // never overlap a neighbouring row.
      '.gpst-launch{box-sizing:border-box;display:flex;align-items:center;gap:8px;',
      'padding:6px 8px;border:0;border-radius:8px;background:transparent;',
      'color:var(--dsw-alias-label-secondary);font:inherit;font-size:13px;line-height:18px;',
      'cursor:pointer;text-align:left;white-space:nowrap}',
      '.gpst-launch:hover{background:var(--dsw-alias-bg-layer-2)}',
      '.gpst-launch-icon{flex:none;position:relative;width:16px;height:16px;border-radius:4px;',
      'border:1.5px solid currentColor;opacity:.75}',
      '.gpst-launch-icon::after{content:"";position:absolute;left:3px;right:3px;top:4px;height:1.5px;',
      'background:currentColor;box-shadow:0 3.5px 0 currentColor}',
      '.gpst-launch-on .gpst-launch-icon{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary);opacity:1}',
      '.gpst-launch-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
    ].join('');

    const STATE_KEY = Symbol.for('dsh-plugin-global-prompt-switch/state');
    const state = globalThis[STATE_KEY] ??= {
      focus: { wanted: false, caret: null },
      ime: { composing: false },
      panel: { open: false },
      textArea: null,
      draft: { text: null }
    };
    const focusMemory = state.focus;
    const ime = state.ime;

    function loadDraft() {
      try {
        const raw = globalThis.localStorage?.getItem(DRAFT_KEY);
        return typeof raw === 'string' ? raw : null;
      } catch (error) {
        return null;
      }
    }

    function saveDraft(text) {
      try {
        if (text === null) globalThis.localStorage?.removeItem(DRAFT_KEY);
        else globalThis.localStorage?.setItem(DRAFT_KEY, text);
      } catch (error) {
        return;
      }
    }

    if (state.draft.text === null) state.draft.text = loadDraft();
    try {
      if (globalThis.localStorage?.getItem(OPEN_KEY) === '1') state.panel.open = true;
    } catch (error) {
      state.panel.open = state.panel.open;
    }

    function initialText(persisted) {
      return state.draft.text === null ? persisted : state.draft.text;
    }

    function rememberDraft(text) {
      state.draft.text = text;
      saveDraft(text);
    }

    /** @returns the current visibility of the editor panel. */
    function getPanelOpen() {
      return state.panel.open;
    }

    /** Subscribers of the panel flag, so another slot can open the panel. */
    const panelFlagListeners = state.panel.listeners ??= new Set();

    /**
     * Subscribe to panel visibility.
     * @param listener - invoked after each change.
     * @returns the disposer removing it.
     */
    function subscribePanelFlag(listener) {
      panelFlagListeners.add(listener);
      return function () {
        panelFlagListeners.delete(listener);
      };
    }

    function setPanelOpen(next) {
      if (state.panel.open === next) return;
      state.panel.open = next;
      for (const listener of [...panelFlagListeners]) {
        try {
          listener();
        } catch (error) {
          // One failing subscriber must not block the rest.
        }
      }
      try {
        globalThis.localStorage?.setItem(OPEN_KEY, next ? '1' : '0');
      } catch (error) {
        return;
      }
    }

    function getSharedTextArea() {
      return state.textArea;
    }

    function ensureTextArea(persisted, t, handlers) {
      if (state.textArea === null) {
        const node = document.createElement('textarea');
        node.className = "gpst-input";
        node.rows = 8;
        node.spellcheck = false;
        node.setAttribute('aria-label', t('title'));
        node.setAttribute('maxlength', String(MAX_LENGTH));
        node.value = initialText(persisted);
        state.textArea = node;
      }
      const node = state.textArea;
      node.oninput = handlers.onChange;
      node.onkeydown = handlers.onKeyDown;
      node.onfocus = handlers.onFocus;
      node.onblur = handlers.onBlur;
      node.onselect = handlers.onSelect;
      node.oncompositionstart = function () {
        ime.composing = true;
      };
      node.oncompositionend = function () {
        ime.composing = false;
        rememberDraft(node.value === persisted ? null : node.value);
      };
      node.placeholder = t('placeholder');
      return node;
    }

    /**
     * Find the sidebar's "New session" button without depending on its class
     * names: it is the first button in the sidebar whose accessible name is the
     * new-session label and which is wide enough to be the primary action.
     * @returns the element, or null when the sidebar is collapsed or absent.
     */
    function insertStyles() {
      if (typeof document === 'undefined') return function () {};
      const tagId = 'dsh-plugin-global-prompt-switch/panel.css';
      const existing = document.querySelector("style[data-plugin-css=\"" + tagId + "\"]");
      if (existing !== null) return function () {};
      const tag = document.createElement('style');
      tag.dataset.plugin = 'dsh-plugin-global-prompt-switch';
      tag.dataset.pluginCss = tagId;
      tag.textContent = css;
      document.head.appendChild(tag);
      return function () {
        tag.remove();
      };
    }

    function GlobalPromptSurface(props) {
      const t = props.t;
      const useGlobalPrompt = props.useGlobalPrompt;
      const setEnabled = props.setEnabled;
      const setText = props.setText;

      // Observe the shared flag: the launcher is a different slot entry, so this
      // component must react to a change it did not make itself.
      const openState = React.useSyncExternalStore(
        subscribePanelFlag,
        getPanelOpen,
        getPanelOpen
      );
      const open = openState;
      const setOpen = function (next) {
        setPanelOpen(next);
        if (next) {
          focusMemory.wanted = true;
          focusMemory.caret = null;
          justMountedRef.current = true;
        }
      };

      const snapshot = useGlobalPrompt(function (v) { return v; });
      const value = (snapshot && snapshot.value) || {};
      const persisted = typeof value.text === 'string' ? value.text : '';
      const lengthState = React.useState(function () { return initialText(persisted).length; });
      const length = lengthState[0];
      const setLength = lengthState[1];
      const savePair = React.useState('idle');
      const saveState = savePair[0];
      const setSaveState = savePair[1];
      const hostRef = React.useRef(null);
      // True for the first layout pass of this mount only.
      const justMountedRef = React.useRef(true);

      React.useEffect(function () {
        if (!open) return undefined;
        const onKey = function (event) {
          if (event.key === 'Escape') setOpen(false);
        };
        document.addEventListener('keydown', onKey);
        return function () {
          document.removeEventListener('keydown', onKey);
        };
      }, [open]);

      const commit = function (next) {
        setSaveState('saving');
        Promise.resolve(setText(next)).then(function (accepted) {
          if (accepted !== false) rememberDraft(null);
          setSaveState(accepted === false ? 'error' : 'saved');
        }, function () {
          setSaveState('error');
        });
      };

      const onSave = function () {
        const node = getSharedTextArea();
        const text = node === null ? persisted : node.value;
        if (text === persisted) {
          rememberDraft(null);
          setSaveState('idle');
          return;
        }
        commit(text);
      };

      const onRevert = function () {
        rememberDraft(null);
        const node = getSharedTextArea();
        if (node !== null) node.value = persisted;
        setLength(persisted.length);
        setSaveState('idle');
      };

      React.useLayoutEffect(function () {
        const host = hostRef.current;
        if (host === null) return;
        const node = ensureTextArea(persisted, t, {
          onKeyDown: function (event) {
            if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
              event.preventDefault();
              onSave();
            }
          },
          onFocus: function () {
            focusMemory.wanted = true;
            focusMemory.caret = node.selectionStart;
          },
          onBlur: function () {
            if (typeof document === 'undefined' || document.contains(node)) {
              focusMemory.wanted = false;
            }
          },
          onChange: function (event) {
            const next = event.target.value;
            rememberDraft(next === persisted ? null : next);
            setLength(next.length);
            if (!ime.composing) setSaveState('idle');
          },
          onSelect: function () {
            // Remember where the caret is for a later reload restore. Reading
            // it is harmless; the layout effect decides whether to apply it.
            focusMemory.caret = node.selectionStart;
          }
        });
        if (node.parentNode !== host) host.appendChild(node);

        // Focus ONLY on the mount that opened the panel, or when the node was
        // just re-parented after a reload. This effect has no dependency array,
        // so it runs on every render; touching the selection here would fight
        // the caret on every keystroke and every deletion — the "delete moves
        // the cursor forward" symptom.
        const needsFocus = justMountedRef.current || focusMemory.wanted;
        justMountedRef.current = false;
        if (!needsFocus) return;
        if (node.ownerDocument && node.ownerDocument.activeElement === node && !focusMemory.wanted) return;
        try {
          node.focus({ preventScroll: true });
          // Restore the caret only when a reload/toggle moved it, never while
          // the user is simply typing.
          if (!ime.composing && focusMemory.caret !== null) {
            const at = Math.min(focusMemory.caret, node.value.length);
            node.setSelectionRange(at, at);
          }
        } catch (error) {
          // A refused focus call is harmless.
        }
        focusMemory.wanted = false;
      });

      const enabled = value.enabled === true;
      const writable = !snapshot || snapshot.writable !== false;
      const dirty = state.draft.text !== null && state.draft.text !== persisted;

      const statusText = saveState === 'saving' ? t('saving')
        : saveState === 'error' ? t('error')
          : dirty ? t('dirty')
            : saveState === 'saved' ? t('saved') : '';

      const panel = h('div', {
        key: 'panel-overlay',
        className: 'gpst-overlay',
        role: 'dialog',
        'aria-label': t('title')
      }, [
        h('div', { key: 'panel', className: 'gpst-panel' }, [
          h('div', { key: 'head', className: 'gpst-panel-head' }, [
            h('span', { key: 'title', className: 'gpst-title', children: t('title') }),
            h('button', {
              key: 'close',
              type: 'button',
              className: 'gpst-close',
              'aria-label': t('close'),
              onClick: function () { setOpen(false); },
              children: '\u00d7'
            })
          ]),
          h('div', { key: 'desc', className: 'gpst-description', children: t('description') }),

          h('div', { key: 'sw', className: 'gpst-switch-row' }, [
            h('span', { key: 'label', children: t('switchLabel') }),
            h('button', {
              key: 'switch',
              type: 'button',
              className: 'gpst-switch',
              role: 'switch',
              'aria-checked': enabled,
              'aria-label': t('switchLabel'),
              disabled: !writable,
              onClick: function () {
                Promise.resolve(setEnabled(!enabled)).then(function (accepted) {
                  setSaveState(accepted === false ? 'error' : 'saved');
                }, function () {
                  setSaveState('error');
                });
              }
            }, h('span', { className: 'gpst-thumb' }))
          ]),
          h('div', { key: 'input-host', className: 'gpst-input-host', ref: hostRef }),
          h('div', { key: 'foot', className: 'gpst-foot' }, [
            h('span', {
              key: 'count',
              className: 'gpst-count',
              children: t('count', { n: length, max: MAX_LENGTH })
            }),
            h('span', { key: 'actions', className: 'gpst-actions' }, [
              statusText.length === 0 ? null : h('span', {
                key: 'status',
                className: 'gpst-status' + (saveState === 'error' ? ' gpst-error' : ''),
                role: saveState === 'error' ? 'alert' : undefined,
                children: statusText
              }),

              h('button', {
                key: 'revert',
                type: 'button',
                className: 'gpst-btn',
                disabled: !dirty || !writable,
                onClick: onRevert,
                children: t('revert')
              }),
              h('button', {
                key: 'save',
                type: 'button',
                className: 'gpst-btn gpst-btn-primary',
                disabled: !dirty || !writable,
                onClick: onSave,
                children: t('save')
              })
            ])
          ])
        ])
      ]);

      // The launcher is its own slot entry in the sidebar footer, so this
      // surface contributes the panel only.
      if (!open) return null;
      return panel;
    }

    /**
     * Sidebar launcher, rendered under "New session" beside the panel rows.
     *
     * It mirrors the shipped rows' geometry (icon cell + label) so it reads as
     * one of them, and lights its dot while the setting is enabled.
     *
     * @param props - localized copy and the settings store.
     * @returns the launcher button.
     */
    function GlobalPromptLauncher(props) {
      const t = props.t;
      const snapshot = props.useGlobalPrompt(function (value) { return value; });
      const value = (snapshot && snapshot.value) || {};
      const enabled = value.enabled === true;
      return h('button', {
        type: 'button',
        className: 'gpst-launch' + (enabled ? ' gpst-launch-on' : ''),
        title: t('title'),
        'aria-label': t('title'),
        onClick: function () {
          const next = !getPanelOpen();
          setPanelOpen(next);
          if (next) {
            focusMemory.wanted = true;
            focusMemory.caret = null;
          }
        }
      }, h('span', { className: 'gpst-launch-icon' }),
        h('span', { className: 'gpst-launch-label', children: t('title') }));
    }

    const inject = ['slots', 'locale', 'configForms'];

    function apply(ctx) {
      ctx.effect(function () { return ctx.locale.register(NS, { zh: zh, en: en }); },
        'global-prompt-switch: dictionaries');
      const form = ctx.configForms.get(SETTINGS_ENTRY);

      let published;
      const same = function (a, b) {
        return a !== undefined && b !== undefined
          && a.status === b.status
          && a.writable === b.writable
          && (a.value || {}).enabled === (b.value || {}).enabled
          && (a.value || {}).text === (b.value || {}).text;
      };

      const readSnapshot = function () {
        const raw = form.getSnapshot();
        if (same(published, raw)) return published;
        published = {
          status: raw && raw.status,
          writable: raw && raw.writable,
          value: raw === undefined ? raw : {
            enabled: raw.value && raw.value.enabled,
            text: raw.value && raw.value.text
          }
        };
        return published;
      };

      const store = {
        getSnapshot: readSnapshot,
        subscribe: function (listener) {
          return form.subscribe(function () {
            const before = published;
            if (readSnapshot() === before) return;
            listener();
          });
        }
      };

      // The launcher uses the shipped footer seat, so the sidebar lays it out
      // beside Settings: no absolute positioning, no chance of overlap.
      ctx.effect(function () {
        return ctx.slots.inject('sidebar.footer.action', function () {
          return ctx.slots.register({
            name: 'sidebar.footer.action',
            id: 'global-prompt-switch-launcher',
            order: 5,
            locale: NS,
            inject: function () {
              return { hooks: { globalPrompt: store } };
            }
          }, GlobalPromptLauncher);
        });
      }, 'global-prompt-switch: footer launcher');

      // The panel itself stays in the frame-wide overlay so nothing in the
      // sidebar's own re-render churn can unmount it while the user types.
      ctx.effect(function () {
        return ctx.slots.inject('shell.overlay', function () {
          return ctx.slots.register({
            name: 'shell.overlay',
            id: 'global-prompt-switch',
            order: 60,
            locale: NS,
            inject: function () {
              return {
                hooks: { globalPrompt: store },
                setEnabled: function (next) { return form.set('enabled', next === true); },
                setText: function (next) {
                  return form.set('text', String(next).slice(0, MAX_LENGTH));
                }
              };
            }
          }, GlobalPromptSurface);
        });
      }, 'global-prompt-switch: overlay surface');

      ctx.effect(insertStyles, 'global-prompt-switch: styles');
    }

    return { apply: apply, inject: inject };
  }
});
