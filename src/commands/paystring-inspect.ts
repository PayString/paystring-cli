import {
  PaymentInformationInspector,
  SignatureInspectionResult,
} from '@paystring/utils'
import * as Vorpal from 'vorpal'

import Command from './Command'
import LocalStorage from './localstorage'

/**
 * Inspects the currently loaded PayString and prints inspection details to the console.
 * Inspection looks at verified addresses and verifies the signatures and certificate chain (if present).
 */
export default class InspectPayStringCommand extends Command {
  private readonly paymentInformationInspector: PaymentInformationInspector

  /**
   * Creates new command.
   *
   * @param vorpal - The vorpal instance to use.
   * @param localStorage - The localstorage to use.
   */
  public constructor(vorpal: Vorpal, localStorage: LocalStorage) {
    super(vorpal, localStorage)
    this.paymentInformationInspector = new PaymentInformationInspector()
  }

  /**
   * @override
   */
  protected command(): string {
    return 'inspect [payString]'
  }

  /**
   * @override
   */
  protected description(): string {
    return 'Inspect signatures on the loaded PayString or from an optionally specified PayString'
  }

  /**
   * @override
   */
  protected async action(args: Vorpal.Args): Promise<void> {
    const info = await this.payStringFromArgsOrLocalStorage(args)
    const result = this.paymentInformationInspector.inspect(info)
    this.vorpal.log(`${info.payId} ${validString(result.isVerified)}`)
    result.verifiedAddressesResults.forEach((addressResult) => {
      const address = addressResult.address
      const cryptoAddress =
        'address' in address.addressDetails
          ? address.addressDetails.address
          : ''

      const environment: string =
        typeof address.environment === 'string' ? address.environment : ''
      this.vorpal.log(
        `Found verified ${address.paymentNetwork} ${environment} address ${cryptoAddress}`,
      )
      this.vorpal.log(
        `- Signed with ${addressResult.signaturesResults.length} signature(s)`,
      )
      addressResult.signaturesResults.forEach((signatureResult, sigIndex) => {
        this.inspectSignatureResult(sigIndex, signatureResult)
      })
    })
  }

  /**
   * Inspects and logs information about the inspection result.
   *
   * @param sigIndex - The index of the signature.
   * @param signatureResult -The signature result to inspect.
   */
  private inspectSignatureResult(
    sigIndex: number,
    signatureResult: SignatureInspectionResult,
  ): void {
    this.vorpal.log(
      `- Signature ${sigIndex + 1} ${validString(
        signatureResult.isSignatureValid,
      )}`,
    )
    if (signatureResult.jwk && signatureResult.keyType) {
      const thumbprint = signatureResult.jwk.thumbprint
      this.vorpal.log(
        `  - Signed with ${signatureResult.jwk.kty} ${signatureResult.keyType} with thumbprint ${thumbprint}`,
      )
    }
  }
}

/**
 * Prints either 'is verfied' or 'is NOT verfied' based on the valid flag.
 *
 * @param valid - Flag for is / is NOT.
 * @returns The is/is NOT string.
 */
function validString(valid: boolean): string {
  return `${valid ? 'is' : 'is NOT'} verified`
}
