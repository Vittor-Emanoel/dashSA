import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { MemberRepository } from 'src/shared/repositories/members.repositories';
import { orderByType } from '../../shared/models/orderBy.entity';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MembersService {
  constructor(private readonly membersRepo: MemberRepository) {}

  async create(createMemberDto: CreateMemberDto) {
    const { name, phone, church_Id } = createMemberDto;

    const memberExist = await this.membersRepo.findUnique({
      where: { phone },
    });

    if (memberExist) {
      throw new ConflictException('This member already exists');
    }

    const member = await this.membersRepo.create({
      data: {
        name,
        phone,
        church_Id,
      },
    });

    return member;
  }

  async findAll(orderBy: orderByType) {
    const members = await this.membersRepo.findMany({
      select: {
        id: true,
        name: true,
        phone: true,
        church_id: true,
      },
      orderBy: [
        {
          name: orderBy,
        },
      ],
    });

    return members;
  }

  async findOne(memberId: string) {
    const member = await this.membersRepo.findFirst({
      where: { id: memberId },
    });

    if (!member) {
      throw new NotFoundException('This user not exist');
    }

    return member;
  }

  async update(memberId: string, updateMemberDto: UpdateMemberDto) {
    const { name, phone } = updateMemberDto;

    const memberById = await this.membersRepo.findFirst({
      where: { id: memberId },
    });

    if (!memberById) {
      throw new NotFoundException('This user not exist');
    }

    const member = await this.membersRepo.update({
      where: { id: memberId },
      data: {
        name,
        phone,
      },
    });

    return member;
  }

  async remove(memberId: string) {
    await this.membersRepo.delete({
      where: { id: memberId },
    });

    return;
  }
}