import { convertUrlToPayId } from '@payid-org/utils'
import * as Vorpal from 'vorpal'

import Command from './Command'

/**
 * Converts a url (eg https://xpring.money/test) to a PayID (eg test$xpring.money).
 */
export default class UrlToPayidCommand extends Command {
  /**
   * @override
   */
  protected command(): string {
    return 'from-url <url>'
  }

  /**
   * @override
   */
  protected description(): string {
    return 'convert a URL to a PayID'
  }

  /**
   * @override
   */
  protected async action(args: Vorpal.Args): Promise<void> {
    const payid = convertUrlToPayId(args.url)
    this.vorpal.log(payid)
  }
}
