import { splitPayString } from '@paystring/utils'

import Command from './Command'
import { overwriteFile } from './files'

/**
 * Saves the PaymentInformation for the currently loaded payString to a json file.
 */
export default class SavePayStringCommand extends Command {
  protected async action(): Promise<void> {
    const info = this.getPaymentInfo()
    if (info.payId) {
      const userHost = splitPayString(info.payId)
      const filename = `${userHost[0]}.json`
      await overwriteFile(filename, JSON.stringify(info, null, 2))
      this.vorpal.log(`Saved to ${filename}`)
    } else {
      this.vorpal.log(`missing payString`)
    }
  }

  /**
   * @override
   */
  protected command(): string {
    return 'save'
  }

  /**
   * @override
   */
  protected description(): string {
    return 'Save the currently loaded PayString'
  }
}
