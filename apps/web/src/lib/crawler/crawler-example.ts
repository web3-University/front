/**
 * 外包任务爬虫示例
 *
 * 这个文件展示了如何从外部平台抓取任务数据
 * 注意: 这是示例代码,需要在后端环境运行
 */

// ============================================
// 方案1: 使用Puppeteer爬取网页
// ============================================

/**
 * 安装依赖:
 * npm install puppeteer
 *
 * 使用示例:
 * const jobs = await crawlUpwork('blockchain developer');
 */

/*
import puppeteer from 'puppeteer';

interface CrawledJob {
  title: string;
  description: string;
  budget: string;
  deadline?: string;
  skills: string[];
  client: string;
  rating?: number;
  url: string;
  source: 'upwork' | 'freelancer' | 'gitcoin';
}

export async function crawlUpwork(keyword: string): Promise<CrawledJob[]> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // 访问Upwork搜索页面
    await page.goto(`https://www.upwork.com/nx/search/jobs/?q=${encodeURIComponent(keyword)}`);
    await page.waitForSelector('.job-tile');
    
    // 提取任务数据
    const jobs = await page.evaluate(() => {
      const jobElements = document.querySelectorAll('.job-tile');
      return Array.from(jobElements).map(job => {
        const title = job.querySelector('.job-title')?.textContent?.trim() || '';
        const description = job.querySelector('.description')?.textContent?.trim() || '';
        const budget = job.querySelector('.budget')?.textContent?.trim() || '';
        const skills = Array.from(job.querySelectorAll('.skill-tag')).map(
          tag => tag.textContent?.trim() || ''
        );
        const client = job.querySelector('.client-name')?.textContent?.trim() || '';
        const url = job.querySelector('a')?.href || '';
        
        return {
          title,
          description,
          budget,
          skills,
          client,
          url,
          source: 'upwork' as const,
        };
      });
    });
    
    await browser.close();
    return jobs;
  } catch (error) {
    await browser.close();
    console.error('Upwork爬取失败:', error);
    throw error;
  }
}

export async function crawlFreelancer(keyword: string): Promise<CrawledJob[]> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto(`https://www.freelancer.com/jobs/1/?keyword=${encodeURIComponent(keyword)}`);
    await page.waitForSelector('.JobSearchCard-item');
    
    const jobs = await page.evaluate(() => {
      const jobElements = document.querySelectorAll('.JobSearchCard-item');
      return Array.from(jobElements).map(job => {
        const title = job.querySelector('.JobSearchCard-primary-heading')?.textContent?.trim() || '';
        const description = job.querySelector('.JobSearchCard-primary-description')?.textContent?.trim() || '';
        const budget = job.querySelector('.JobSearchCard-secondary-price')?.textContent?.trim() || '';
        const skills = Array.from(job.querySelectorAll('.JobSearchCard-primary-tagsLink')).map(
          tag => tag.textContent?.trim() || ''
        );
        const url = job.querySelector('a')?.href || '';
        
        return {
          title,
          description,
          budget,
          skills,
          client: 'Freelancer Client',
          url,
          source: 'freelancer' as const,
        };
      });
    });
    
    await browser.close();
    return jobs;
  } catch (error) {
    await browser.close();
    console.error('Freelancer爬取失败:', error);
    throw error;
  }
}
*/

// ============================================
// 方案2: 使用API直接获取数据
// ============================================

/**
 * 某些平台提供API,可以直接获取数据
 *
 * 示例: Gitcoin Bounties API
 */

/*
interface GitcoinBounty {
  id: number;
  title: string;
  description: string;
  value_in_token: string;
  token_name: string;
  bounty_owner_name: string;
  bounty_owner_github_username: string;
  keywords: string[];
  web3_created: string;
  expires_date: string;
}

export async function fetchGitcoinBounties(): Promise<CrawledJob[]> {
  try {
    const response = await fetch('https://gitcoin.co/api/v0.1/bounties/?network=mainnet&idx_status=open');
    const data = await response.json();
    
    return data.map((bounty: GitcoinBounty) => ({
      title: bounty.title,
      description: bounty.description,
      budget: `${bounty.value_in_token} ${bounty.token_name}`,
      deadline: bounty.expires_date,
      skills: bounty.keywords,
      client: bounty.bounty_owner_name || bounty.bounty_owner_github_username,
      url: `https://gitcoin.co/issue/${bounty.id}`,
      source: 'gitcoin' as const,
    }));
  } catch (error) {
    console.error('Gitcoin API请求失败:', error);
    throw error;
  }
}
*/

