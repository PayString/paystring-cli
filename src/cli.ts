#!/usr/bin/env node

import * as Vorpal from 'vorpal'

import * as cmd from './commands'

const vorpal = new Vorpal()

// This enables command history within the CLI similar to bash.
vorpal.history('payString')

const localStorage = new cmd.LocalStorage('payString', vorpal)
new cmd.ClearCommand(vorpal, localStorage).setup()
new cmd.AddCryptoAddressCommand(vorpal, localStorage).setup()
new cmd.RemoveCryptoAddressCommand(vorpal, localStorage).setup()
new cmd.ClearKeysCommand(vorpal, localStorage).setup()
new cmd.GenerateIdentityKeyCommand(vorpal, localStorage).setup()
new cmd.ListKeysCommand(vorpal, localStorage).setup()
new cmd.LoadIdentityKeyCommand(vorpal, localStorage).setup()
new cmd.PrintKeysCommand(vorpal, localStorage).setup()
new cmd.InitPayStringCommand(vorpal, localStorage).setup()
new cmd.InspectPayStringCommand(vorpal, localStorage).setup()
new cmd.LoadPayStringCommand(vorpal, localStorage).setup()
new cmd.ShowPayStringCommand(vorpal, localStorage).setup()
new cmd.SignPayStringCommand(vorpal, localStorage).setup()
new cmd.VerifyPayStringCommand(vorpal, localStorage).setup()
new cmd.SavePayStringCommand(vorpal, localStorage).setup()
new cmd.UrlToPayStringCommand(vorpal, localStorage).setup()
new cmd.PayStringToUrlCommand(vorpal, localStorage).setup()

// The CLI can be run in interactive mode or to run a single command and terminate.
// For CLI mode, process.argv will have 2 values (e.g. node dist/cli.js) even if using the alias 'paystring-utils'.
// For single command mode there will be additional arguments for the single command.
if (process.argv.length > 2) {
  vorpal.parse(process.argv)
} else {
  vorpal.delimiter('$').show()
}
