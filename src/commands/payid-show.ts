import Command from './Command'

/**
 * Prints the currently loaded PayID PaymentInformation to the console.
 */
export default class ShowPayIdCommand extends Command {
  protected async action(): Promise<void> {
    const info = this.getPaymentInfo()
    this.logPaymentInfo(info)
  }

  /**
   * @override
   */
  protected command(): string {
    return 'show'
  }

  /**
   * @override
   */
  protected description(): string {
    return 'Shows the currently loaded PayID'
  }
}
