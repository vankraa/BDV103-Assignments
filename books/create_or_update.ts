import { z } from 'zod'
import { type ZodRouter } from 'koa-zod-router'
import { type Database, getBookDatabase } from '../database_access'
import { type Book } from '../adapter/assignment-2'
import { ObjectId, Document, UpdateResult, InsertOneResult } from 'mongodb'

export async function replace(book: Book, database: Database) : Promise<Document | UpdateResult<Book>> {
    const id = book.id as string
    const result = await database.bookCollection.replaceOne({ _id: { $eq: ObjectId.createFromHexString(id) } }, {
        id,
        name: book.name,
        description: book.description,
        price: book.price,
        author: book.author,
        image: book.image
    })
    return result
}

export async function insert(book: Book, database: Database) : Promise<Document | InsertOneResult<Book>> {
    const result = await database.bookCollection.insertOne({
        name: book.name,
        description: book.description,
        price: book.price,
        author: book.author,
        image: book.image
    })
    return result
}

export default function createOrUpdateBook(router: ZodRouter): void {
    router.register({
        name: 'create or update a book',
        method: 'post',
        path: '/books',
        validate: {
            body: z.object({
                id: z.string().optional(),
                name: z.string(),
                price: z.coerce.number(),
                description: z.string(),
                author: z.string(),
                image: z.string()
            })
        },
        handler: async (ctx, next) => {
            const body = ctx.request.body as Book
            if (typeof body.id === 'string') {
                const id = body.id
                try {
                    const result = await replace(body, getBookDatabase())
                    if (result.modifiedCount === 1) {
                        ctx.body = { id }
                    } else {
                        ctx.statusCode = 404
                    }
                } catch (e) {
                    ctx.statusCode = 500
                }
            } else {
                try {
                    const result = await insert(body, getBookDatabase())
                    ctx.body = { id: result.insertedId }
                } catch (e) {
                    ctx.statusCode = 500
                }
            }
            await next()
        }
    })
}
