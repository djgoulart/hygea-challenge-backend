/**
 * Make some property optional on type.
 *
 * @example
 * ```typescript
 * type Customer {
 *  id: string;
 *  name: string;
 *  email: string;
 * }
 *
 * Optional<Customer, 'id' | 'name'>
 * ```
 **/

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
