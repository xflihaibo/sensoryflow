import { SensoryMode, SensorySettings } from '../types';

export class AnimationEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private settings: SensorySettings;
  private particles: any[] = [];
  private digitalBits: any[] = [];
  private blobs: any[] = [];
  private ripples: any[] = [];
  private fish: any[] = [];
  private zenPetals: any[] = [];
  private stars: any[] = [];
  private nebulaClouds: any[] = []; // 新增：星云云团
  private meteorites: any[] = [];
  private inkDust: any[] = []; // 新增：阅读模式下的“墨尘”
  private velocityParticles: any[] = [];
  private bubbles: any[] = [];
  private glitches: any[] = [];
  private animationId: number | null = null;
  private scrollSpeed: number = 0;
  private lastScrollY: number = 0;
  private lastScrollTime: number = 0;
  private frameCount: number = 0;
  private fpsLastTime: number = 0;
  private mouse = { x: 0, y: 0, active: false };

  constructor(canvas: HTMLCanvasElement, settings: SensorySettings) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true })!;
    this.settings = settings;
    this.setupListeners();
    this.handleResize();
    this.fpsLastTime = performance.now();
  }

  public handleResize() {
    const dpr = Math.min(window.devicePixelRatio, 2);
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.initModeEffects();
  }

  private setupListeners() {
    window.addEventListener('mousemove', (e) => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      this.mouse.x = e.clientX * dpr;
      this.mouse.y = e.clientY * dpr;
      this.mouse.active = true;
    });
    window.addEventListener('mouseleave', () => {
      this.mouse.active = false;
    });
    window.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    window.addEventListener('resize', () => this.handleResize());
    window.addEventListener('scroll', () => this.handleScroll(), true);
  }

  private handleScroll() {
    if (!this.settings.enableVelocity) return;
    const now = performance.now();
    const currentY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    
    if (this.lastScrollTime === 0) {
      this.lastScrollY = currentY;
      this.lastScrollTime = now;
      return;
    }

    const dt = now - this.lastScrollTime;
    if (dt > 0 && dt < 500) {
      const deltaY = currentY - this.lastScrollY;
      if (deltaY === 0) return;
      this.scrollSpeed = Math.abs(deltaY) / dt;
      const direction = deltaY > 0 ? 1 : -1;

      if (this.scrollSpeed > 0.1) {
        const count = Math.min(Math.floor(this.scrollSpeed * 10), 20);
        for (let i = 0; i < count; i++) {
          this.velocityParticles.push({
            x: Math.random() < 0.5 ? Math.random() * 100 : this.canvas.width - Math.random() * 100,
            y: direction > 0 ? this.canvas.height + 100 : -100,
            length: Math.random() * 100 + 50,
            speed: (this.scrollSpeed * 12 + Math.random() * 8) * direction,
            opacity: 1.0
          });
        }
      }
    }
    this.lastScrollY = currentY;
    this.lastScrollTime = now;
  }

  private handleMouseDown(e: MouseEvent) {
    const dpr = Math.min(window.devicePixelRatio, 2);
    const x = e.clientX * dpr;
    const y = e.clientY * dpr;

    if (this.settings.mode === 'coding') {
      const fragments = ['ERROR', '0xFA', 'BREACH', 'DEBUG', '{...}', '=>'];
      for (let i = 0; i < 5; i++) {
        this.glitches.push({
          x, y,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          text: fragments[Math.floor(Math.random() * fragments.length)],
          life: 1.0
        });
      }
    } else if (this.settings.mode === 'creative') {
      for (let i = 0; i < 8; i++) {
        this.bubbles.push({
          x: x + (Math.random() - 0.5) * 40,
          y: y + (Math.random() - 0.5) * 40,
          r: Math.random() * 4 + 2,
          speed: Math.random() * 2 + 1,
          opacity: 0.6
        });
      }
      this.fish.forEach(f => {
        const dx = f.x - x, dy = f.y - y;
        if (Math.sqrt(dx * dx + dy * dy) < 100) { f.angle += Math.PI; f.speed = 5; }
      });
    }
  }

  public updateSettings(settings: SensorySettings) {
    const modeChanged = this.settings.mode !== settings.mode;
    this.settings = settings;
    if (modeChanged) this.initModeEffects();
  }

  private initModeEffects() {
    this.particles = [];
    this.digitalBits = [];
    this.blobs = [];
    this.ripples = [];
    this.fish = [];
    this.zenPetals = [];
    this.stars = [];
    this.nebulaClouds = [];
    this.meteorites = [];
    this.bubbles = [];
    this.glitches = [];
    this.velocityParticles = [];

    if (this.settings.mode === 'coding') {
      const count = 80;
      const chars = '01ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ'.split('');
      for (let i = 0; i < count; i++) {
        this.digitalBits.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          speed: Math.random() * 5 + 2,
          char: chars[Math.floor(Math.random() * chars.length)],
          opacity: Math.random() * 0.8 + 0.2,
          size: Math.floor(Math.random() * 8 + 12)
        });
      }
      for (let i = 0; i < 5; i++) {
        this.particles.push({ y: Math.random() * this.canvas.height, speed: Math.random() * 2 + 1, opacity: Math.random() * 0.3 });
      }
    } else if (this.settings.mode === 'zen') {
      const count = 40;
      for (let i = 0; i < count; i++) {
        this.zenPetals.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          r: Math.random() * 4 + 2,
          angle: Math.random() * Math.PI * 2,
          rotation: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.5 + 0.5,
          spin: (Math.random() - 0.5) * 0.02,
          color: `hsla(${340 + Math.random() * 30}, 80%, 90%, 0.6)`
        });
      }
    } else if (this.settings.mode === 'galaxy') {
      const starCount = 150;
      for (let i = 0; i < starCount; i++) {
        this.stars.push({
          x: 0, y: 0,
          size: Math.random() * 2,
          opacity: Math.random(),
          twinkle: Math.random() * 0.05,
          angle: Math.random() * Math.PI * 2,
          distance: Math.random() * Math.max(this.canvas.width, this.canvas.height) * 0.8
        });
      }
      // 初始化星云云团
      const cloudCount = 6;
      for (let i = 0; i < cloudCount; i++) {
        this.nebulaClouds.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          r: Math.random() * 300 + 200,
          color: `hsla(${210 + Math.random() * 40}, 100%, 50%, 0.05)`, // 深蓝色调
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2
        });
      }
    } else if (this.settings.mode === 'creative') {
      const blobCount = 8;
      for (let i = 0; i < blobCount; i++) {
        this.blobs.push({
          x: Math.random() * this.canvas.width, y: Math.random() * this.canvas.height,
          r: Math.random() * 150 + 100,
          vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
          color: `hsla(${180 + Math.random() * 40}, 70%, 70%, 0.1)`
        });
      }
      for (let i = 0; i < 3; i++) this.fish.push(this.createFish());
    } else if (this.settings.mode === 'reading') {
      const count = 50;
      for (let i = 0; i < count; i++) {
        this.inkDust.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          size: Math.random() * 2 + 1,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          opacity: Math.random() * 0.3
        });
      }
    }
  }

  private createFish() {
    return {
      x: Math.random() * this.canvas.width, y: Math.random() * this.canvas.height,
      size: Math.random() * 5 + 5, angle: Math.random() * Math.PI * 2,
      speed: Math.random() * 1 + 0.5, turnSpeed: (Math.random() - 0.5) * 0.05,
      color: `hsla(${200 + Math.random() * 20}, 80%, 80%, 0.4)`, tailAngle: 0
    };
  }

  public start() {
    if (this.animationId) return;
    this.fpsLastTime = performance.now();
    this.loop(this.fpsLastTime);
  }

  public stop() {
    if (this.animationId) { cancelAnimationFrame(this.animationId); this.animationId = null; }
  }

  private loop = (time: number) => {
    this.frameCount++;
    if (time > this.fpsLastTime + 1000) {
      if (time > this.fpsLastTime + 2000) {
        this.fpsLastTime = time; this.frameCount = 0; this.draw();
        this.animationId = requestAnimationFrame(this.loop); return;
      }
      this.frameCount = 0; this.fpsLastTime = time;
    }
    this.draw();
    this.animationId = requestAnimationFrame(this.loop);
  };

  private draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.settings.mode === 'off') return;
    if (this.settings.enableTimeAware) {
      const hour = new Date().getHours();
      let color = '';
      if (hour >= 18 || hour < 6) color = 'rgba(255, 100, 0, 0.05)';
      else if (hour >= 11 && hour <= 14) color = 'rgba(255, 255, 200, 0.03)';
      if (color) { this.ctx.fillStyle = color; this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); }
    }
    const intensity = this.settings.intensity;
    if (this.settings.mode === 'coding') this.drawCodingEffects(intensity);
    else if (this.settings.mode === 'creative') this.drawCreativeEffects(intensity);
    else if (this.settings.mode === 'zen') this.drawZenEffects(intensity);
    else if (this.settings.mode === 'galaxy') this.drawGalaxyEffects(intensity);
    else if (this.settings.mode === 'reading') this.drawReadingEffects(intensity);
    if (this.settings.enableVelocity) this.drawVelocityEffects(intensity);
    if (this.settings.enableSpotlight && this.mouse.active) this.drawSpotlight();
  }

  private drawReadingEffects(intensity: number) {
    // 1. 缓慢的呼吸灯效果 (暖色调光晕)
    const breath = Math.sin(Date.now() / 2000) * 0.05 + 0.05;
    this.ctx.fillStyle = `rgba(255, 200, 50, ${breath * intensity})`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 2. 墨尘粒子
    this.inkDust.forEach(p => {
      p.x += p.vx * intensity;
      p.y += p.vy * intensity;

      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;

      this.ctx.fillStyle = `rgba(80, 60, 40, ${p.opacity * intensity})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // 3. 鼠标跟随的焦点淡光
    if (this.mouse.active) {
      const grad = this.ctx.createRadialGradient(this.mouse.x, this.mouse.y, 0, this.mouse.x, this.mouse.y, 150);
      grad.addColorStop(0, `rgba(255, 255, 200, ${0.1 * intensity})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(this.mouse.x, this.mouse.y, 150, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  private drawGalaxyEffects(intensity: number) {
    const centerX = this.canvas.width / 2, centerY = this.canvas.height / 2;

    // 0. 绘制深蓝星云云团
    this.nebulaClouds.forEach(c => {
      c.x += c.vx * intensity;
      c.y += c.vy * intensity;
      
      // 边界处理
      if (c.x < -c.r) c.x = this.canvas.width + c.r;
      if (c.x > this.canvas.width + c.r) c.x = -c.r;
      if (c.y < -c.r) c.y = this.canvas.height + c.r;
      if (c.y > this.canvas.height + c.r) c.y = -c.r;

      const grad = this.ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
      grad.addColorStop(0, c.color);
      grad.addColorStop(1, 'rgba(0, 0, 50, 0)');
      
      this.ctx.fillStyle = grad;
      this.ctx.globalCompositeOperation = 'screen';
      this.ctx.beginPath();
      this.ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.globalCompositeOperation = 'source-over';
    });

    // 1. 绘制星系旋转
    this.stars.forEach(s => {
      s.angle += 0.001 * intensity;
      const x = centerX + Math.cos(s.angle) * s.distance;
      const y = centerY + Math.sin(s.angle) * s.distance;
      s.opacity += s.twinkle;
      if (s.opacity > 1 || s.opacity < 0.3) s.twinkle *= -1;

      this.ctx.fillStyle = `rgba(200, 230, 255, ${s.opacity * intensity * 1.5})`;
      this.ctx.shadowBlur = 5 * intensity;
      this.ctx.shadowColor = 'white';
      this.ctx.beginPath(); this.ctx.arc(x, y, s.size, 0, Math.PI * 2); this.ctx.fill();
      this.ctx.shadowBlur = 0;
    });

    // 2. 随机生成更真实的流星
    if (Math.random() < 0.015 * intensity && this.meteorites.length < 8) {
      const isFast = Math.random() > 0.7;
      this.meteorites.push({
        x: Math.random() * this.canvas.width,
        y: -100,
        vx: (Math.random() - 0.3) * (isFast ? 15 : 8), // 角度更加倾斜
        vy: Math.random() * (isFast ? 20 : 10) + 5,
        size: isFast ? 1.5 : Math.random() * 2 + 2,
        opacity: 1,
        trail: [],
        color: isFast ? '#fff' : `hsla(${200 + Math.random() * 40}, 100%, 80%, 1)`
      });
    }
    
    // 3. 绘制流星
    this.meteorites = this.meteorites.filter(m => {
      m.x += m.vx * intensity;
      m.y += m.vy * intensity;
      
      // 记录尾迹位置
      m.trail.push({ x: m.x, y: m.y });
      if (m.trail.length > 20) m.trail.shift();

      if (m.y > this.canvas.height + 200 || m.x < -200 || m.x > this.canvas.width + 200) return false;

      // A. 绘制渐变尾迹
      if (m.trail.length > 2) {
        const grad = this.ctx.createLinearGradient(
          m.trail[0].x, m.trail[0].y,
          m.x, m.y
        );
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(1, m.color.replace('1)', '0.6)'));
        
        this.ctx.beginPath();
        this.ctx.strokeStyle = grad;
        this.ctx.lineWidth = m.size;
        this.ctx.lineCap = 'round';
        this.ctx.moveTo(m.trail[0].x, m.trail[0].y);
        for(let i=1; i<m.trail.length; i++) {
          this.ctx.lineTo(m.trail[i].x, m.trail[i].y);
        }
        this.ctx.stroke();
      }

      // B. 绘制头部发光核
      this.ctx.fillStyle = m.color;
      this.ctx.shadowBlur = 10 * intensity;
      this.ctx.shadowColor = m.color;
      this.ctx.beginPath();
      this.ctx.arc(m.x, m.y, m.size * 0.8, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      // C. 偶尔产生碎屑粒子
      if (Math.random() > 0.8) {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.fillRect(m.x + (Math.random()-0.5)*10, m.y + (Math.random()-0.5)*10, 1, 1);
      }

      return true;
    });

    // 4. 鼠标交互：强引力蓝光
    if (this.mouse.active) {
      this.ctx.save();
      const grad = this.ctx.createRadialGradient(this.mouse.x, this.mouse.y, 0, this.mouse.x, this.mouse.y, 200);
      grad.addColorStop(0, 'rgba(0, 100, 255, 0.2)'); 
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      this.ctx.fillStyle = grad; 
      this.ctx.globalCompositeOperation = 'screen';
      this.ctx.beginPath(); this.ctx.arc(this.mouse.x, this.mouse.y, 200, 0, Math.PI * 2); this.ctx.fill();
      this.ctx.restore();
    }
  }

  private drawZenEffects(intensity: number) {
    this.zenPetals.forEach(p => {
      if (this.mouse.active) {
        const dx = this.mouse.x - p.x, dy = this.mouse.y - p.y, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) { p.x -= (dx / dist) * 2 * intensity; p.rotation += 0.1 * intensity; }
      }
      p.y += p.speed * intensity; p.x += Math.sin(p.angle) * 0.5 * intensity; p.angle += 0.01 * intensity; p.rotation += p.spin * intensity;
      if (p.y > this.canvas.height + 20) { p.y = -20; p.x = Math.random() * this.canvas.width; }
      this.ctx.save(); this.ctx.translate(p.x, p.y); this.ctx.rotate(p.rotation);
      this.ctx.fillStyle = p.color; this.ctx.beginPath();
      this.ctx.moveTo(0, 0); this.ctx.bezierCurveTo(-p.r, -p.r, -p.r * 2, p.r, 0, p.r * 2); this.ctx.bezierCurveTo(p.r * 2, p.r, p.r, -p.r, 0, 0);
      this.ctx.fill(); this.ctx.restore();
    });
  }

  private drawVelocityEffects(intensity: number) {
    this.ctx.lineWidth = 3;
    this.velocityParticles = this.velocityParticles.filter(p => {
      p.y -= p.speed * intensity; p.opacity -= 0.02 * intensity;
      if (p.opacity <= 0 || p.y < -300 || p.y > this.canvas.height + 300) return false;
      this.ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity * intensity * 0.8})`;
      this.ctx.beginPath(); this.ctx.moveTo(p.x, p.y); this.ctx.lineTo(p.x, p.y + p.length * (p.speed > 0 ? 1 : -1)); this.ctx.stroke();
      return true;
    });
  }

  private drawSpotlight() {
    this.ctx.save(); this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; this.ctx.globalCompositeOperation = 'destination-in';
    const gradient = this.ctx.createRadialGradient(this.mouse.x, this.mouse.y, 50, this.mouse.x, this.mouse.y, 250);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 1)'); gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    this.ctx.fillStyle = gradient; this.ctx.beginPath(); this.ctx.arc(this.mouse.x, this.mouse.y, 300, 0, Math.PI * 2); this.ctx.fill();
    this.ctx.restore(); this.ctx.globalCompositeOperation = 'source-over';
  }

  private drawCodingEffects(intensity: number) {
    const accentColor = `rgba(0, 255, 65, ${0.8 * intensity})`;
    this.ctx.strokeStyle = `rgba(0, 255, 65, ${0.03 * intensity})`; this.ctx.lineWidth = 1;
    for (let x = 0; x < this.canvas.width; x += 50) { this.ctx.beginPath(); this.ctx.moveTo(x, 0); this.ctx.lineTo(x, this.canvas.height); this.ctx.stroke(); }
    for (let y = 0; y < this.canvas.height; y += 50) { this.ctx.beginPath(); this.ctx.moveTo(0, y); this.ctx.lineTo(this.canvas.width, y); this.ctx.stroke(); }

    this.particles.forEach(p => {
      p.y += p.speed * intensity; if (p.y > this.canvas.height) p.y = 0;
      this.ctx.fillStyle = `rgba(0, 255, 65, ${p.opacity * intensity})`; this.ctx.fillRect(0, p.y, this.canvas.width, 1);
    });
    let lastSize = -1;
    this.digitalBits.forEach(bit => {
      if (bit.size !== lastSize) { this.ctx.font = `bold ${bit.size}px monospace`; lastSize = bit.size; }
      bit.y += bit.speed * intensity; if (bit.y > this.canvas.height) { bit.y = -50; bit.x = Math.random() * this.canvas.width; }
      if (this.mouse.active) {
        const dx = bit.x - this.mouse.x, dy = bit.y - this.mouse.y, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150; bit.x += dx * force * 0.2;
          this.ctx.strokeStyle = `rgba(0, 255, 65, ${force * 0.2 * intensity})`;
          this.ctx.beginPath(); this.ctx.moveTo(bit.x, bit.y); this.ctx.lineTo(this.mouse.x, this.mouse.y); this.ctx.stroke();
        }
      }
      this.ctx.fillStyle = accentColor;
      this.ctx.shadowBlur = 10 * intensity; this.ctx.shadowColor = accentColor;
      this.ctx.fillText(bit.char, bit.x, bit.y); this.ctx.shadowBlur = 0;
      if (Math.random() < 0.05) {
        const chars = '01ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎ'.split('');
        bit.char = chars[Math.floor(Math.random() * chars.length)];
      }
    });
    this.glitches = this.glitches.filter(g => {
      g.x += g.vx; g.y += g.vy; g.life -= 0.03 * intensity;
      if (g.life <= 0) return false;
      this.ctx.fillStyle = `rgba(0, 255, 65, ${g.life * intensity})`; this.ctx.font = 'bold 12px monospace';
      this.ctx.fillText(g.text, g.x, g.y); return true;
    });
    if (this.mouse.active) {
      this.ctx.strokeStyle = accentColor; this.ctx.lineWidth = 2;
      this.ctx.beginPath(); this.ctx.arc(this.mouse.x, this.mouse.y, 20, 0, Math.PI * 2);
      this.ctx.moveTo(this.mouse.x - 30, this.mouse.y); this.ctx.lineTo(this.mouse.x + 30, this.mouse.y); this.ctx.moveTo(this.mouse.x, this.mouse.y - 30); this.ctx.lineTo(this.mouse.x, this.mouse.y + 30);
      this.ctx.stroke();
    }
  }

  private drawCreativeEffects(intensity: number) {
    if (Math.random() < 0.02 * intensity) this.createRipple(Math.random() * this.canvas.width, Math.random() * this.canvas.height, Math.random() * 0.5 + 0.2);
    if (this.mouse.active && Math.random() < 0.1 * intensity) this.createRipple(this.mouse.x, this.mouse.y, 0.4);
    this.ripples = this.ripples.filter(ripple => {
      ripple.r += ripple.speed * intensity; ripple.opacity -= 0.01 * intensity;
      if (ripple.opacity <= 0) return false;
      this.ctx.beginPath(); this.ctx.arc(ripple.x, ripple.y, ripple.r, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(224, 247, 250, ${ripple.opacity * intensity})`;
      this.ctx.lineWidth = 2 * ripple.opacity; this.ctx.stroke(); return true;
    });
    this.blobs.forEach(blob => {
      blob.x += blob.vx * intensity; blob.y += blob.vy * intensity;
      if (blob.x < -blob.r) blob.x = this.canvas.width + blob.r; if (blob.x > this.canvas.width + blob.r) blob.x = -blob.r;
      if (blob.y < -blob.r) blob.y = this.canvas.height + blob.r; if (blob.y > this.canvas.height + blob.r) blob.y = -blob.r;
      const gradient = this.ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
      gradient.addColorStop(0, blob.color); gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      this.ctx.fillStyle = gradient; this.ctx.beginPath(); this.ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2); this.ctx.fill();
    });
    this.bubbles = this.bubbles.filter(b => {
      b.y -= b.speed * intensity; b.x += Math.sin(Date.now() / 500) * 0.5; b.opacity -= 0.005 * intensity;
      if (b.y < -20 || b.opacity <= 0) return false;
      this.ctx.beginPath(); this.ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(255, 255, 255, ${b.opacity * intensity})`; this.ctx.lineWidth = 1; this.ctx.stroke(); return true;
    });
    this.fish.forEach(f => {
      f.x += Math.cos(f.angle) * f.speed * intensity; f.y += Math.sin(f.angle) * f.speed * intensity; f.angle += f.turnSpeed * intensity; f.tailAngle += 0.2 * intensity;
      if (this.mouse.active) {
        const dx = this.mouse.x - f.x, dy = this.mouse.y - f.y, targetAngle = Math.atan2(dy, dx);
        let diff = targetAngle - f.angle; while (diff < -Math.PI) diff += Math.PI * 2; while (diff > Math.PI) diff -= Math.PI * 2;
        f.angle += diff * 0.03 * intensity; f.x += Math.cos(f.angle) * 0.5 * intensity; f.y += Math.sin(f.angle) * 0.5 * intensity;
      }
      if (f.x < -50) f.x = this.canvas.width + 50; if (f.x > this.canvas.width + 50) f.x = -50;
      if (f.y < -50) f.y = this.canvas.height + 50; if (f.y > this.canvas.height + 50) f.y = -50;
      if (!this.mouse.active && Math.random() < 0.01) f.turnSpeed = (Math.random() - 0.5) * 0.05;
      if (f.speed > 1.5) f.speed -= 0.1 * intensity;
      this.ctx.save(); this.ctx.translate(f.x, f.y); this.ctx.rotate(f.angle);
      this.ctx.fillStyle = f.color; this.ctx.beginPath(); this.ctx.ellipse(0, 0, f.size, f.size / 2.5, 0, 0, Math.PI * 2); this.ctx.fill();
      const tailWiggle = Math.sin(f.tailAngle) * 0.5;
      this.ctx.beginPath(); this.ctx.moveTo(-f.size / 2, 0); this.ctx.lineTo(-f.size - 5, -5 + tailWiggle * 5); this.ctx.lineTo(-f.size - 5, 5 + tailWiggle * 5); this.ctx.fill();
      this.ctx.restore();
    });
  }

  private createRipple(x: number, y: number, strength: number) {
    this.ripples.push({ x, y, r: 0, opacity: strength, speed: 2 + strength * 2 });
    while (this.ripples.length > 12) this.ripples.shift();
  }
}
