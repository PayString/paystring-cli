import { convertPayIdToUrl, PaymentInformation } from '@payid-org/utils'
import axios, { AxiosResponse } from 'axios'
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

  /**
   * Sets up and registers the vorpal command.
   *
   * @returns The registered command.
   */
  public setup(): Vorpal.Command {
    // Register the concrete command to Vorpal.
    // Execute the concrete action inside a try/catch wrapper
    return this.vorpal.command(this.command(), this.description()).action(
      async (args: Args): Promise<void> => {
        await this.action(args).catch((error) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- error has any type
          const { message } = error
          this.vorpal.log(message)
        })
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
   * Retrieves a PayID using the optional payId argument or else returns the PaymentInformation
   * currently loaded in local storage.
   *
   * @param args - The vorpal args object.
   * @returns PaymentInformation from args or local storage. Or error if can't be loaded.
   */
  protected async payIdFromArgsOrLocalStorage(
    args: Args,
  ): Promise<PaymentInformation> {
    const { payId } = args
    if (payId) {
      return loadPayId(payId)
    }
    return this.getPaymentInfo()
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

/**
 * Loads a PayID from a remote server.
 *
 * @param payId - The PayID to lookup.
 * @returns A promise that resolves to the PaymentInformation for the PayID.
 */
export async function loadPayId(payId: string): Promise<PaymentInformation> {
  const url = convertPayIdToUrl(payId).href
  return axios
    .get(url, {
      headers: {
        'payid-version': '1.0',
        accept: 'application/payid+json',
      },
    })
    .then((response) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- axios response.data has an any type
      const info: PaymentInformation = response.data
      return info
    })
    .catch((error) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- axios error has an any type
      const {
        response,
        message,
      }: { response?: AxiosResponse; message: string } = error
      if (response) {
        throw new Error(`Received HTTP status ${response.status} on ${url}`)
      }
      throw new Error(`Bad request ${url}. Error: ${message}.`)
    })
}

export default Command
