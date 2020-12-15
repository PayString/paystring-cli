import { PaymentInformation } from '@paystring/utils'
import * as Vorpal from 'vorpal'

import Command from './Command'

/**
 * Initializes a new PayString PaymentInformation object that can be decorated with addresses and signed using
 * signing keys.
 */
export default class InitPayStringCommand extends Command {
  /**
   * @override
   */
  protected async action(args: Vorpal.Args): Promise<void> {
    const info: PaymentInformation = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Vorpal.Args isn't typed
      payId: args.payString,
      addresses: [],
      verifiedAddresses: [],
    }
    this.localStorage.setPaymentInfo(info)
    this.logPaymentInfo(info)
  }

  /**
   * @override
   */
  protected command(): string {
    return 'init <payString>'
  }

  /**
   * @override
   */
  protected description(): string {
    return 'initializes a new PayString'
  }
}
