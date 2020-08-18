import { promises } from 'fs'

// the maximum number of attempts at finding a unique filename (by appending a suffix).
const MAX_ATTEMPTS = 100

/**
 * Writes content to file but does not overwrite any existing file with the same name.
 * If a file with the given name already exists, attempts to write to the file by
 * appending a suffix. For example, if filename "foo.txt" already exists, it will attempt to
 * write the file as "foo.txt.1" then "foo.txt.2" until it finds an unused filename.
 *
 * @param filename - The filename to write to.
 * @param data - The content to write to the file.
 * @param index - The suffix to append to the filename.
 * @returns The actual filename that was written to.
 * @throws Error if no unique filename could be found.
 */
export async function writeFile(
  filename: string,
  data: string,
  index = 0,
): Promise<string> {
  const suffixedFilename = index === 0 ? filename : `${filename}.${index}`
  return promises
    .writeFile(suffixedFilename, data, { flag: 'wx' })
    .then(() => suffixedFilename)
    .catch(async (err) => {
      if (index <= MAX_ATTEMPTS) {
        return writeFile(filename, data, index + 1)
      }
      throw err
    })
}

/**
 * Writes content to file and overwrites any existing file with the same name.
 *
 * @param filename - The filename to write to.
 * @param data - The content to write to the file.
 * @returns Promise because the file I/O is done async.
 */
export async function overwriteFile(
  filename: string,
  data: string,
): Promise<void> {
  return promises.writeFile(filename, data)
}
