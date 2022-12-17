/*
------------------------------------------------------------------------------ 
This code was generated by Amplication. 
 
Changes to this file will be lost if the code is regenerated. 

There are other ways to to customize your code, see this doc to learn more
https://docs.amplication.com/how-to/custom-code

------------------------------------------------------------------------------
  */
import { ArgsType, Field } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { PageWhereInput } from "./PageWhereInput";
import { Type } from "class-transformer";
import { PageOrderByInput } from "./PageOrderByInput";

@ArgsType()
class PageFindManyArgs {
  @ApiProperty({
    required: false,
    type: () => PageWhereInput,
  })
  @Field(() => PageWhereInput, { nullable: true })
  @Type(() => PageWhereInput)
  where?: PageWhereInput;

  @ApiProperty({
    required: false,
    type: [PageOrderByInput],
  })
  @Field(() => [PageOrderByInput], { nullable: true })
  @Type(() => PageOrderByInput)
  orderBy?: Array<PageOrderByInput>;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @Field(() => Number, { nullable: true })
  @Type(() => Number)
  skip?: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @Field(() => Number, { nullable: true })
  @Type(() => Number)
  take?: number;
}

export { PageFindManyArgs };
