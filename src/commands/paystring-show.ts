import Command from './Command'

/**
 * Prints the currently loaded PayString PaymentInformation to the console.
 */
export default class ShowPayStringCommand extends Command {
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
    return 'Shows the currently loaded PayString'
  }
}
