'use strict';

const Base = require('./base');

class Leader extends Base {
    setManager(manager){
        super.setManager(manager);

        this._appendEntriesResponse = this._appendEntriesResponse.bind(this);
    }

    run() {
	    super.run();
	    
        this._manager.on('appendEntriesResponse', this._appendEntriesResponse);

        this._timer.start(() => {
	        this._manager.emit('appendEntries', {});
        }, 100);
    }

    stop(){
        super.stop();

        this._manager.removeListener('appendEntriesResponse', this._appendEntriesResponse);
    }

    _appendEntriesResponse({term, success}){
        //If there exists an N such that N > commitIndex, a majority
        //of matchIndex[i] ? N, and log[N].term == currentTerm:
        //set commitIndex = N (5.3, 5.4)
        // TODO: release addCmd promise for concrete log index


        this._checkCommit();
        this._checkTerm(term);
    }
    
    addCmd(cmd){
        // TODO: waite majority response and resolve
        return new Promise((resolve) => {

        });
    }
}

module.exports = Leader;
