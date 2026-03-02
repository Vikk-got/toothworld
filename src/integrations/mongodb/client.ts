// Mock MongoDB client for browser development
// The real MongoDB client can't run in browser environment

// Mock database connection
export async function connectToDatabase() {
  console.log('Using mock MongoDB connection');
  return {
    collection: (name: string) => ({
      insertOne: async (doc: any) => ({ insertedId: Math.random().toString(36).substring(2, 12) }),
      findOne: async (filter: any) => null,
      find: (filter: any) => ({
        sort: () => ({ limit: () => ({ skip: () => ({ toArray: async () => [] }) }) }),
        limit: () => ({ skip: () => ({ toArray: async () => [] }) }),
        skip: () => ({ toArray: async () => [] }),
        toArray: async () => []
      }),
      updateOne: async (filter: any, update: any) => ({ modifiedCount: 1 }),
      deleteOne: async (filter: any) => ({ deletedCount: 1 }),
      createIndex: async (index: any) => {}
    })
  };
}

async function setupIndexes(db: any) {
  // Mock index setup
  console.log('Mock index setup completed');
}