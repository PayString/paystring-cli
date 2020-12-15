import {
  convertToVerifiedAddress,
  IdentityKeySigningParams,
  PaymentInformation,
  signWithKeys,
  toKey,
} from '@paystring/utils'
import { JWKECKey, JWKOctKey, JWKOKPKey, JWKRSAKey } from 'jose'
import * as Vorpal from 'vorpal'

import Command from './Command'

/**
 * Signs the currently loaded PayString PaymentInformation using the loaded signings keys.
 */
export default class SignPayStringCommand extends Command {
  /**
   * @override
   */
  public setup(): Vorpal.Command {
    return super
      .setup()
      .option(
        '-k, --keep-addresses',
        'Keep the unverified addresses section after signing.',
      )
  }

  /**
   * @override
   */
  protected async action(args: Vorpal.Args): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Vorpal.options isn't typed
    const isKeepAddresses: boolean = args.options['keep-addresses'] ?? false
    const info = this.getPaymentInfo()
    const payId = info.payId
    if (!payId) {
      this.vorpal.log('missing payid')
      return
    }
    const signingKeys = this.getSigningKey()
    if (signingKeys.length === 0) {
      this.vorpal.log(
        'you must generate or load a key before signing using ' +
          `'keys generate' or 'keys load'`,
      )
      return
    }

    const updated = signPayString(info, signingKeys, isKeepAddresses)

    this.localStorage.setPaymentInfo(updated)
    this.logPaymentInfo(updated)
  }

  /**
   * @override
   */
  protected command(): string {
    return 'sign'
  }

  /**
   * @override
   */
  protected description(): string {
    return 'sign the loaded PayString with the loaded signing keys'
  }

  /**
   * Gets the signing key and converts it to SigningKeyParams.
   *
   * @returns Keys.
   */
  private getSigningKey(): IdentityKeySigningParams[] {
    const identityKeys = this.localStorage.getSigningKeys('identity-keys')
    return identityKeys.map(
      (key) =>
        new IdentityKeySigningParams(toKey(key), getDefaultAlgorithm(key)),
    )
  }
}

/**
 * Signs all the addresses for the given payment information and returns
 * with verified address.
 *
 * @param info - The payment information to sign.
 * @param signingKeys - The keys to sign with.
 * @param isKeepAddresses - If true, the unverified addresses property will be retained instead of cleared.
 * @returns A copy of the PaymentInformation but with verified addresses.
 */
export function signPayString(
  info: PaymentInformation,
  signingKeys: IdentityKeySigningParams[],
  isKeepAddresses: boolean,
): PaymentInformation {
  const payId = info.payId
  const updatedAddresses = info.addresses.map((address) => {
    const jws = signWithKeys(payId, address, signingKeys)
    return convertToVerifiedAddress(jws)
  })
  const updated = {
    payId: info.payId,
    addresses: isKeepAddresses ? info.addresses : [],
    verifiedAddresses: updatedAddresses,
  }
  return updated
}

/**
 * Returns the default algorithm to use to sign with the given jwk.
 *
 * @param jwk - The key being used to sign.
 * @returns The default algorithm.
 */
export function getDefaultAlgorithm(
  jwk: JWKRSAKey | JWKECKey | JWKOctKey | JWKOKPKey,
): string {
  if (jwk.kty === 'EC') {
    return 'ES256'
  }
  if (jwk.kty === 'oct') {
    return 'HS512'
  }
  if (jwk.kty === 'OKP') {
    return 'EdDSA'
  }
  return 'RS512'
}
