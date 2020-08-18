import { convertPayIdToUrl, PaymentInformation } from '@payid-org/utils'
import axios, { AxiosResponse } from 'axios'
import * as Vorpal from 'vorpal'

import Command from './Command'

/**
 * Loads a PayID from the remote server. For example, "load test$xpring.money" will
 * make an HTTP call the https://xpring.money/test with Accept: application/payid+json
 * header so that all the addresses are returned. If successful, the PaymentInformation
 * is saved to localstorage as the current payid in context.
 */
export default class LoadPayIdCommand extends Command {
  /**
   * @override
   */
  protected async action(args: Vorpal.Args): Promise<void> {
    const { payid } = args
    const url = convertPayIdToUrl(payid).href
    await axios
      .get(url, {
        headers: {
          'payid-version': '1.0',
          accept: 'application/payid+json',
        },
      })
      .then((response) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- axios response.data has an any type
        const info: PaymentInformation = response.data
        this.localStorage.setPaymentInfo(info)
        this.logPaymentInfo(info)
      })
      .catch((error) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- axios error has an any type
        const {
          response,
          message,
        }: { response?: AxiosResponse; message: string } = error
        if (response) {
          this.vorpal.log(`Received HTTP status ${response.status} on ${url}`)
          return
        }
        this.vorpal.log(`Bad request ${url}. Error: ${message}.`)
      })
  }

  /**
   * @override
   */
  protected command(): string {
    return 'load <payid>'
  }

  /**
   * @override
   */
  protected description(): string {
    return 'loads a PayID from PayID server'
  }
}
