// definicao de tipos | mapeamento das tables com knex

// eslint-disable-next-line
import {Knex} from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      created_at: Date
      name: string
    }
  }
}
