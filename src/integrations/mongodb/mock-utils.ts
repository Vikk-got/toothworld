// Mock MongoDB utilities for browser development
// This replaces the real MongoDB client which can't run in browser

// Mock data
const mockDentists = [
  { id: 1, name: 'Dr. Aisha Patel', specialty: 'General & Cosmetics', avatar: 'AP' },
  { id: 2, name: 'Dr. James Morrison', specialty: 'Orthodontics', avatar: 'JM' },
  { id: 3, name: 'Dr. Lisa Chen', specialty: 'Pediatric Dentistry', avatar: 'LC' }
];

const mockAppointments = [
  {
    id: 1,
    patient: 'John Doe',
    patient_email: 'john@example.com',
    patient_phone: '1234567890',
    dentist: 'Dr. Aisha Patel',
    date: '2024-01-15',
    time: '10:00 AM',
    service: 'General Checkup',
    status: 'confirmed'
  }
];

const mockBlogPosts = [
  {
    id: 1,
    title: '10 Tips for Maintaining a Healthy Smile at Home',
    category: 'Oral Health',
    author: 'Dr. Aisha Patel',
    content: 'Here are 10 essential tips...',
    published: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    title: 'What to Expect During Your First Dental Visit',
    category: 'Patient Guide',
    author: 'Dr. James Morrison',
    content: 'Your first visit...',
    published: true,
    created_at: '2024-01-02T00:00:00Z'
  }
];

const mockGalleryImages = [
  { id: 1, url: '/src/pages/assets/2021-10-07.webp', caption: 'Modern dental clinic' },
  { id: 2, url: '/src/pages/assets/2023-12-20 (1).webp', caption: 'State-of-the-art equipment' },
  { id: 3, url: '/src/pages/assets/2023-12-20.webp', caption: 'Comfortable waiting area' }
];

// Mock admin users for development
const mockUsers = [
  { 
    id: 1, 
    email: 'admin@dentacare.com', 
    password: 'admin123', // In production, this should be hashed
    name: 'Admin User' 
  }
];

const mockUserRoles = [
  { 
    id: 1, 
    user_id: '1', 
    role: 'admin' 
  }
];

// Mock ObjectId class
export class ObjectId {
  private id: string;
  
  constructor(id?: string) {
    this.id = id || Math.random().toString(36).substring(2, 12);
  }
  
  toString() {
    return this.id;
  }
  
  static isValid(id: string) {
    return typeof id === 'string' && id.length > 0;
  }
}

// Mock database operations
export async function insertOne(collectionName: string, document: any) {
  try {
    // Simulate insert operation
    const result = {
      insertedId: new ObjectId(),
      ...document,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log(`Mock insert into ${collectionName}:`, result);
    return { data: result, error: null };
  } catch (error) {
    console.error(`Error inserting into ${collectionName}:`, error);
    return { data: null, error: error instanceof Error ? error.message : 'Insert failed' };
  }
}

export async function findOne(collectionName: string, filter: any) {
  try {
    let data = null;
    
    // Return mock data based on collection
    switch (collectionName) {
      case 'dentists':
        data = mockDentists.find(d => 
          Object.keys(filter).every(key => d[key] === filter[key])
        );
        break;
      case 'appointments':
        data = mockAppointments.find(a => 
          Object.keys(filter).every(key => a[key] === filter[key])
        );
        break;
      case 'blog_posts':
        data = mockBlogPosts.find(b => 
          Object.keys(filter).every(key => b[key] === filter[key])
        );
        break;
      default:
        data = null;
    }
    
    console.log(`Mock find in ${collectionName} with filter:`, filter, 'result:', data);
    return { data, error: null };
  } catch (error) {
    console.error(`Error finding in ${collectionName}:`, error);
    return { data: null, error: error instanceof Error ? error.message : 'Find failed' };
  }
}

export async function findMany(collectionName: string, filter: any = {}, options: any = {}) {
  try {
    let data: any[] = [];
    
    // Return mock data based on collection
    switch (collectionName) {
      case 'dentists':
        data = [...mockDentists];
        break;
      case 'appointments':
        data = [...mockAppointments];
        break;
      case 'blog_posts':
        data = [...mockBlogPosts];
        if (filter.published === true) {
          data = data.filter(post => post.published === true);
        }
        break;
      case 'gallery_images':
        data = [...mockGalleryImages];
        break;
      case 'users':
        data = [...mockUsers];
        break;
      case 'user_roles':
        data = [...mockUserRoles];
        break;
      default:
        data = [];
    }
    
    // Apply sorting
    if (options.sort) {
      const sortKey = Object.keys(options.sort)[0];
      const sortDir = options.sort[sortKey];
      data.sort((a, b) => {
        if (a[sortKey] < b[sortKey]) return sortDir === 1 ? -1 : 1;
        if (a[sortKey] > b[sortKey]) return sortDir === 1 ? 1 : -1;
        return 0;
      });
    }
    
    // Apply limit
    if (options.limit) {
      data = data.slice(0, options.limit);
    }
    
    console.log(`Mock find many in ${collectionName} with filter:`, filter, 'options:', options, 'result count:', data.length);
    return { data, error: null };
  } catch (error) {
    console.error(`Error finding many in ${collectionName}:`, error);
    return { data: [], error: error instanceof Error ? error.message : 'Find failed' };
  }
}

export async function updateOne(collectionName: string, filter: any, update: any) {
  try {
    console.log(`Mock update in ${collectionName} with filter:`, filter, 'update:', update);
    return { data: { modifiedCount: 1 }, error: null };
  } catch (error) {
    console.error(`Error updating in ${collectionName}:`, error);
    return { data: null, error: error instanceof Error ? error.message : 'Update failed' };
  }
}

export async function deleteOne(collectionName: string, filter: any) {
  try {
    console.log(`Mock delete in ${collectionName} with filter:`, filter);
    return { data: { deletedCount: 1 }, error: null };
  } catch (error) {
    console.error(`Error deleting from ${collectionName}:`, error);
    return { data: null, error: error instanceof Error ? error.message : 'Delete failed' };
  }
}

// Helper functions
export function objectIdToString(obj: any): any {
  if (!obj) return obj;
  
  if (obj._id && obj._id.toString) {
    return { ...obj, id: obj._id.toString() };
  }
  
  return obj;
}

export function stringToObjectId(id: string): ObjectId {
  return new ObjectId(id);
}