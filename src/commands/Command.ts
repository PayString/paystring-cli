import { PaymentInformation } from '@payid-org/utils'
import * as Vorpal from 'vorpal'
import { Args } from 'vorpal'

import LocalStorage from './localstorage'

/* eslint-disable eslint-comments/no-unlimited-disable -- to many rules to disable */
/* eslint-disable -- the linter hates this import */
const { jsonBeautify } = require('beautify-json')
/* eslint-enable */

/**
 * Base class that other commands extend. The base class does command registration to Vorpal and
 * also manages the local storage access.
 */
abstract class Command {
  protected readonly vorpal: Vorpal

  protected readonly localStorage: LocalStorage

  /**
   * Base constructor for a Vorpal command that uses local storage.
   *
   * @param vorpal - The vorpal instance to use.
   * @param localStorage - The shared local storage instance to use.
   */
  public constructor(vorpal: Vorpal, localStorage: LocalStorage) {
    this.localStorage = localStorage
    this.vorpal = vorpal
  }

  public setup(): void {
    // Register the concrete command to Vorpal.
    // Execute the concrete action inside a try/catch wrapper
    this.vorpal.command(this.command(), this.description()).action(
      async (args: Args): Promise<void> => {
        try {
          await this.action(args)
        } catch (error) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- error has any type
          const { message } = error
          this.vorpal.log(message)
        }
      },
    )
  }

  /**
   * Returns the payment information from local storage.
   *
   * @returns PaymentInfo.
   * @throws Error if no info found.
   */
  protected getPaymentInfo(): PaymentInformation {
    const info = this.localStorage.getPaymentInfo()
    if (info === undefined) {
      throw new Error(
        `error: no PayID loaded. Run 'payid init' or 'payid load' first.`,
      )
    }
    return info
  }

  /**
   * Pretty prints JSON to the console.
   *
   * @param info - Payment info to log.
   */
  protected logPaymentInfo(info: PaymentInformation): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call -- no type def for this library
    jsonBeautify(JSON.stringify(info, null, 2))
  }

  /**
   * The vorpal command.
   *
   * @returns The vorpal command.
   */
  protected abstract command(): string

  /**
   * The vorpal description.
   *
   * @returns The vorpal description.
   */
  protected abstract description(): string

  /**
   * Executes the action for the command.
   *
   * @param args - Arguments provided by user from command line.
   */
  protected abstract async action(args: Args): Promise<void>
}

export default Command
