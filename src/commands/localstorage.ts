import { PaymentInformation } from '@paystring/utils'
import { JWKECKey, JWKOctKey, JWKOKPKey, JWKRSAKey } from 'jose'
import * as Vorpal from 'vorpal'

/**
 * Facade layer for the Vorpal localstorage object. Provides typed methods for accessing things in
 * local storage like signing keys and PayString PaymentInformation. Objects in local storage are
 * stored as JSON strings.
 */
export default class LocalStorage {
  private readonly localStorage: VorpalLocalStorage

  /**
   * Constructs the facade and initializes the localstorage instance.
   *
   * @param payString - The payString for this local storage.
   * @param vorpal - The vorpal instance to use.
   */
  public constructor(payString: string, vorpal: Vorpal) {
    // initializes the local storage instance
    vorpal.localStorage(payString)
    // The Vorpal API for local storage is really poorly defined and the type defs do not match the actual API.
    // see https://github.com/dthree/vorpal/wiki/API-%7C-vorpal#vorpallocalstorageid
    // So many things that make typescript linter upset that it's easiest to just disable all rules for this one line.
    /* eslint-disable eslint-comments/no-unlimited-disable -- to many rules to disable */
    /* eslint-disable -- the linter hates this import */
    this.localStorage = (vorpal.localStorage as unknown) as VorpalLocalStorage
    /* eslint-enable */
  }

  /* eslint-disable @typescript-eslint/consistent-type-assertions -- getters/setters enforce consistent types */
  /**
   * Gets the PaymentInformation instance from local storage.
   *
   * @returns The instance or undefined if none exists.
   */
  public getPaymentInfo(): PaymentInformation | undefined {
    return this.getItem('paystring') as PaymentInformation
  }

  /**
   * Updates the PaymentInformation in local storage.
   *
   * @param info - The value to store.
   */
  public setPaymentInfo(info: PaymentInformation): void {
    this.setItem('paystring', JSON.stringify(info))
  }

  /**
   * Gets a named signing key from local storage.
   *
   * @param name - The name of the key.
   * @returns The key or null.
   */
  public getSigningKeys(
    name: string,
  ): Array<JWKRSAKey | JWKECKey | JWKOKPKey | JWKOctKey> {
    const existing = this.getItem(name)
    if (existing) {
      return existing as Array<JWKRSAKey | JWKECKey | JWKOKPKey | JWKOctKey>
    }
    return []
  }
  /* eslint-enable @typescript-eslint/consistent-type-assertions */

  /**
   * Sets value for a named signing key from local storage.
   *
   * @param name - The name of the key.
   * @param key - The key to store.
   */
  public addSigningKey(
    name: string,
    key: JWKRSAKey | JWKECKey | JWKOKPKey | JWKOctKey,
  ): void {
    const keys = this.getSigningKeys(name)
    const updated = keys.concat(key)
    this.setItem(name, JSON.stringify(updated))
  }

  /**
   * Removes an item from localstorage.
   *
   * @param name - The name of the item to remove.
   */
  public removeItem(name: string): void {
    this.localStorage.removeItem(name)
  }

  /**
   * Gets item from localstorage. If value exists, also parses JSON value.
   *
   * @param name - The name of the item to get.
   * @returns The object or undefined if not in localstore.
   */
  private getItem(
    name: string,
  ):
    | Array<JWKRSAKey | JWKECKey | JWKOKPKey | JWKOctKey>
    | PaymentInformation
    | undefined {
    const rawValue = this.localStorage.getItem(name)
    if (rawValue && typeof rawValue === 'string') {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- because JSON
        return JSON.parse(rawValue)
      } catch {
        return undefined
      }
    }
    return undefined
  }

  /**
   * Sets the value of a item in localstorage.
   *
   * @param name - The name of the item.
   * @param value - The value to store.
   */
  private setItem(name: string, value: string): void {
    this.localStorage.setItem(name, value)
  }
}

/**
 * VorpalLocalStorage almost but does not quite implement the LocalStorage API. This interface
 * reflects the methods that are actually implemented.
 */
interface VorpalLocalStorage {
  getItem: (key: string) => string | unknown
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}
