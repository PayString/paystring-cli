# `@paystring/paystring-cli`

![NPM version badge](https://img.shields.io/npm/v/@paystring/paystring-cli)

Command-line interface to create, fetch, sign, and verify PayStrings.
Based on the Typescript PayString [Utils](https://github.com/paystring/utils) library.

## Prerequisites

Before you install PayString CLI locally, ensure that both [node](https://nodejs.org/en/download/) and
[npm](https://docs.npmjs.com/downloading-and-installing-packages-locally) are installed locally.

You can also run PayString CLI as a Docker container. If you run commands that cause information to be stored locally, that information only persists for the duration of the container.

## Installation

To install PayString CLI, run the command:

```
npm install -g @paystring/paystring-cli
```

This command installs PayString CLI as a global npm module and links it as a `paystring` executable
(typically under /usr/local/bin/paystring).

Alternatively, install and run via Docker:

```
docker run xpring/paystring-cli
```

## Interactive vs. single command mode

You can run PayString CLI in either interactive mode or non-interactive (single command) mode.
In interactive mode, a prompt is displayed, and you can run multiple commands from this prompt. Run the `exit` command to leave interactive mode.

Interactive mode retains a history of executed commands that you can access by with the up arrow key. Use the <Tab> key for command completion.

In non-interactive mode, you run a single command, based on supplied command line arguments, and then the CLI exits.
No prompt is displayed in this mode. Non-interactive mode is useful for running commands from a script, or to chain the results
of multiple commands together.

To run the CLI in interactive mode, run `paystring`. You can now enter `<command> arguments` for each command you want to run.

To run the CLI in non-interactive mode, run `paystring <command> <arguments>`.

Examples of non-interactive mode:

The following command lists information about the specified PayString.

```
paystring load 'nhartner$xpring.money'
```

You can run multiple commands chained together. This set of commands initializes a new or existing PayString, associates a specified crypto-address for the specified currency and network, and then saves the PayString with this information.

```
paystring init 'my$paystring.com' && paystring crypto-address add btc mainnet notARealAddress && paystring save
```

_Note_: when passing a PayString as an argument in non-interactive mode, the PayString must be escaped or quoted  
to avoid the '\$' being interpolated as a variable by the shell.

## Commands

The following commands are available:

```
    help [command...]                                                  Provides help for a given command.
    exit                                                               Exits application.
    clear                                                              Clears the terminal.
    crypto-address add <paymentNetwork> <environment> <address> [tag]  Starts building a new PayString.
    crypto-address remove <address>                                    Removes an address from the current PayString.
    keys clear                                                         Clears all loaded keys.
    keys generate                                                      Generates and saves a new identity key.
    keys list                                                          Lists keys that have been loaded.
    keys load <filePath>                                               Loads identity-key from file.
    keys print                                                         Prints keys that have been loaded in pem format.
    init <paystring>                                                   Initializes a new PayString.
    inspect [paystring]                                                Inspects signatures on the loaded PayString or from an optionally specified PayString.
    load <paystring>                                                   Loads a PayString from PayString server.
    show                                                               Shows the currently loaded PayString.
    sign                                                               Signs the loaded PayString with the loaded signing keys.
    verify [paystring]                                                 Verifies the loaded PayString or an optionally specified PayString.
    save                                                               Saves the currently loaded PayString.
    from-url <url>                                                     Converts a URL to a PayString.
    to-url <paystring>                                                 Converts a PayString to a URL.

```

## Use Cases

### Load a PayString

Load an existing PayString from a remote server:

```
load nhartner$xpring.money
```

This command fetches all the PayString address mappings for the given PayString from the remote
server and displays the resulting JSON.

### Create a new PayString

The following set of commands demonstrates how to create a new PayString, attach multiple
address mappings, and save the result to a JSON file.

```
init example$mypaystring.com
crypto-address add xrpl mainnet rP3t3JStqWPYd8H88WfBYh3v84qqYzbHQ6 12345
crypto-address add btc mainnet 3M2CH71P6uZTra1PsjiEhNFB7kCENShCgt
save
```

The PayString JSON representation specified here is saved to the local filesystem as example.json.

### Identity Keys

The PayString protocol supports signing address mappings using one or more cryptographic keys.
PayString CLI provides several commands to generate and load keys. Once a key is generated
or loaded by PayString CLI, it is retained in PayString CLI's local storage for use when you sign your PayString.

You can generate multiple identity keys by using the `keys generate` and `keys load` commands.

To remove all loaded keys from the CLI's local storage, use the `keys clear` command.
To see all keys currently loaded into PayString CLI, use the `keys list` command.

To generate a new key run:

```
keys generate
```

This generates a new key and saves it to a file named `identity-key.pem`. To load a previously
created identity key, run `keys load </path/to/pem/file>`.

### Sign a PayString

Before you sign an PayString, you must either load the PayString using the `load` command, or create a PayString using the
`init` command, and you must execute commands so that the PayString one or more crypto-addresses.

Once a PayString has been initialized or loaded, you can sign it using an [identity key](#identity-keys). You must either generate a new key, or load an existing one. Once your PayString has been loaded or initialized, and your identity key has been generated or loaded,
you can sign the PayString using `sign` command. The `sign` command signs each of your PayString address
mappings using the loaded identity keys, and outputs the resulting PayString with a `verifiedAddress` field.

By default, the sign command clears the unsigned `addresses` from the results. If you wish to
retain unsigned addresses after signing, use `sign --keep-addresses` or `sign -k` instead.

Finally, run the `save` command to save your PayString, with signed addresses, to file.

### Inspect a Verified PayString

Two commands are available to verify a PayString's verified addresses.

- `verify` - checks if all the verified addresses have valid signatures.
- `inspect` - displays details information about each verified address and signatures.

## Create, sign, and inspect a PayString

With a combination of commands, you can create a PayString, add an address mapping, generate an identity key,
sign your PayString address mapping, and then inspect the final result.

```
init example$mypaystring.com
crypto-address add xrpl mainnet rP3t3JStqWPYd8H88WfBYh3v84qqYzbHQ6
keys generate
sign
inspect
```

## Legal

By using, reproducing, or distributing this code, you agree to the terms and conditions for use (including the Limitation of Liability) in the [Apache License 2.0](https://github.com/paystring/payid-cli/blob/master/LICENSE). If you do not agree, you may not use, reproduce, or distribute the code. **This code is not authorised for download in Australia. Any persons located in Australia are expressly prohibited from downloading, using, reproducing or distributing the code.**
