// types/index.ts
export type User = {
    _id: string
    name: string
    email: string
    role: 'admin' | 'volunteer'
    region?: {
      _id: string
      name: string
      code: string
    }
    createdAt: string
  }
  
  export type Product = {
    _id: string
    name: string
    quantity: number
    unit: string
    createdAt: string
  }
  
  export type Bag = {
    _id: string
    name: string
    description: string
    products: Array<{
      product: {
        _id: string
        name: string
        unit: string
      }
      quantity: number
    }>
    totalQuantity: number
    remainingQuantity: number
    createdAt: string
  }
  
  export type Distribution = {
    _id: string
    bag: {
      _id: string
      name: string
    }
    region:string
    quantityDistributed: number
    distributedBy: {
      _id: string
      name: string
    }
    distributionDate: string
    notes?: string
  }
  
  export type Region = {
    _id: string
    name: string
    code: string
    population?: number
    createdAt: string
  }