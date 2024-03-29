import { ref } from 'lit/directives/ref.js';
import { customElement } from 'lit/decorators.js';
import { css, html } from 'lit';
// @ts-ignore
import baseStyles from 'golden-layout/dist/css/goldenlayout-base.css';
// @ts-ignore
import theme from 'golden-layout/dist/css/themes/goldenlayout-light-theme.css';

import { BaseElement } from '../utils/base-element';
import { GetContent } from '../utils/get-content';
import { INIT_LAYOUT_EVENT, ROOT_LOADED_EVENT } from '../utils/events';

@customElement('golden-layout-root')
export class GoldenLayoutRoot extends BaseElement {
  initLayout(el: Element | undefined) {
    this.dispatchEvent(
      new CustomEvent(INIT_LAYOUT_EVENT, {
        detail: {
          element: el,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  async getRoot() {
    const children = await this.getSlottedChildren();
    for (const child of children) {
      if ((child as unknown as GetContent).getContent) {
        return (child as unknown as GetContent).getContent();
      }
    }

    return undefined;
  }

  async firstUpdated() {
    const root = await this.getRoot();

    this.dispatchEvent(
      new CustomEvent(ROOT_LOADED_EVENT, {
        bubbles: true,
        composed: true,
        detail: {
          root,
          rootElement: this,
        },
      })
    );
  }

  render() {
    return html`<div
        ${ref(this.initLayout)}
        style="flex: 1; overflow: clip;"
      ></div>
      <slot></slot> `;
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        .lm_content {
          display: flex;
        }

        .lm_title {
          display: flex !important;
        }
      `,
      baseStyles,
      theme,
    ];
  }
}
