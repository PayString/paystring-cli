import 'mocha'
import { assert } from 'chai'

import { loadPayId } from '../../src/commands/Command'

describe('loadPayId()', function (): void {
  it('Returns a PaymentInformation given a valid PayID', async function (): Promise<
    void
  > {
    const info = await loadPayId('nhartner$xpring.money')
    assert.equal(info.payId, 'nhartner$xpring.money')
    assert.isTrue(info.addresses.length > 0)
  })

  it('Gives error when PayID returns 404', async function (): Promise<void> {
    try {
      await loadPayId('bogusaccount$xpring.money')
      assert.fail('expected error')
    } catch (error) {
      assert.deepEqual(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Error is untyped
        error.message,
        'Received HTTP status 404 on https://xpring.money/bogusaccount',
      )
    }
  })
})
