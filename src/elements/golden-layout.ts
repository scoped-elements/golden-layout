import { css, html } from 'lit';

import {
  GoldenLayout as GoldenLayoutClass,
  LayoutConfig,
  ResolvedLayoutConfig,
} from 'golden-layout';
import { property } from 'lit/decorators.js';

import { ContextProvider } from '@holochain-open-dev/context';

import { BaseElement } from '../utils/base-element';
import { GOLDEN_LAYOUT_CONTEXT } from '../utils/context';
import { INIT_LAYOUT_EVENT, ROOT_LOADED_EVENT } from '../utils/events';

export class GoldenLayout extends BaseElement {
  _goldenLayout = new ContextProvider(
    this,
    GOLDEN_LAYOUT_CONTEXT as unknown as never
  );

  @property()
  layoutConfig: LayoutConfig | undefined = undefined;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener(INIT_LAYOUT_EVENT, e => {
      e.preventDefault();
      e.stopPropagation();
      const layout = new GoldenLayoutClass(
        (e as CustomEvent).detail.element as HTMLElement
      );
      if (this.layoutConfig) {
        layout.loadLayout(this.layoutConfig);
      }

      layout.registerComponentFactoryFunction(
        'native-html-component',
        (container, state) => {
          container.element.innerHTML = (state as any).html;
        }
      );
      this._goldenLayout.setValue(layout as unknown as never);
    });
    this.addEventListener(ROOT_LOADED_EVENT, e => {
      e.preventDefault();
      e.stopPropagation();
      if (!this.layoutConfig) {
        (this._goldenLayout.value as GoldenLayoutClass).loadLayout({
          root: (e as any).detail.root,
          header: {
            popout: false,
          },
        });
      }
    });
  }

  saveLayout(): ResolvedLayoutConfig {
    return (this._goldenLayout.value as GoldenLayoutClass).saveLayout();
  }

  render() {
    return html` <slot></slot> `;
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex: 1;
        }
      `,
    ];
  }
}
