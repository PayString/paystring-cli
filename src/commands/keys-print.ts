import { toKey } from '@payid-org/utils'

import Command from './Command'

/**
 * Prints, to console, a summary of the identity and server keys that are currently loaded in
 * local storage and available to use for signing.
 */
export default class PrintKeysCommand extends Command {
  /**
   * @override
   */
  protected async action(): Promise<void> {
    this.printKeys('identity-keys')
  }

  /**
   * @override
   */
  protected command(): string {
    return 'keys print'
  }

  /**
   * @override
   */
  protected description(): string {
    return 'print keys that have been loaded in pem format'
  }

  /**
   * Prints the key as pem to the console.
   *
   * @param name - The name of the key to print.
   */
  private printKeys(name: string): void {
    const keys = this.localStorage.getSigningKeys(name)
    keys.forEach((key) => {
      const pem = toKey(key).toPEM(true)
      this.vorpal.log(pem)
    })
  }
}