// ============================================
// 方案3: RSS/Feed订阅
// ============================================

/**
 * 有些平台提供RSS Feed
 *
 * 安装依赖:
 * npm install rss-parser
 */

/*
import Parser from 'rss-parser';

const parser = new Parser();

export async function fetchFromRSS(feedUrl: string): Promise<CrawledJob[]> {
  try {
    const feed = await parser.parseURL(feedUrl);
    
    return feed.items.map(item => ({
      title: item.title || '',
      description: item.contentSnippet || item.content || '',
      budget: 'TBD', // RSS通常不包含预算信息
      skills: item.categories || [],
      client: item.creator || 'Unknown',
      url: item.link || '',
      source: 'rss' as const,
    }));
  } catch (error) {
    console.error('RSS订阅失败:', error);
    throw error;
  }
}
*/

// ============================================
// 数据清洗和转换
// ============================================

/**
 * 将爬取的数据转换为项目标准格式
 */

/*
interface Project {
  id: number;
  title: string;
  description: string;
  budget: string;
  difficulty: '初级' | '中级' | '高级';
  category: string;
  deadline: string;
  applicants: number;
  verified: boolean;
  publisher: string;
  rating: number;
  source: 'manual' | 'crawler';
  tags: string[];
  publishedAt: string;
}

export function convertToProjectFormat(crawledJob: CrawledJob, id: number): Project {
  // 提取预算数字
  const budgetMatch = crawledJob.budget.match(/[\d,]+/);
  const budgetValue = budgetMatch ? parseInt(budgetMatch[0].replace(/,/g, '')) : 0;
  
  // 转换为YD币 (假设1 USD = 100 YD)
  const ydBudget = budgetValue * 100;
  const budgetMin = Math.floor(ydBudget * 0.8);
  const budgetMax = Math.ceil(ydBudget * 1.2);
  
  // 判断难度等级
  let difficulty: '初级' | '中级' | '高级' = '中级';
  if (ydBudget < 10000) {
    difficulty = '初级';
  } else if (ydBudget > 50000) {
    difficulty = '高级';
  }
  
  // 判断类别
  let category = 'other';
  const titleLower = crawledJob.title.toLowerCase();
  const descLower = crawledJob.description.toLowerCase();
  const skillsLower = crawledJob.skills.map(s => s.toLowerCase()).join(' ');
  const combined = `${titleLower} ${descLower} ${skillsLower}`;
  
  if (combined.includes('smart contract') || combined.includes('solidity') || combined.includes('blockchain')) {
    category = 'smart-contract';
  } else if (combined.includes('frontend') || combined.includes('react') || combined.includes('vue')) {
    category = 'frontend';
  } else if (combined.includes('backend') || combined.includes('api') || combined.includes('node')) {
    category = 'backend';
  } else if (combined.includes('data') || combined.includes('analytics') || combined.includes('dashboard')) {
    category = 'data-analysis';
  } else if (combined.includes('design') || combined.includes('ui') || combined.includes('ux')) {
    category = 'design';
  }
  
  // 估算截止日期
  const deadline = crawledJob.deadline || '30天';
  
  return {
    id,
    title: crawledJob.title,
    description: crawledJob.description.substring(0, 300) + '...', // 截断过长的描述
    budget: `${budgetMin.toLocaleString()} - ${budgetMax.toLocaleString()} YD`,
    difficulty,
    category,
    deadline,
    applicants: 0, // 新爬取的任务还没有申请者
    verified: false, // 爬取的任务默认未认证
    publisher: crawledJob.client,
    rating: crawledJob.rating || 0,
    source: 'crawler',
    tags: crawledJob.skills.slice(0, 5), // 最多5个标签
    publishedAt: '刚刚',
  };
}
*/

// ============================================
// 定时任务调度
// ============================================

/**
 * 使用node-cron定时执行爬虫
 *
 * 安装依赖:
 * npm install node-cron
 */

