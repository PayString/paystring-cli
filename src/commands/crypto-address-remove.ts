import * as Vorpal from 'vorpal'

import Command from './Command'

/**
 * Removes a crypto address from the current PayID in scope.
 */
export default class RemoveCryptoAddressCommand extends Command {
  /**
   * @override
   */
  protected async action(args: Vorpal.Args): Promise<void> {
    const info = this.getPaymentInfo()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Vorpal.Args isn't typed
    const inputAddress: string = args.address
    const toRemove = info.addresses.find((address) => {
      if ('address' in address.addressDetails) {
        return address.addressDetails.address === args.address
      }
      return false
    })
    if (!toRemove) {
      this.vorpal.log(`address ${inputAddress} not found`)
      return
    }
    info.addresses.splice(info.addresses.indexOf(toRemove), 1)
    this.localStorage.setPaymentInfo(info)
    this.logPaymentInfo(info)
  }

  /**
   * @override
   */
  protected command(): string {
    return 'crypto-address remove <address>'
  }

  /**
   * @override
   */
  protected description(): string {
    return 'remove an address from the current PayID'
  }
}
