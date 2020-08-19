import * as Vorpal from 'vorpal'

import Command, { loadPayId } from './Command'

/**
 * Loads a PayID from the remote server. For example, "load test$xpring.money" will
 * make an HTTP call the https://xpring.money/test with Accept: application/payid+json
 * header so that all the addresses are returned. If successful, the PaymentInformation
 * is saved to localstorage as the current payid in context.
 */
export default class LoadPayIdCommand extends Command {
  /**
   * @override
   */
  protected async action(args: Vorpal.Args): Promise<void> {
    const { payId } = args
    const info = await loadPayId(payId)
    this.localStorage.setPaymentInfo(info)
    this.logPaymentInfo(info)
  }

  /**
   * @override
   */
  protected command(): string {
    return 'load <payId>'
  }

  /**
   * @override
   */
  protected description(): string {
    return 'loads a PayID from PayID server'
  }
}
