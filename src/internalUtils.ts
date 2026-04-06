import glmaths from '.'

export function equals(a: number, b: number) {
  return Math.abs(a - b) <= glmaths.EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b))
}
export function copyPrototype(from: any, to: any) {
  for (const key of Object.getOwnPropertyNames(from.prototype)) {
    if (key === 'constructor') continue
    Object.defineProperty(to.prototype, key,
      Object.getOwnPropertyDescriptor(from.prototype, key)!)
  }

  for (const key of Object.getOwnPropertyNames(from)) {
    if (['length', 'name', 'prototype'].includes(key)) continue
    Object.defineProperty(to, key,
      Object.getOwnPropertyDescriptor(from, key)!)
  }
}

export type TypedArray = [] | Float32Array | Float64Array | Int32Array | Uint32Array
export type TypedArrayConstructor = new (...args: any[]) => Float32Array | Float64Array | Int32Array | Uint8Array | Uint32Array

export const create = <
  C extends TypedArrayConstructor,
  MergeWith = never
>(Clazz: C, size: number) => {
  const factory = (...args: (number | TypedArray)[]): InstanceType<C> => {
    const out = new Clazz() as InstanceType<C>
    let i = 0
    for (const a of args) {
      if (typeof a === 'number') out[i++] = a
      else for (const v of a) (out as any)[i++] = v
    }
    if (i === 1)
      for (let j = 1; j < size; j++)
        (out as any)[j] = (out as any)[0]
    return out
  }
  Object.setPrototypeOf(factory, Clazz)
  return factory as typeof factory & C & Omit<MergeWith, 'prototype' | 'new'>
}