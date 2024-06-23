// Fix this path to point to your project's `memory-db.js` source file
const MemoryDB = require('../../src/model/data/memory/memory-db');
const memoryIndex = require('../../src/model/data/memory/index');

describe('src/model/data/memory/index.js', () => {
  let db;

  // Each test will get its own, empty database instance
  beforeEach(() => {
    db = new MemoryDB();
  });

  test('readFragment(ownerId, id) returns promise', async () => {
    const testFragment = {
      ownerId: 'a',
      id: 'b',
    };
    await memoryIndex.writeFragment(testFragment);

    const readPromise = memoryIndex.readFragment(testFragment.ownerId, testFragment.id);
    const fragmentResult = await readPromise;

    expect(fragmentResult).toBe(testFragment);
  });

  test('writeFragment(fragment) returns promise', async () => {
    const fragment = {
      ownerId: 'a',
      id: 'b',
    };
    const result = await db.put(fragment.ownerId, fragment.id, fragment);
    const fragmentResult = await memoryIndex.writeFragment(fragment);
    expect(fragmentResult).toBe(result);
  });

  test('readFragmentData(ownerId, id) returns promise', async () => {
    const ownerId = 'a';
    const id = 'b';
    const data = [1, 2, 3];
    const buf = Buffer.from(data);

    await memoryIndex.writeFragmentData(ownerId, id, buf);

    const fragmentResult = await memoryIndex.readFragmentData(ownerId, id);
    expect(fragmentResult).toBe(buf);
  });

  test('writeFragmentData(ownerId, id, buffer) returns promise', async () => {
    const buf = Buffer.from([1, 2, 3]);
    const result = await db.put('a', 'b', buf);
    const fragmentResult = await memoryIndex.writeFragmentData('a', 'b', buf);
    expect(fragmentResult).toBe(result);
  });
});
