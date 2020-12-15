import { convertPayStringToUrl } from '@paystring/utils'
import * as Vorpal from 'vorpal'

import Command from './Command'

/**
 * Converts a PayString (eg test$xpring.money) to it's URL (eg https://xpring.money/test).
 */
export default class PayStringToUrlCommand extends Command {
  /**
   * @override
   */
  protected async action(args: Vorpal.Args): Promise<void> {
    const url = convertPayStringToUrl(args.payString).href
    this.vorpal.log(url)
  }

  /**
   * @override
   */
  protected command(): string {
    return 'to-url <payString>'
  }

  /**
   * @override
   */
  protected description(): string {
    return 'converts PayString to url'
  }
}
