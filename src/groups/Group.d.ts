import { Entity } from "../types/Entity";

export interface Group extends Entity {
    name: string
    personIds: string[]
}