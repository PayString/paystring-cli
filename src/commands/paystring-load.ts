import * as Vorpal from 'vorpal'

import Command, { loadPayString } from './Command'

/**
 * Loads a PayString from the remote server. For example, "load test$xpring.money" will
 * make an HTTP call the https://xpring.money/test with Accept: application/payid+json
 * header so that all the addresses are returned. If successful, the PaymentInformation
 * is saved to localstorage as the current payString in context.
 */
export default class LoadPayStringCommand extends Command {
  /**
   * @override
   */
  protected async action(args: Vorpal.Args): Promise<void> {
    const { payString } = args
    const info = await loadPayString(payString)
    this.localStorage.setPaymentInfo(info)
    this.logPaymentInfo(info)
  }

  /**
   * @override
   */
  protected command(): string {
    return 'load <payString>'
  }

  /**
   * @override
   */
  protected description(): string {
    return 'loads a PayString from PayString server'
  }
}
