import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Flag {
  @Prop() ico: string;
  @Prop() alt: string;
  @Prop() png: string;
  @Prop() svg: string;
}
