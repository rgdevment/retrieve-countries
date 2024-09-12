import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Currency {
  @Prop() symbol: string;
  @Prop() code: string;
  @Prop() name: string;
}
