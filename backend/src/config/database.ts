import { ConnectionString } from "./config";
import pgp from 'pg-promise'

export const db = pgp({
    schema: 'public'
})(ConnectionString)