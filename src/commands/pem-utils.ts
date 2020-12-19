import { promises } from 'fs'

/* eslint-disable eslint-comments/no-unlimited-disable -- too many rules to disable */
/* eslint-disable -- the linter hates ec-key import because it has no typedefs */
const ECKey = require('ec-key')
import { JWK } from 'jose/webcrypto/types'
import calculateThumbprint from 'jose/jwk/thumbprint'
import { getDefaultAlgorithm } from '@paystring/utils'

/**
 * Reads JWK key from a file.
 *
 * @param path - The full file path of the key file.
 * @returns A JWK key.
 */
export async function getSigningKeyFromFile(path: string): Promise<JWK> {
  const pem = await promises.readFile(path, 'ascii')
  return pemToJwk(pem)
}

async function pemToJwk(pem: string): Promise<JWK> {
  try {
    const privateKey = new ECKey(pem, 'pem')
    const jwk = {
      kty: 'EC',
      d: privateKey.d.toString('base64'),
      x: privateKey.x.toString('base64'),
      y: privateKey.y.toString('base64'),
      crv: privateKey.jsonCurve,
    }
    const thumbprint = await calculateThumbprint(jwk)
    return { ...jwk, kid: thumbprint, alg: getDefaultAlgorithm(jwk) }
  } catch (e) {
    throw new Error("could not read pem: " + e.message)
  }
}

/**
 * Converts a JWK to a PEM file string (including the header and footer sections).
 *
 * @param jwk - The JWK to convert.
 * @return A PEM string.
 */
export function jwkToPem(jwk: JWK): string {
  return new ECKey(jwk).toString('pem')
}

/* eslint-enable */
