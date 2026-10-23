import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreCategory } from './entities/store-category.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(StoreCategory)
    private readonly categoryRepository: Repository<StoreCategory>,
  ) {}

  async getCategories() {
    return this.categoryRepository.find({
      select: { slug: true, name: true },
      order: { name: 'ASC' },
    });
  }
}
