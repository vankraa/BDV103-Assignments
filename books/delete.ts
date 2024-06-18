import { z } from 'zod'
import { type ZodRouter } from 'koa-zod-router'
import { type Database, getBookDatabase } from '../database_access'
import { ObjectId, DeleteResult } from 'mongodb'

export async function deleteBookHandler(id: string, database: Database): Promise<DeleteResult> {
    const objectId = ObjectId.createFromHexString(id)
    const result = await database.bookCollection.deleteOne({ _id: { $eq: objectId } })
    return result
}

export default function deleteBook(router: ZodRouter): void {
    router.register({
        name: 'delete a book',
        method: 'delete',
        path: '/books/:id',
        validate: {
            params: z.object({
                id: z.string()
            })
        },
        handler: async (ctx, next) => {
            const id = ctx.request.params.id
            const db = getBookDatabase()
            const result = await deleteBookHandler(id, db)
            if (result.deletedCount === 1) {
                ctx.body = {}
            } else {
                ctx.statusCode = 404
            }
            await next()
        }
    })
}
