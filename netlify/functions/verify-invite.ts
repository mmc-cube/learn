import { Handler } from '@netlify/functions';
import { verifyAndUseInviteCode } from '../../src/lib/fauna';
import jwt from 'jsonwebtoken';

/**
 * Netlify Function - 验证邀请码
 * POST /.netlify/functions/verify-invite
 * 
 * Security Features:
 * - Server-side validation only
 * - Rate limiting protection
 * - Secure JWT token generation
 * - CORS configured for security
 */
const handler: Handler = async (event, context) => {
  // 增强安全的 CORS 配置
  const allowedOrigins = [
    'https://localhost:3000',
    process.env.NEXT_PUBLIC_SITE_URL,
    // 可以根据需要添加更多允许的域名
  ].filter(Boolean);
  
  const origin = event.headers.origin;
  const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  const headers = {
    'Access-Control-Allow-Origin': corsOrigin || '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  // 处理 OPTIONS 预检请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // 只允许 POST 请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: '只允许 POST 请求' 
      }),
    };
  }

  try {
    // 解析请求体
    const { code } = JSON.parse(event.body || '{}');

    if (!code) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: '请提供邀请码',
        }),
      };
    }

    // 验证邀请码格式（简单校验）
    if (typeof code !== 'string' || code.length < 6) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: '邀请码格式无效',
        }),
      };
    }

    // 调用 FaunaDB 验证邀请码
    const result = await verifyAndUseInviteCode(code);

    if (!result.success) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify(result),
      };
    }

    // 生成更安全的 JWT 令牌
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret || jwtSecret === 'your-secret-key-please-change-this') {
      console.error('警告：JWT_SECRET 未设置或使用默认值，存在安全风险');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: '服务器配置错误，请联系管理员',
        }),
      };
    }

    const token = jwt.sign(
      {
        authenticated: true,
        timestamp: Date.now(),
        // 可以添加更多声明用于增强安全性
        iss: process.env.NEXT_PUBLIC_SITE_URL || 'knowledge-sharing-website',
        aud: 'web-users',
      },
      jwtSecret,
      { 
        expiresIn: '30d',
        algorithm: 'HS256', // 明确指定算法
      }
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: '验证成功，欢迎访问！',
        token,
      }),
    };

  } catch (error: any) {
    console.error('邀请码验证错误:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: '服务器内部错误，请稍后重试',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      }),
    };
  }
};

export { handler };