import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class State {
  @Prop() name: string;
  @Prop() code: string;
  @Prop() country_code: string;
  @Prop() latitude: number;
  @Prop() longitude: number;
}
