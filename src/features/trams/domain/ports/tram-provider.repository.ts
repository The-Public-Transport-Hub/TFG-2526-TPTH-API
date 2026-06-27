import { Tram } from "../models/tram.model"

export interface TramsProvider {
  getTrams(): Promise<Tram[]>
}
