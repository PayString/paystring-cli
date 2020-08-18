# `@payid-org/payid-cli`

![NPM version badge](https://img.shields.io/npm/v/@payid-org/payid-cli)

PayID CLI for creating, fetching, signing and verifying PayIDs. Based on the Typescript PayID Utils library.

## Prerequisites

In order to use the CLI, both [node](https://nodejs.org/en/download/) and 
[npm](https://docs.npmjs.com/downloading-and-installing-packages-locally) must be installed first. 

## Installation

To install the PayID CLI, run the command 
```
npm install -g @payid-org/payid-cli
```

## Interactive vs single command mode

CLI can be run in interactive mode or as a single command mode. 
In interactive mode, a prompt is shown where multiple commands can be run until the exit command is run.

In single command mode, a single command is run and then the CLI exits. No prompt is shown in this mode.
This mode is useful for running commands from a script, or from a shell where multiple commands can be
chained together or to pipe output to another application. 

To run the CLI in interactive mode, run ```payid```.

To run the CLI in single command mode, run ```payid <command> <arguments>```. Example: 
```
payid load 'nhartner$xpring.money'
```
_note: when passing a PayID as an argument in single command mode, the PayID needs to be quoted 
if run in a Linux shell (to avoid the '$' being interpolated as a variable by the Linux shell).

## Commands

A list of available commands can be found run running the `help` command.

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

- ```verify``` - checks if all the verified addresses have valid signatures
- ```insepct``` - displays details information about each verified address and signatures.