# `@payid-org/payid-cli`

![NPM version badge](https://img.shields.io/npm/v/@payid-org/payid-cli)

Command-line interface to create, fetch, sign, and verify PayIDs.
Based on the Typescript PayID [Utils](https://github.com/payid-org/utils) library.

## Prerequisites

Before you install PayID CLI locally, ensure that both [node](https://nodejs.org/en/download/) and
[npm](https://docs.npmjs.com/downloading-and-installing-packages-locally) are installed locally.

You can also run PayID CLI as a Docker container. If you run commands that cause information to be stored locally, that information only persists for the duration of the container.

## Installation

To install PayID CLI, run the command:

```
npm install -g @payid-org/payid-cli
```

This command installs PayID CLI as a global npm module and links it as a `payid` executable
(typically under /usr/local/bin/payid).

Alternatively, install and run via Docker:

```
docker run xpring/payid-cli
```

## Interactive vs. single command mode

You can run PayID CLI in either interactive mode or non-interactive (single command) mode.
In interactive mode, a prompt is displayed, and you can run multiple commands from this prompt. Run the `exit` command to leave interactive mode.

Interactive mode retains a history of executed commands that you can access by with the up arrow key. Use the <Tab> key for command completion.
    
In non-interactive mode, you run a single command, based on supplied command line arguments, and then the CLI exits.
No prompt is displayed in this mode. Non-interactive mode is useful for running commands from a script, or to chain the results
of multiple commands together.

To run the CLI in interactive mode, run `payid`. You can now enter `<command> arguments` for each command you want to run. 

To run the CLI in non-interactive mode, run `payid <command> <arguments>`. 

Examples of non-interactive mode:

The following command lists information about the specified PayID.

```
payid load 'nhartner$xpring.money'
```

You can run multiple commands chained together. This set of commands initializes a new or existing PayID, associates a specified crypto-address for the specified currency and network, and then saves the PayID with this information. 

```
payid init 'my$pay.id' && payid crypto-address add btc mainnet notARealAddress && payid save
```

_Note_: when passing a PayID as an argument in non-interactive mode, the PayID must be escaped or quoted  
to avoid the '\$' being interpolated as a variable by the shell.

## Commands

The following commands are available:

```
    help [command...]                                                  Provides help for a given command.
    exit                                                               Exits application.
    clear                                                              Clears the terminal.
    crypto-address add <paymentNetwork> <environment> <address> [tag]  Starts building a new PayID.
    crypto-address remove <address>                                    Removes an address from the current PayID.
    keys clear                                                         Clears all loaded keys.
    keys generate                                                      Generates and saves a new identity key.
    keys list                                                          Lists keys that have been loaded.
    keys load <filePath>                                               Loads identity-key from file.
    keys print                                                         Prints keys that have been loaded in pem format.
    init <payid>                                                       Initializes a new PayID.
    inspect [payId]                                                    Inspects signatures on the loaded PayID or from an optionally specified PayID.
    load <payId>                                                       Loads a PayID from PayID server.
    show                                                               Shows the currently loaded PayID.
    sign                                                               Signs the loaded PayID with the loaded signing keys.
    verify [payId]                                                     Verifies the loaded PayID or an optionally specified PayID.
    save                                                               Saves the currently loaded PayID.
    from-url <url>                                                     Converts a URL to a PayID.
    to-url <payId>                                                     Converts a PayID to a URL.

```

## Use Cases

### Load a PayID

Load an existing PayID from a remote server:

```
load nhartner$xpring.money
```

This command fetches all the PayID address mappings for the given PayID from the remote
server and displays the resulting JSON.

### Create a new PayID

The following set of commands demonstrates how to create a new PayID, attach multiple
address mappings, and save the result to a JSON file.

```
init example$mypayid.com
crypto-address add xrpl mainnet rP3t3JStqWPYd8H88WfBYh3v84qqYzbHQ6 12345
crypto-address add btc mainnet 3M2CH71P6uZTra1PsjiEhNFB7kCENShCgt
save
```

The PayID JSON representation specified here is saved to the local filesystem as example.json.

### Identity Keys

The PayID protocol supports signing address mappings using one or more cryptographic keys.
PayID CLI provides several commands to generate and load keys. Once a key is generated
or loaded by PayID CLI, it is retained in PayID CLI's local storage for use when you sign your PayID.

You can generate multiple identity keys by using the `keys generate` and `keys load` commands.

To remove all loaded keys from the CLI's local storage, use the `keys clear` command.
To see all keys currently loaded into PayID CLI, use the `keys list` command.

To generate a new key run:

```
keys generate
```

This generates a new key and saves it to a file named `identity-key.pem`. To load a previously
created identity key, run `keys load </path/to/pem/file>`.

### Sign a PayID

Before you sign an PayID, you must either load the PayID using the `load` command, or create a PayID using the
`init` command, and you must execute commands so that the PayID one or more crypto-addresses. 

Once a PayID has been initialized or loaded, you can sign it using an [identity key](#identity-keys). You must either generate a new key, or load an existing one. Once your PayID has been loaded or initialized, and your identity key has been generated or loaded,
you can sign the PayID using `sign` command. The `sign` command signs each of your PayID address
mappings using the loaded identity keys, and outputs the resulting PayID with a `verifiedAddress` field. Run the `save`
command to save your PayID, with signed addresses, to file.

### Inspect a Verified PayID

Two commands are available to verify a PayID's verified addresses.

- `verify` - checks if all the verified addresses have valid signatures.
- `inspect` - displays details information about each verified address and signatures.

## Create, sign, and inspect a PayID

With a combination of commands, you can create a PayID, add an address mapping, generate an identity key,
sign your PayID address mapping, and then inspect the final result.

```
init example$mypayid.com
crypto-address add xrpl mainnet rP3t3JStqWPYd8H88WfBYh3v84qqYzbHQ6
keys generate
sign
inspect
```
