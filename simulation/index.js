/* eslint import/no-extraneous-dependencies: 0 */ // --> OFF


import commander from 'commander'
import axios from 'axios'

import * as configMessage from '../POST MESSAGES/CONFIGURATION_MESSAGE.json'
import * as statusMessage from '../POST MESSAGES/STATUS_MESSAGE.json'
import * as initializationMessage from '../POST MESSAGES/INITIALIZATION_MESSAGE.json'

commander
  .version('v0.1')
  .option('-p, --port <n>', '8000', parseInt)
  .option('-m, --message <m>', 'Hello')
  .option('-t, --tester <t>', 'TEST_TESTER')
  .parse(process.argv)

const axiosConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
}

let data = null

switch (commander.message) {
  case 'INITIALIZATION':
    data = initializationMessage
    break
  case 'STATUS':
    data = statusMessage
    break
  case 'CONFIGURATION':
    data = configMessage
    break
  default:
    console.log('\x1b[31m', 'ARGS ERR!', '\x1b[0m', 'Please enter arguments')
    console.log('\x1b[31m', 'ARGS ERR!', '\x1b[0m', 'Usage: npm run tems -- --port [port] --message [MESSAGE TYPE] --tester [Tester Name]')
    console.log('\x1b[32m', 'INFO:', '\x1b[0m', 'Available messages: STATUS INITIALIZATION CONFIGURATION')
    console.log()
    console.log('\x1b[32m', 'INFO:', '\x1b[0m', 'Defaulting to npm run tems -- --port 8000 --message STATUS --tester TEST_TESTER')
    console.log()

    commander.port = '8000'
    commander.tester = 'TEST_TESTER'
    commander.message = 'STATUS'
}

const url = `http://localhost:${commander.port}/TEST_CELL/${commander.tester}/${commander.message}`
console.log('\x1b[34m', 'OUTPUT:', '\x1b[0m')

console.log(' ', url)

axios.post(url, data, axiosConfig)
  .then(r => console.log(' ', r.data))
  .catch(e => console.log('Error', e.response.status, e.response.statusText))
