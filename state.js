'use strict';

class State{
    constructor(){
        this._currentTerm = 0;
        this._votedFor = null;
        this._logEntriest = [];

        this._commitIndex = 0;
        this._lastIndex = 0;

        this._nextIndex = 0;
        this._matchIndex = 0;
    }


}

module.exports = State;
