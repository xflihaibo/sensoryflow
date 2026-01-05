import { SensoryMode } from '../types';

export class FilterPool {
  /**
   * 根据模式和强度获取 SVG 滤镜字符串
   */
  public static getFilter(mode: SensoryMode, intensity: number): string {
    switch (mode) {
      case 'coding':
        return this.getCodingFilter(intensity);
      case 'reading':
        return this.getReadingFilter(intensity);
      case 'creative':
        return this.getCreativeFilter(intensity);
      case 'zen':
        return this.getZenFilter(intensity);
      case 'galaxy':
        return this.getGalaxyFilter(intensity);
      default:
        return '';
    }
  }

  /**
   * 禅意模式：淡雅墨染
   */
  private static getZenFilter(intensity: number): string {
    return `
      <filter id="sf-filter-zen" x="-5%" y="-5%" width="110%" height="110%">
        <!-- 移除 feColorMatrix 偏移，确保背景色感不随模糊增加而显得“变厚” -->
        <feGaussianBlur stdDeviation="${intensity * 1.5}" />
      </filter>
    `;
  }

  /**
   * 银河模式：深空星云 (Nebula & Deep Space)
   */
  private static getGalaxyFilter(intensity: number): string {
    return `
      <filter id="sf-filter-galaxy" x="-20%" y="-20%" width="140%" height="140%">
        <!-- 核心：星云色彩 - 深蓝色调 -->
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0.1 0 0 0.05  0 0 0.8 0 0.3  0 0 0 1 0" result="deep-blue"/>
        
        <!-- 增加星云的云雾感 -->
        <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="2" result="clouds">
          <animate attributeName="seed" dur="60s" from="1" to="100" repeatCount="indefinite" />
        </feTurbulence>
        
        <feColorMatrix in="clouds" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 15 -7" result="cloud-mask"/>
        <feComposite operator="in" in="deep-blue" in2="cloud-mask" result="nebula"/>
        
        <!-- 最终光影融合 -->
        <feGaussianBlur in="nebula" stdDeviation="${intensity * 15}" result="soft-nebula" />
        <feBlend in="SourceGraphic" in2="soft-nebula" mode="screen" />
      </filter>
    `;
  }

  /**
   * 极客模式：赛博空间 (Cyber Interface)
   * 融合了高度色差、网格扫描、故障位移和暗角效果
   */
  private static getCodingFilter(intensity: number): string {
    const offset = intensity * 5;
    
    return `
      <filter id="sf-filter-coding" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
        <!-- 核心：高级色差分离 -->
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue"/>
        <feOffset in="red" dx="${offset}" dy="0" result="red-o"/>
        <feOffset in="blue" dx="-${offset}" dy="0" result="blue-o"/>
        <feBlend in="red-o" in2="green" mode="screen" result="cg1"/>
        <feBlend in="cg1" in2="blue-o" mode="screen" result="chromatic"/>

        <!-- 纹理：数字噪点与颗粒 -->
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="1" result="grain"/>
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" result="grain-low"/>
        <feComposite operator="in" in="grain-low" in2="chromatic" result="textured"/>

        <!-- 扫描线：更细腻的网格感 -->
        <feTurbulence type="fractalNoise" baseFrequency="0 0.8" numOctaves="1" result="lines-noise"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 15 -7" result="lines"/>
        <feComposite operator="in" in="lines" in2="textured" result="scanned"/>
        <feBlend in="textured" in2="scanned" mode="overlay" result="pre-glitch"/>

        <!-- 故障：阶梯式随机位移 -->
        <feTurbulence type="fractalNoise" baseFrequency="0.02 0.5" numOctaves="2" result="glitch-noise">
          <animate attributeName="seed" dur="0.2s" values="1;100;50;200;1" repeatCount="indefinite" />
        </feTurbulence>
        <feDisplacementMap in="pre-glitch" in2="glitch-noise" scale="${intensity * 25}" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    `;
  }

  /**
   * 悦读模式：纸质纹理与护眼色调 (Paper Texture & Eye Protection)
   */
  private static getReadingFilter(intensity: number): string {
    const baseFreq = 0.02 + (intensity * 0.03);
    const contrast = 1 - (intensity * 0.1);
    
    return `
      <filter id="sf-filter-reading" x="0%" y="0%" width="100%" height="100%">
        <!-- 核心：护眼色调矩阵 (降低蓝光，模拟羊皮纸) -->
        <feColorMatrix type="matrix" values="
          1.05 0 0 0 0.02
          0 1.0 0 0 0.02
          0 0 0.85 0 0
          0 0 0 1 0" result="warm-tint"/>

        <!-- 纹理：更真实的纸张纤维颗粒 -->
        <feTurbulence type="fractalNoise" baseFrequency="${baseFreq}" numOctaves="3" result="noise"/>
        <feDiffuseLighting in="noise" lighting-color="#fff" surfaceScale="1" result="texture">
          <feDistantLight azimuth="45" elevation="60" />
        </feDiffuseLighting>
        
        <feComposite operator="arithmetic" in="warm-tint" in2="texture" k1="0.2" k2="0.8" k3="0" k4="0" result="paper"/>
        
        <!-- 柔和对比度：减轻长时间阅读的视觉压力 -->
        <feComponentTransfer in="paper">
          <feFuncR type="linear" slope="${contrast}"/>
          <feFuncG type="linear" slope="${contrast}"/>
          <feFuncB type="linear" slope="${contrast}"/>
        </feComponentTransfer>
      </filter>
    `;
  }

  /**
   * 灵感模式：水波涟漪 (Water Ripples / Ethereal)
   * 营造出一种如水面般波光粼粼、轻盈流动的视觉感
   */
  private static getCreativeFilter(intensity: number): string {
    const scale = intensity * 80;
    const blur = intensity * 2;

    return `
      <filter id="sf-filter-creative" x="-20%" y="-20%" width="140%" height="140%">
        <!-- 水面色彩增强：调高蓝色和亮度以模拟透明感 -->
        <feColorMatrix type="matrix" values="1.1 0 0 0 0.02  0 1.1 0 0 0.05  0 0 1.4 0 0.1  0 0 0 1 0" result="water-color"/>

        <!-- 基础水波纹理：极简配置以确保更低性能损耗 -->
        <feTurbulence type="turbulence" baseFrequency="0.008" numOctaves="1" result="ripple-noise" seed="15">
          <animate attributeName="baseFrequency" dur="30s" values="0.008;0.012;0.008" repeatCount="indefinite" />
        </feTurbulence>

        <!-- 移除 feSpecularLighting，改用色彩步进模拟波光 -->
        <feComponentTransfer in="ripple-noise" result="highlight">
          <feFuncR type="discrete" tableValues="0 0 1"/>
          <feFuncG type="discrete" tableValues="0 0 1"/>
          <feFuncB type="discrete" tableValues="0 0 1"/>
        </feComponentTransfer>
        
        <feBlend in="water-color" in2="highlight" mode="screen" result="surface" />

        <!-- 水波位移 -->
        <feDisplacementMap in="surface" in2="ripple-noise" scale="${scale}" xChannelSelector="R" yChannelSelector="G" />
        
        <!-- 边缘柔化 -->
        <feGaussianBlur stdDeviation="${intensity * 1.2}" />
      </filter>
    `;
  }

  /**
   * 获取滤镜在 CSS 中的引用字符串
   */
  public static getFilterCSS(mode: SensoryMode): string {
    if (mode === 'off') return 'none';
    return `url(#sf-filter-${mode})`;
  }
}
