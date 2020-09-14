import { Entity } from "../types/Entity";

export interface Document extends Entity{
    documentRefId: string
    groups: string[]
}