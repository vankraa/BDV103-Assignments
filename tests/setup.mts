import { MongoMemoryServer } from 'mongodb-memory-server';
import { afterEach, beforeEach } from 'vitest'

const instance = await MongoMemoryServer.create({ binary: { version: '7.0.7' } })
const uri = instance.getUri();
beforeEach(async () => {
    while (instance.state === 'new') {
        await instance.start()
    }
    (global as any).__MONGOINSTANCE = instance;
    (global as any).MONGO_URI = uri.slice(0, uri.lastIndexOf('/'))
})

afterEach(async () => {
    if(instance) {
        instance.stop();
    }
})