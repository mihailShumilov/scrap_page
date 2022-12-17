import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { PageServiceBase } from "./base/page.service.base";

@Injectable()
export class PageService extends PageServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
