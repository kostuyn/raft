'use strict';

const managerFactory = require('./manager');
const rpcFactory = require('./rpc');

const CommandHandler = require('./command_handler');

const timerFactory = require('./lib/timer');

// logger stub
const log = console;

const node1 = rpcFactory.createNode({}, log);
const node2 = rpcFactory.createNode({}, log);
const nodes = [node1, node2];

const cmdHandler = new CommandHandler(log);

const manager = managerFactory.create(timerFactory, nodes, cmdHandler, log);

const serverRunner = rpcFactory.createRunner({}, manager, log);

(async function(){
    await serverRunner.run();
})();


// manager.addCmd({cmd: "my cmd"});
