// FaunaDB 配置和工具函数
/**
 * FaunaDB Database Integration
 * 
 * This module provides secure database operations for invite code management.
 * All operations are designed to be AI-friendly with clear function signatures
 * and comprehensive error handling.
 */

import { Client, query as q } from 'faunadb';

let faunaClient: Client;

/**
 * 初始化 FaunaDB 客户端
 */
export function getFaunaClient(): Client {
  if (!faunaClient) {
    const secret = process.env.FAUNA_SECRET_KEY;
    
    if (!secret) {
      throw new Error('FAUNA_SECRET_KEY 环境变量未设置');
    }

    faunaClient = new Client({
      secret,
      domain: 'db.fauna.com',
      scheme: 'https',
    });
  }

  return faunaClient;
}

/**
 * 创建邀请码集合和索引（首次部署时需要运行）
 */
export async function setupFaunaDatabase() {
  const client = getFaunaClient();

  try {
    // 创建 invites 集合
    await client.query(
      q.CreateCollection({ name: 'invites' })
    );

    // 创建按邀请码查询的索引
    await client.query(
      q.CreateIndex({
        name: 'invites_by_code',
        source: q.Collection('invites'),
        terms: [{ field: ['data', 'code'] }],
        unique: true,
      })
    );

    console.log('FaunaDB 数据库设置完成');
  } catch (error: any) {
    if (error.message.includes('already exists')) {
      console.log('数据库已存在，跳过创建');
    } else {
      throw error;
    }
  }
}

/**
 * 创建新的邀请码
 */
export async function createInviteCode(code: string) {
  const client = getFaunaClient();

  try {
    const result = await client.query(
      q.Create(q.Collection('invites'), {
        data: {
          code,
          used: false,
          createdAt: new Date().toISOString(),
        },
      })
    );

    return result;
  } catch (error: any) {
    if (error.message.includes('duplicate')) {
      throw new Error('邀请码已存在');
    }
    throw error;
  }
}

/**
 * 验证并使用邀请码
 */
export async function verifyAndUseInviteCode(code: string) {
  const client = getFaunaClient();

  try {
    // 查找邀请码
    const result = await client.query(
      q.Get(q.Match(q.Index('invites_by_code'), code))
    ) as any;

    const invite = result.data;

    // 检查是否已被使用
    if (invite.used) {
      return {
        success: false,
        message: '邀请码已被使用',
      };
    }

    // 标记为已使用
    await client.query(
      q.Update(result.ref, {
        data: {
          used: true,
          usedAt: new Date().toISOString(),
        },
      })
    );

    return {
      success: true,
      message: '验证成功',
    };
  } catch (error: any) {
    if (error.message.includes('not found')) {
      return {
        success: false,
        message: '无效的邀请码',
      };
    }
    throw error;
  }
}

/**
 * 获取所有邀请码状态（管理用）
 */
export async function getAllInviteCodes() {
  const client = getFaunaClient();

  try {
    const result = await client.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection('invites'))),
        q.Lambda('ref', q.Get(q.Var('ref')))
      )
    ) as any;

    return result.data.map((item: any) => ({
      id: item.ref.id,
      ...item.data,
    }));
  } catch (error) {
    console.error('获取邀请码列表失败:', error);
    throw error;
  }
}