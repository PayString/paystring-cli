import { JWK } from 'jose'

import Command from './Command'
import { writeFile } from './files'

/**
 * Generates an identity key, loads the key into local storage and saves the key
 * to file in pem format.
 */
export default class GenerateIdentityKeyCommand extends Command {
  /**
   * @override
   */
  protected async action(): Promise<void> {
    const key = await JWK.generate('EC', 'P-256')
    const pem = key.toPEM(true)
    try {
      const filename = await writeFile('./identity-key.pem', pem)
      this.vorpal.log(`wrote key to ${filename}`)
    } catch {
      this.vorpal.log('failed to write key, outputting instead')
      this.vorpal.log(pem)
    }
    this.localStorage.addSigningKey('identity-keys', key.toJWK(true))
  }

  /**
   * @override
   */
  protected command(): string {
    return 'keys generate'
  }

  /**
   * @override
   */
  protected description(): string {
    return 'generates and saves a new identity key'
  }
}
