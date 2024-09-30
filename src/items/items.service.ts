import { CreateTagDto } from './dto/create-tag.dto';
import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { EntityManager, Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Listing } from './entities/listing.entity';
import { Comment } from './entities/comment.entity';
import { Tag } from './entities/tag.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    private readonly entityManger: EntityManager,
  ) {}
  async create(createItemDto: CreateItemDto) {
    const listing = new Listing({
      ...createItemDto?.listing,
      rating: 0,
    });

    const tags = createItemDto?.tags.map(
      (CreateTagDto) => new Tag(CreateTagDto),
    );
    const item = await new Item({
      ...createItemDto,
      comments: [],
      listing,
      tags,
    });

    return this.entityManger.save(item);
  }

  async findAll() {
    return this.itemsRepository.find({
      relations: ['listing', 'comments', 'tags'],
    });
  }

  async findOne(id: number) {
    return this.itemsRepository.findOne({
      where: { id },
      relations: {
        listing: true,
        comments: true,
        tags: true,
      },
    });
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    // const item: any = await this.itemsRepository.findOneBy({ id });
    // item.public = updateItemDto?.public;
    // const comments = updateItemDto?.comments.map(
    //   (CreateCommentDto) => new Comment(CreateCommentDto),
    // );
    // item.comments = comments;

    // return this.entityManger.save(item);

    await this.entityManger.transaction(async (entityManger) => {
      const item: any = await this.itemsRepository.findOneBy({ id });
      item.public = updateItemDto?.public;
      const comments = updateItemDto?.comments.map(
        (CreateCommentDto) => new Comment(CreateCommentDto),
      );
      item.comments = comments;
      await entityManger.save(item);

      const tag = `${Math.random()}`;

      const tags = new Tag({ content: tag });

      await entityManger.save(tags);

      throw new Error();
    });
  }

  async remove(id: number) {
    return this.itemsRepository.delete(id);
  }
}
