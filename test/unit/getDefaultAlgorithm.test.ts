import 'mocha'
import { assert } from 'chai'
import { JWK } from 'jose'

import { getDefaultAlgorithm } from '../../src/commands/paystring-sign'

describe('when getDefaultAlgorithm()', function (): void {
  it('given an EC key then returns ES256', async function (): Promise<void> {
    const key = await JWK.generate('EC')
    const algorithm = getDefaultAlgorithm(key.toJWK())
    assert.equal(algorithm, 'ES256')
  })

  it('given an RSA key then returns RS512', async function (): Promise<void> {
    const key = await JWK.generate('RSA')
    const algorithm = getDefaultAlgorithm(key.toJWK())
    assert.equal(algorithm, 'RS512')
  })
})
