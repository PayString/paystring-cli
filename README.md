# `@payid-org/payid-cli`

![NPM version badge](https://img.shields.io/npm/v/@payid-org/payid-cli)

Command-line interface for creating, fetching, signing and verifying PayIDs.
Based on the Typescript PayID [Utils](https://github.com/payid-org/utils) library.

## Prerequisites

In order to use the CLI, both [node](https://nodejs.org/en/download/) and
[npm](https://docs.npmjs.com/downloading-and-installing-packages-locally) must be installed first.

## Installation

To install the PayID CLI, run the command:

```
npm install -g @payid-org/payid-cli
```

## Interactive vs single command mode

CLI can be run in interactive mode or non-interactive (single command) mode.
In interactive mode, a prompt is shown where multiple commands can be run until the `exit` command is run.
Interactive mode retains a history of commands run which can be accessed using the up arrow key. Command completion
is available using the tab key.

In non-interactive mode, a single command is run (based on supplied command line arguments) and then the CLI exits.
No prompt is shown in this mode. This mode is useful for running commands from a script as well as chaining the results
of multiple commands together.

To run the CLI in interactive mode, run `payid`.

To run the CLI in non-interactive, run `payid <command> <arguments>`. Examples:

```
payid load 'nhartner$xpring.money'
```

Or to run multiple commands:

```
payid init 'my$pay.id' && payid crypto-address add btc mainnet notARealAddress && payid save
```

_Note_: when passing a PayID as an argument in non-interactive mode, the PayID needs to be escaped or quoted  
to avoid the '\$' being interpolated as a variable by the shell.

## Commands

The following commands are available:

```
    help [command...]                                                  Provides help for a given command.
    exit                                                               Exits application.
    clear                                                              clear the terminal
    crypto-address add <paymentNetwork> <environment> <address> [tag]  start building a new PayID
    crypto-address remove <address>                                    remove an address from the current PayID
    keys clear                                                         clears all loaded keys
    keys generate                                                      generates and saves a new identity key
    keys list                                                          lists keys that have been loaded
    keys load <filePath>                                               load identity-key from file
    keys print                                                         print keys that have been loaded in pem format
    init <payid>                                                       initializes a new PayID
    inspect [payId]                                                    Inspect signatures on the loaded PayID or from an optionally specified PayID
    load <payId>                                                       loads a PayID from PayID server
    show                                                               Shows the currently loaded PayID
    sign                                                               sign the loaded PayID with the loaded signing keys
    verify [payId]                                                     Verify the loaded PayID or an optionally specified PayID
    save                                                               Save the currently loaded PayID
    from-url <url>                                                     convert a URL to a PayID
    to-url <payId>                                                     converts PayID to url

```

## Use Cases

### Loading a PayID

The following command can be used to load an existing PayID from a remote server:

```
load nhartner$xpring
```

This will fetch all the PayID address mappings for the given PayID from the remote
server and displays the resulting JSON.

### Creating a new PayID

The following set of commands demonstrates how to create a new PayID, attach multiple
address mappings and save the result to a JSON file.

```
init example$mypayid.com
crypto-address add xrpl mainnet rP3t3JStqWPYd8H88WfBYh3v84qqYzbHQ6 12345
crypto-address add btc mainnet 3M2CH71P6uZTra1PsjiEhNFB7kCENShCgt
save
```

The end result should be a PayID json representation being saved to the local filesystem as
example.json.

### Identity Keys

The PayID protocol supports signing address mappings using one or more cryptographic keys.
The CLI provides several commands for generating and loading keys. Once a key is generated
or loaded by the CLI, it is retained in the CLI's local storage for use in signing your PayID.
Multiple identity keys can be generated or loaded using the `keys generate` and `keys load` commands.
To remove all loaded keys from the CLI's local storage, use the `keys clear` command.
The `keys list` command will show you all keys currently loaded into the CLI.

To generate new key run:

```
keys generate
```

This will generate a new key and save it to a file named `identity-key.pem`. To load a previously
created identity key, run `keys load </path/to/pem/file>`.

### Signing a PayID

In order to sign an PayID, it must either be loaded using the `load` command or created using the
`init` command (as well as executing commands to add 1 or more addresses). Once a PayID has been
initialized or loaded, it can be signed using an identity key (refer to the above section).

Once your PayID has been loaded or initialized, and your identity key has been generated or loaded,
you can sign the PayID using the command `sign`. This command will signed each of your PayID address
mappings using the loaded identity keys and out the resulting PayID with verifiedAddress. The `save`
command can be used to save your PayID, with signed addresses, to file.

### Inspecting a Verified PayID

Two commands are available to verify a PayID's verified addresses.

- `verify` - checks if all the verified addresses have valid signatures.
- `inspect` - displays details information about each verified address and signatures.

## Creating, Signing and Inspecting a PayID

Bringing all the above commands together, we can create a PayID, add an address mapping, generate an identity key,
sign our PayID address mapping and then inspect the final result.

```
init example$mypayid.com
crypto-address add xrpl mainnet rP3t3JStqWPYd8H88WfBYh3v84qqYzbHQ6
keys generate
sign
inspect
```
