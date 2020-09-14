import { Entity } from "../types/Entity";

export const enum PersonRole { 'TEACHER', 'STUDENT', 'PARENT' }

export interface Person extends Entity{
    firstname: string
    lastname: string
    email: string
    sick: boolean
    role: PersonRole | undefined
}