import { convertPayIdToUrl } from '@payid-org/utils'
import * as Vorpal from 'vorpal'

import Command from './Command'

/**
 * Converts a PayID (eg test$xpring.money) to it's URL (eg https://xpring.money/test).
 */
export default class PayIdToUrlCommand extends Command {
  /**
   * @override
   */
  protected async action(args: Vorpal.Args): Promise<void> {
    const url = convertPayIdToUrl(args.payId).href
    this.vorpal.log(url)
  }

  /**
   * @override
   */
  protected command(): string {
    return 'to-url <payId>'
  }

  /**
   * @override
   */
  protected description(): string {
    return 'converts PayID to url'
  }
}
