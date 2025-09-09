import { Handler } from '@netlify/functions';
import { createInviteCode, getAllInviteCodes } from '../../src/lib/fauna';

/**
 * Netlify Function - 管理邀请码
 * GET /api/admin/invites - 获取所有邀请码
 * POST /api/admin/invites - 创建新邀请码
 */
const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // 简单的管理员认证（生产环境中应该使用更安全的方式）
  const adminToken = process.env.ADMIN_TOKEN || 'admin-secret-token';
  const authHeader = event.headers.authorization;

  if (!authHeader || !authHeader.includes(adminToken)) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({
        success: false,
        message: '未授权访问',
      }),
    };
  }

  try {
    if (event.httpMethod === 'GET') {
      // 获取所有邀请码
      const invites = await getAllInviteCodes();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: invites,
        }),
      };

    } else if (event.httpMethod === 'POST') {
      // 创建新邀请码
      const { code, count } = JSON.parse(event.body || '{}');

      if (code) {
        // 创建指定的邀请码
        await createInviteCode(code);
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({
            success: true,
            message: '邀请码创建成功',
            code,
          }),
        };
      } else if (count && typeof count === 'number') {
        // 批量创建随机邀请码
        const codes = [];
        for (let i = 0; i < count; i++) {
          const randomCode = generateRandomCode();
          await createInviteCode(randomCode);
          codes.push(randomCode);
        }

        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({
            success: true,
            message: `成功创建 ${count} 个邀请码`,
            codes,
          }),
        };
      } else {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: '请提供 code 或 count 参数',
          }),
        };
      }
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        message: '不支持的请求方法',
      }),
    };

  } catch (error: any) {
    console.error('管理邀请码错误:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: '服务器内部错误',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      }),
    };
  }
};

// 生成随机邀请码
function generateRandomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export { handler };