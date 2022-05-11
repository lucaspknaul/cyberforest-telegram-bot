# Description

This bot is intended to join a Telegram channel and answer to keywords with pre-programmed messages and send messages from a Discord news channel to the Telegram channel.

# Working

This bot uses the Telegram API to connect to Telegram and listen to users on the main channel (with a prefix) or private messages.

It also connects to a Discord channel and posts it's messages on the Telegram channel.

# Architecture

The bot was implemented as a script in Nodejs to keep it simple and easy to edit. 

# Current State

It wasn't tested recently but it should work as Telegram and Discord API are supposed to be resilient without breaking changes.

# Credentials:

Enter API Tokens on `credentials.yaml`

# Configuration:

Enter configurations on `config.yaml`

# Execution:

Run `node bot.mjs`
