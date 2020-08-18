import Command from './Command'

/**
 * Clears the terminal console.
 */
export default class ClearCommand extends Command {
  /**
   * @override
   */
  protected async action(): Promise<void> {
    // eslint-disable-next-line no-console -- needed to clear the cli console
    console.clear()
  }

  /**
   * @override
   */
  protected command(): string {
    return 'clear'
  }

  /**
   * @override
   */
  protected description(): string {
    return 'clear the terminal'
  }
}
