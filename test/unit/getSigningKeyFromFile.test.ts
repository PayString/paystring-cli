import 'mocha'
import { assert } from 'chai'

import { getSigningKeyFromFile } from '../../src/commands/pem-utils'

import TEST_JWK from './jwkToPem.test'

describe('when getSigningKeyFromFile()', function (): void {
  it('given pem file containing EC private returns ES256 jwk', async function () {
    const jwk = await getSigningKeyFromFile('test/unit/identity-key.pem')
    assert.deepEqual(jwk, TEST_JWK)
  })
})
