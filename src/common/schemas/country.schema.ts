import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { City } from './city.schema';
import { State } from './state.schema';
import { Flag } from './flag.schema';
import { Currency } from './currency.schema';

@Schema()
export class Country extends Document {
  @Prop({ type: String }) capital: string;
  @Prop({ type: [City], default: [] }) cities: City[];
  @Prop({ type: String }) code: string;
  @Prop({ type: Currency }) currency: Currency;
  @Prop({ type: Flag }) flags: Flag;
  @Prop({ type: String }) iso3: string;
  @Prop({ type: Number }) latitude: number;
  @Prop({ type: Number }) longitude: number;
  @Prop({ type: String }) name: string;
  @Prop({ type: String }) phone_code: string;
  @Prop({ type: String }) region: string;
  @Prop({ type: [State], default: [] }) states: State[];
  @Prop({ type: String }) subregion: string;
  @Prop({ type: String }) tld: string;
}

export const CountrySchema = SchemaFactory.createForClass(Country);
