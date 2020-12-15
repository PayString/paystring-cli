import { convertUrlToPayString } from '@paystring/utils'
import * as Vorpal from 'vorpal'

import Command from './Command'

/**
 * Converts a url (eg https://xpring.money/test) to a PayString (eg test$xpring.money).
 */
export default class UrlToPayStringCommand extends Command {
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
    return 'convert a URL to a PayString'
  }

  /**
   * @override
   */
  protected async action(args: Vorpal.Args): Promise<void> {
    const payString = convertUrlToPayString(args.url)
    this.vorpal.log(payString)
  }
}
