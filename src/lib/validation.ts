/**
 * 输入验证工具函数
 * 
 * 提供安全的用户输入验证，防止注入攻击和无效数据
 */

/**
 * 验证邀请码格式
 * @param code - 待验证的邀请码
 * @returns 验证结果和错误信息
 */
export function validateInviteCode(code: unknown): {
  isValid: boolean;
  sanitized?: string;
  error?: string;
} {
  // 类型检查
  if (typeof code !== 'string') {
    return {
      isValid: false,
      error: '邀请码必须是字符串类型',
    };
  }

  // 长度检查
  if (code.length < 6 || code.length > 20) {
    return {
      isValid: false,
      error: '邀请码长度必须在6-20个字符之间',
    };
  }

  // 格式检查：只允许字母和数字
  const codePattern = /^[A-Z0-9]+$/;
  if (!codePattern.test(code)) {
    return {
      isValid: false,
      error: '邀请码只能包含大写字母和数字',
    };
  }

  // 清理和标准化
  const sanitized = code.trim().toUpperCase();

  return {
    isValid: true,
    sanitized,
  };
}

/**
 * 验证和清理字符串输入
 * @param input - 输入字符串
 * @param maxLength - 最大长度限制
 * @returns 清理后的字符串
 */
export function sanitizeStringInput(
  input: unknown,
  maxLength: number = 255
): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>\"'&]/g, ''); // 基础 XSS 防护
}

/**
 * 验证管理员令牌
 * @param token - 待验证的令牌
 * @param expectedToken - 期望的令牌值
 * @returns 验证是否通过
 */
export function validateAdminToken(
  token: unknown,
  expectedToken: string
): boolean {
  if (typeof token !== 'string') {
    return false;
  }

  if (!expectedToken || expectedToken === 'your_admin_token_here') {
    console.error('管理员令牌未正确配置');
    return false;
  }

  // 使用时间安全的字符串比较
  return timingSafeEquals(token, expectedToken);
}

/**
 * 时间安全的字符串比较
 * 防止时序攻击
 */
function timingSafeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * 限流缓存
 * 简单的内存限流实现
 */
const rateLimitCache = new Map<string, { count: number; resetTime: number }>();

/**
 * 简单的限流检查
 * @param identifier - 限流标识符（如IP地址）
 * @param limit - 限制次数
 * @param windowMs - 时间窗口（毫秒）
 * @returns 是否允许请求
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitCache.get(identifier);

  if (!record || now > record.resetTime) {
    // 新的时间窗口
    rateLimitCache.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: limit - record.count };
}

/**
 * 清理过期的限流记录
 * 定期调用以避免内存泄漏
 */
export function cleanupRateLimit(): void {
  const now = Date.now();
  for (const [key, record] of rateLimitCache.entries()) {
    if (now > record.resetTime) {
      rateLimitCache.delete(key);
    }
  }
}

// 每5分钟清理一次过期记录
setInterval(cleanupRateLimit, 5 * 60 * 1000);