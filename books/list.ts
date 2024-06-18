import { z } from 'zod'
import { type Database, getBookDatabase } from '../database_access'
import { type Book } from '../adapter/assignment-2'
import { type Filter } from '../adapter/assignment-3'
import { type ZodRouter } from 'koa-zod-router'

export async function listBooks(filters: Filter[], database: Database): Promise<Book[]> {
    // Implement the logic for getting and listing books here
    const validFilters = filters?.filter(({ from, to, name, author }) =>
        typeof from === 'number' ||
        typeof to === 'number' ||
        (typeof name === 'string' && name.trim().length > 0) ||
        (typeof author === 'string' && author.trim().length > 0)
    ) ?? []

    const query = validFilters.length > 0
        ? {
            $or: validFilters.map(({ from, to, name, author }) => {
                const filter: { price?: { $gte?: number, $lte?: number }, name?: { $regex: string, $options: string }, author?: { $regex: string, $options: string } } = {}
                if (typeof from === 'number') {
                    filter.price = { $gte: from }
                }
                if (typeof to === 'number') {
                    filter.price = { ...(filter.price ?? {}), $lte: to }
                }
                if (typeof name === 'string') {
                    filter.name = { $regex: name.toLowerCase(), $options: 'ix' }
                }
                if (typeof author === 'string') {
                    filter.author = { $regex: author.toLowerCase(), $options: 'ix' }
                }
                return filter
            })
        }
        : {}

    const bookList = await database.bookCollection.find(query).map(document => {
        const book: Book = {
            id: document._id.toHexString(),
            name: document.name,
            image: document.image,
            price: document.price,
            author: document.author,
            description: document.description
        }
        return book
    }).toArray()
    return bookList
}


export default function booksList(router: ZodRouter): void {
    router.register({
        name: 'list books',
        method: 'get',
        path: '/books',
        validate: {
            query: z.object({
                filters: z.object({
                    from: z.coerce.number().optional(),
                    to: z.coerce.number().optional(),
                    name: z.string().optional(),
                    author: z.string().optional()
                }).array().optional()
            })
        },
        handler: async (ctx, next) => {
            const filters = ctx.request.query?.filters as Filter[]

            const bookList = await listBooks(filters, getBookDatabase())

            ctx.body = bookList
            await next()
        }
    })
}
