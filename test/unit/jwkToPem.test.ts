import 'mocha'
import { promises } from 'fs'

import { assert } from 'chai'

import { jwkToPem } from '../../src/commands/pem-utils'

const TEST_JWK = {
  kid: '4QDE254qxnrSYgCm2uEUdXmIzLiQaAX2i_eq2fDF4I4',
  kty: 'EC',
  alg: 'ES256',
  crv: 'P-256',
  // eslint-disable-next-line id-length -- jwk property
  d: 'ywzMHwumNjJl44zdMr9/J8hOvaLzS3maty54GQBmWow=',
  // eslint-disable-next-line id-length -- jwk property
  x: 'qyVmqSuvzjJlnNRRNypzgQwFlrUuG2DFwYewo9WhZYQ=',
  // eslint-disable-next-line id-length -- jwk property
  y: '+nqFcxlE5nX5L8R8uC5K9qcRKViPj1JJupNLzy/mWSA=',
}

describe('when jwkToPem()', function (): void {
  it('given jwk containing EC private returns expected pem', async function () {
    const pem = jwkToPem(TEST_JWK)
    const expectedPem = await promises.readFile(
      'test/unit/identity-key.pem',
      'ascii',
    )
    assert.equal(pem, expectedPem)
  })
})

export default TEST_JWK
