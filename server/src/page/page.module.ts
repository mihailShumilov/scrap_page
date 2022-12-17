import { Module } from "@nestjs/common";
import { PageModuleBase } from "./base/page.module.base";
import { PageService } from "./page.service";

@Module({
  imports: [PageModuleBase],
  providers: [PageService],
  exports: [PageService],
})
export class PageModule {}
