import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class City {
  @Prop() name: string;
  @Prop() state_code: string;
  @Prop() country_code: string;
  @Prop() latitude: number;
  @Prop() longitude: number;
}
