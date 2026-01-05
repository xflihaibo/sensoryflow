export class OverlayManager {
  private static readonly ROOT_ID = 'sensory-flow-root';
  private host: HTMLElement | null = null;
  private shadowRoot: ShadowRoot | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private svgContainer: SVGSVGElement | null = null;
  private filterLayer: HTMLDivElement | null = null;

  constructor() {
    this.setup();
  }

  private setup() {
    if (document.getElementById(OverlayManager.ROOT_ID)) return;

    // 1. 创建宿主元素
    this.host = document.createElement('div');
    this.host.id = OverlayManager.ROOT_ID;
    
    // 确保宿主元素覆盖全屏且不响应鼠标（除非需要交互）
    Object.assign(this.host.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      zIndex: '2147483647',
      pointerEvents: 'none',
      userSelect: 'none',
      mixBlendMode: 'normal'
    });

    // 2. 附加 Shadow Root
    this.shadowRoot = this.host.attachShadow({ mode: 'closed' });

    // 3. 创建样式
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
      .layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }
      #sf-canvas {
        z-index: 2;
      }
      #sf-filter-layer {
        z-index: 1;
        transition: backdrop-filter 0.3s ease;
      }
      svg {
        position: absolute;
        width: 0;
        height: 0;
        visibility: hidden;
      }
    `;
    this.shadowRoot.appendChild(style);

    // 4. 创建渲染 Canvas
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'sf-canvas';
    this.canvas.className = 'layer';
    this.shadowRoot.appendChild(this.canvas);

    // 5. 创建滤镜遮罩层 (关键修复：在内部应用滤镜)
    this.filterLayer = document.createElement('div');
    this.filterLayer.id = 'sf-filter-layer';
    this.filterLayer.className = 'layer';
    this.shadowRoot.appendChild(this.filterLayer);

    // 6. 创建 SVG 滤镜容器
    this.svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.shadowRoot.appendChild(this.svgContainer);

    // 7. 将宿主注入页面
    const inject = () => {
      if (document.body) {
        document.body.appendChild(this.host!);
      } else {
        document.documentElement.appendChild(this.host!);
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', inject);
    } else {
      inject();
    }
  }

  public getFilterLayer(): HTMLDivElement | null {
    return this.filterLayer;
  }

  public getCanvas(): HTMLCanvasElement | null {
    return this.canvas;
  }

  public getShadowRoot(): ShadowRoot | null {
    return this.shadowRoot;
  }

  public updateFilters(svgContent: string) {
    if (this.svgContainer) {
      this.svgContainer.innerHTML = svgContent;
    }
  }

  public setPointerEvents(enable: boolean) {
    if (this.host) {
      this.host.style.pointerEvents = enable ? 'auto' : 'none';
    }
  }
}
