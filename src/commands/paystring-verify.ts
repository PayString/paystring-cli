import {
  convertJsonToAddress,
  PaymentInformation,
  verifyPayString,
} from '@paystring/utils'
import * as Vorpal from 'vorpal'

import Command from './Command'

/**
 * Verifies the signatures and certs for verified addresses of the currently loaded PayString.
 */
export default class VerifyPayStringCommand extends Command {
  /**
   * @override
   */
  protected async action(args: Vorpal.Args): Promise<void> {
    const info = await this.payStringFromArgsOrLocalStorage(args)
    if (verifyPayString(info)) {
      const addresses = info.verifiedAddresses.map((address) => {
        return convertJsonToAddress(address.payload)
      })
      const copy: PaymentInformation = {
        payId: info.payId,
        addresses,
        verifiedAddresses: info.verifiedAddresses,
      }
      this.logPaymentInfo(copy)
      this.vorpal.log(`Successfully verified ${copy.payId}`)
    } else {
      this.vorpal.log(`Failed to verify ${info.payId}`)
    }
  }

  /**
   * @override
   */
  protected command(): string {
    return 'verify [payString]'
  }

  /**
   * @override
   */
  protected description(): string {
    return 'Verify the loaded PayString or an optionally specified PayString'
  }
}
