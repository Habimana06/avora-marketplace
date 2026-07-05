import { getRedis } from '../config/redis.js'

const LOG_LEVELS = {
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  SUCCESS: 'success',
  DEBUG: 'debug',
}

export const logAction = async (userId, action, entity = null, entityId = null, details = null, level = LOG_LEVELS.INFO) => {
  const logEntry = {
    id: Date.now() + Math.random(),
    timestamp: new Date().toISOString(),
    userId,
    action,
    entity,
    entityId,
    details,
    level,
    ip: null,
  }

  try {
    const redis = getRedis()
    if (redis) {
      await redis.lpush('avora:logs', JSON.stringify(logEntry))
      await redis.ltrim('avora:logs', 0, 999)
    }
  } catch (err) {
    console.error('Logging error:', err)
  }

  return logEntry
}

export const logStyles = {
  info: 'border-blue-500 bg-blue-50',
  warn: 'border-yellow-500 bg-yellow-50',
  error: 'border-red-500 bg-red-50',
  success: 'border-green-500 bg-green-50',
  debug: 'border-gray-500 bg-gray-50',
}