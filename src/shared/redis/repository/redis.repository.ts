import { Inject, Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

interface RedisRepositoryInterface {
  get(prefix: string, key: string): Promise<string | null>;
  set(prefix: string, key: string, value: string): Promise<void>;
  delete(prefix: string, key: string): Promise<void>;
  setWithExpiry(
    prefix: string,
    key: string,
    value: string,
    expiry: number,
  ): Promise<void>;
}

@Injectable()
export class RedisRepository
  implements OnModuleDestroy, RedisRepositoryInterface
{
  private readonly logger = new Logger(RedisRepository.name);

  constructor(@Inject('RedisClient') private readonly redisClient: Redis) {}

  onModuleDestroy(): void {
    this.redisClient.disconnect();
  }

  async get(prefix: string, key: string): Promise<string | null> {
    try {
      return await this.redisClient.get(`${prefix}:${key}`);
    } catch (error) {
      this.logger.error(`Failed to get data from Redis: ${error.message}`);
      throw error;
    }
  }

  async set(prefix: string, key: string, value: string): Promise<void> {
    try {
      await this.redisClient.set(`${prefix}:${key}`, value);
    } catch (error) {
      this.logger.error(`Failed to set data in Redis: ${error.message}`);
      throw error;
    }
  }

  async delete(prefix: string, key: string): Promise<void> {
    try {
      await this.redisClient.del(`${prefix}:${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete data from Redis: ${error.message}`);
      throw error;
    }
  }

  async setWithExpiry(
    prefix: string,
    key: string,
    value: string,
    expiry: number = 60 * 60 * 24,
  ): Promise<void> {
    try {
      await this.redisClient.set(`${prefix}:${key}`, value, 'EX', expiry);
    } catch (error) {
      this.logger.error(
        `Failed to set data with expiry in Redis: ${error.message}`,
      );
      throw error;
    }
  }
}
