import { Inject, Injectable } from '@nestjs/common';
import { CreateAaaDto } from './dto/create-aaa.dto';
import { UpdateAaaDto } from './dto/update-aaa.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AaaService {
  @Inject(EventEmitter2)
  private eventEmitter: EventEmitter2;

  create(createAaaDto: CreateAaaDto) {
    return 'This action adds a new aaa';
  }

  findAll() {
    this.eventEmitter.emit('aaa.find', { data: 'aaa find' });

    this.eventEmitter.emit('aaa.findAll', { data: 'aaa findAll' });
    return `This action returns all aaa`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aaa`;
  }

  update(id: number, updateAaaDto: UpdateAaaDto) {
    return `This action updates a #${id} aaa`;
  }

  remove(id: number) {
    return `This action removes a #${id} aaa`;
  }
}
