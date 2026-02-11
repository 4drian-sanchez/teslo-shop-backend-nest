import { InternalServerErrorException } from '@nestjs/common'
import 'dotenv/config'
import * as joi from 'joi'

interface Envs {
    DB_PASS: string
    DB_NAME: string
    DB_HOST: string
    DB_PORT: string
    DB_USERNAME: string
    PORT: number
    BASE_URL: number
    JWT_SECRET: number
}

const envsSchema = joi.object({
    DB_PASS : joi.string().required(),
    DB_NAME : joi.string().required(),
    DB_HOST : joi.string().required(),
    DB_PORT : joi.string().required(),
    DB_USERNAME : joi.string().required(),
    PORT : joi.number().required(),
    BASE_URL : joi.string().required(),
    JWT_SECRET : joi.string().required(),
}).unknown(true)

const { error, value } = envsSchema.validate(process.env)


if( error ) throw new InternalServerErrorException('Hubo un error en las variables de entorno', error)

const envsVars : Envs = value

export const envs = {
    DB_PASS: envsVars.DB_PASS,
    DB_NAME: envsVars.DB_NAME,
    DB_HOST: envsVars.DB_HOST,
    DB_PORT: +envsVars.DB_PORT,
    DB_USERNAME: envsVars.DB_USERNAME,
    PORT: envsVars.PORT,
    BASE_URL: envsVars.BASE_URL,
    JWT_SECRET: envsVars.JWT_SECRET,
}