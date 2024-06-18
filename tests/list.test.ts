import { expect, test } from 'vitest'
import { type Database, getBookDatabase } from '../database_access'
import { listBooks } from '../books/list'

const jsonBookList = [
    {
        "name": "The Complete Works of William Shakespeare",
        "author": "William Shakespeare",
        "description": "No library is complete without the classics! This leather-bound edition includes the complete works of the playwright and poet William Shakespeare, considered by many to be the English language’s greatest writer.",
        "price": 19.99,
        "image": "https://m.media-amazon.com/images/I/71Bd39ofMAL._SL1500_.jpg"
    },
    {
        "name": "Iliad & Odyssey",
        "author": "Homer",
        "description": "No home library is complete without the classics! Iliad & Odyssey brings together the two essential Greek epics from the poet Homer in an elegant, leather-bound, omnibus edition-a keepsake to be read and treasured.",
        "price": 33.99,
        "image": "https://m.media-amazon.com/images/I/71ZWKmOIpVL._SL1500_.jpg"
    },
    {
        "name": "Iliad & Odyssey",
        "author": "Homer",
        "description": "No home library is complete without the classics! Iliad & Odyssey brings together the two essential Greek epics from the poet Homer in an elegant, leather-bound, omnibus edition-a keepsake to be read and treasured.",
        "price": 33.99,
        "image": "https://m.media-amazon.com/images/I/71ZWKmOIpVL._SL1500_.jpg"
    },
    {
        "name": "Modern Software Engineering: Doing What Works to Build Better Software Faster",
        "author": "David Farley",
        "description": "In Modern Software Engineering, continuous delivery pioneer David Farley helps software professionals think about their work more effectively, manage it more successfully, and genuinely improve the quality of their applications, their lives, and the lives of their colleagues.",
        "price": 51.56,
        "image": "https://m.media-amazon.com/images/I/81sji+WquSL._SL1500_.jpg"
    }
]

test('ListBooks', async () => {
    const database = getBookDatabase()
    database.bookCollection.insertMany(jsonBookList)
    expect((await listBooks([{from: 1}], database)).length).toBe(3)
})