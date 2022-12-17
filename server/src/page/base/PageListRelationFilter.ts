/*
------------------------------------------------------------------------------ 
This code was generated by Amplication. 
 
Changes to this file will be lost if the code is regenerated. 

There are other ways to to customize your code, see this doc to learn more
https://docs.amplication.com/how-to/custom-code

------------------------------------------------------------------------------
  */
import { InputType, Field } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { PageWhereInput } from "./PageWhereInput";
import { ValidateNested, IsOptional } from "class-validator";
import { Type } from "class-transformer";

@InputType()
class PageListRelationFilter {
  @ApiProperty({
    required: false,
    type: () => PageWhereInput,
  })
  @ValidateNested()
  @Type(() => PageWhereInput)
  @IsOptional()
  @Field(() => PageWhereInput, {
    nullable: true,
  })
  every?: PageWhereInput;

  @ApiProperty({
    required: false,
    type: () => PageWhereInput,
  })
  @ValidateNested()
  @Type(() => PageWhereInput)
  @IsOptional()
  @Field(() => PageWhereInput, {
    nullable: true,
  })
  some?: PageWhereInput;

  @ApiProperty({
    required: false,
    type: () => PageWhereInput,
  })
  @ValidateNested()
  @Type(() => PageWhereInput)
  @IsOptional()
  @Field(() => PageWhereInput, {
    nullable: true,
  })
  none?: PageWhereInput;
}
export { PageListRelationFilter };
