import { MongoClient, type Db, type Collection } from 'mongodb'
// We are importing the book type here, so we can keep our types consistent with the front end
import { type Book } from './adapter/assignment-3'

// This is the connection string for the mongo database in our docker compose file
const uri = (global as any).MONGO_URI as string ?? 'mongodb://mongo'

// We're setting up a client, opening the database for our project, and then opening
// a typed collection for our books.
export const client = new MongoClient(uri)

export interface Database {
    database: Db,
    bookCollection: Collection<Book>
}

export function getBookDatabase(): Database {
    // If we are testing, we are creating a random database name
    const database = client.db((global as any).MONGO_URI !== undefined ? Math.floor(Math.random() * 100000).toPrecision() : 'mcmasterful-books')
    const bookCollection = database.collection<Book>('books')

    return {
        database,
        bookCollection,
    }
}