/*
import cron from 'node-cron';
import { saveProjectsToDatabase } from './database';

// 每小时执行一次爬虫
export function startCrawlerScheduler() {
  console.log('启动爬虫调度器...');
  
  // 每小时的第0分钟执行
  cron.schedule('0 * * * *', async () => {
    console.log('开始爬取任务...');
    
    try {
      const keywords = ['blockchain', 'web3', 'smart contract', 'defi', 'nft'];
      const allJobs: CrawledJob[] = [];
      
      for (const keyword of keywords) {
        // 从多个平台爬取
        const upworkJobs = await crawlUpwork(keyword);
        const freelancerJobs = await crawlFreelancer(keyword);
        const gitcoinJobs = await fetchGitcoinBounties();
        
        allJobs.push(...upworkJobs, ...freelancerJobs, ...gitcoinJobs);
      }
      
      // 去重
      const uniqueJobs = Array.from(
        new Map(allJobs.map(job => [job.url, job])).values()
      );
      
      // 转换格式
      const projects = uniqueJobs.map((job, index) => 
        convertToProjectFormat(job, Date.now() + index)
      );
      
      // 保存到数据库
      await saveProjectsToDatabase(projects);
      
      console.log(`成功爬取并保存 ${projects.length} 个任务`);
    } catch (error) {
      console.error('爬虫执行失败:', error);
    }
  });
}
*/

// ============================================
// 数据库操作示例
// ============================================

/**
 * 保存项目到数据库
 */

/*
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function saveProjectsToDatabase(projects: Project[]) {
  try {
    // 批量插入
    const result = await prisma.project.createMany({
      data: projects.map(project => ({
        title: project.title,
        description: project.description,
        budget: project.budget,
        difficulty: project.difficulty,
        category: project.category,
        deadline: project.deadline,
        publisher: project.publisher,
        rating: project.rating,
        source: project.source,
        tags: JSON.stringify(project.tags),
        verified: project.verified,
      })),
      skipDuplicates: true, // 跳过重复的记录
    });
    
    return result;
  } catch (error) {
    console.error('数据库保存失败:', error);
    throw error;
  }
}

export async function getProjects(filters: {
  category?: string;
  difficulty?: string;
  minBudget?: number;
  maxBudget?: number;
}) {
  const where: any = {};
  
  if (filters.category && filters.category !== 'all') {
    where.category = filters.category;
  }
  
  if (filters.difficulty && filters.difficulty !== 'all') {
    where.difficulty = filters.difficulty;
  }
  
  const projects = await prisma.project.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
  });
  
  return projects;
}
*/

// ============================================
// API路由示例 (Next.js)
// ============================================

/**
 * 创建API端点供前端调用
 *
 * 文件位置: /apps/web/src/app/api/projects/route.ts
 */

/*
import { NextRequest, NextResponse } from 'next/server';
import { getProjects } from '@/lib/crawler/database';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const filters = {
    category: searchParams.get('category') || undefined,
    difficulty: searchParams.get('difficulty') || undefined,
  };
  
  try {
    const projects = await getProjects(filters);
    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
*/

// ============================================
// 爬虫最佳实践
// ============================================

/**
 * 1. 遵守robots.txt
 * 2. 设置合理的请求间隔,避免频繁请求
 * 3. 使用随机User-Agent
 * 4. 处理反爬机制(如验证码)
 * 5. 错误重试机制
 * 6. 数据去重
 * 7. 日志记录
 * 8. 监控告警
 */

/*
// 请求延迟
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 随机User-Agent
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
];

function getRandomUserAgent() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

// 重试机制
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.log(`重试 ${i + 1}/${maxRetries}...`);
      await delay(delayMs * (i + 1));
    }
  }
  throw new Error('所有重试都失败了');
}
*/

// ============================================
// 使用示例
// ============================================

/*
// 在服务器启动时初始化爬虫
import { startCrawlerScheduler } from '@/lib/crawler';

// 在 server.ts 或 main.ts 中
startCrawlerScheduler();

// 手动触发爬虫
import { crawlUpwork, convertToProjectFormat } from '@/lib/crawler';

async function manualCrawl() {
  const jobs = await crawlUpwork('blockchain developer');
  const projects = jobs.map((job, index) => 
    convertToProjectFormat(job, Date.now() + index)
  );
  console.log(`爬取到 ${projects.length} 个任务`);
  return projects;
}
*/

// ============================================
// 注意事项
// ============================================

/**
 * ⚠️ 法律和道德注意事项:
 *
 * 1. 检查目标网站的服务条款(ToS)
 * 2. 遵守robots.txt规则
 * 3. 不要对服务器造成过大压力
 * 4. 尊重版权和数据所有权
 * 5. 某些网站明确禁止爬虫,需要寻找合法的API或数据源
 * 6. 优先使用官方API而不是爬虫
 *
 * ✅ 推荐做法:
 * - 联系平台获取API访问权限
 * - 使用公开的数据集
 * - 与平台建立合作关系
 */

export default {};
