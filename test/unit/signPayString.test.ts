import 'mocha'
import {
  AddressDetailsType,
  IdentityKeySigningParams,
  PaymentInformation,
} from '@paystring/utils'
import { assert } from 'chai'
import { JWK } from 'jose'

import { signPayString } from '../../src/commands/paystring-sign'

const info: PaymentInformation = {
  payId: 'boaty$mcboatface.com',
  addresses: [
    {
      paymentNetwork: 'boatcoin',
      environment: 'seanet',
      addressDetailsType: AddressDetailsType.CryptoAddress,
      addressDetails: {
        address: 'xyz12345',
      },
    },
  ],
  verifiedAddresses: [],
}

describe('when signPayString()', function (): void {
  let signingKey: IdentityKeySigningParams

  beforeEach('create key', async function (): Promise<void> {
    const key = await JWK.generate('EC', 'P-256')
    signingKey = new IdentityKeySigningParams(key, 'ES256')
  })

  it('called with keepAddresses=true, then addresses property is retained', async function (): Promise<
    void
  > {
    const result = signPayString(info, [signingKey], true)
    assert.equal(result.addresses, info.addresses)
    assert.lengthOf(result.verifiedAddresses, 1)
  })

  it('called with keepAddresses=false, then addresses property is cleared', async function (): Promise<
    void
  > {
    const result = signPayString(info, [signingKey], false)
    assert.isEmpty(result.addresses)
    assert.lengthOf(result.verifiedAddresses, 1)
  })
})
