import { SensoryMode } from '../types';

export interface PageMetadata {
  title: string;
  description: string;
  url: string;
  domain: string;
  hasArticle: boolean;
  hasCode: boolean;
}

export class SenseManager {
  private static readonly RULES = {
    coding: {
      domains: ['github.com', 'stackoverflow.com', 'npmjs.com', 'v2ex.com/go/programmer'],
      keywords: ['documentation', 'api', 'repository', 'developer', 'code', 'git'],
      selectors: ['pre', 'code', '.highlight', '.blob-wrapper']
    },
    reading: {
      domains: ['medium.com', 'substack.com', 'zhihu.com', 'ruanyifeng.com', 'jianshu.com'],
      keywords: ['blog', 'article', 'post', 'essay', 'news', 'column', '阅读'],
      selectors: ['article', '.post-content', '.article-body', '.Post-Main', '.QuestionHeader']
    },
    creative: {
      domains: ['behance.net', 'pinterest.com', 'dribbble.com', 'zcool.com.cn'],
      keywords: ['design', 'inspiration', 'portfolio', 'creative', 'gallery', 'illustration'],
      selectors: ['img.main', '.gallery', '.portfolio-item']
    }
  };

  /**
   * 分析当前页面并返回识别出的模式
   */
  public static analyze(): SensoryMode {
    const metadata = this.extractMetadata();
    return this.classify(metadata);
  }

  private static extractMetadata(): PageMetadata {
    return {
      title: document.title.toLowerCase(),
      description: (document.querySelector('meta[name="description"]')?.getAttribute('content') || '').toLowerCase(),
      url: window.location.href.toLowerCase(),
      domain: window.location.hostname.toLowerCase(),
      hasArticle: !!document.querySelector('article'),
      hasCode: !!document.querySelector('pre, code')
    };
  }

  private static classify(meta: PageMetadata): SensoryMode {
    // 1. 优先根据域名判断
    for (const [mode, rule] of Object.entries(this.RULES)) {
      if (rule.domains.some(domain => meta.domain.includes(domain))) {
        return mode as SensoryMode;
      }
    }

    // 2. 根据关键词权重判断
    const scores: Record<SensoryMode, number> = { coding: 0, reading: 0, creative: 0, zen: 0, galaxy: 0, off: 0 };

    for (const [mode, rule] of Object.entries(this.RULES)) {
      const modeName = mode as SensoryMode;
      
      // 检查标题和描述
      rule.keywords.forEach(keyword => {
        if (meta.title.includes(keyword)) scores[modeName] += 2;
        if (meta.description.includes(keyword)) scores[modeName] += 1;
        if (meta.url.includes(keyword)) scores[modeName] += 1;
      });

      // 检查特定选择器
      rule.selectors.forEach(selector => {
        if (document.querySelector(selector)) scores[modeName] += 3;
      });
    }

    // 结构化辅助判断
    if (meta.hasCode) scores.coding += 5;
    if (meta.hasArticle) scores.reading += 3;

    // 找出得分最高的模式
    let maxScore = 0;
    let bestMode: SensoryMode = 'off';

    for (const [mode, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        bestMode = mode as SensoryMode;
      }
    }

    // 设定阈值，避免误判
    return maxScore >= 3 ? bestMode : 'off';
  }
}
