class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this.initial = config.initial;
        this.state = config.initial;
        this.states = config.states;
        this.history = [];
        this.history.push(this.initial);
        this.stage = 0;
        this.redoAvailability = false;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return String(this.state);
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (Object.keys(this.states).includes(state)) {
            this.redoAvailability = false;
            this.state = state;
            this.history.push(this.state);
        } else {
            throw new Error('State doesn\'t exist');
        }
        this.stage++;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        if (this.states[this.state].transitions[String(event)]) {
            this.redoAvailability = false;
            this.state = this.states[this.state].transitions[String(event)];
            this.history.push(this.state);
            this.stage++;
            this.history.slice(this.stage, this.history.lenght);
        } else {
            throw new Error('Event in currrent state doesn\'t exist');
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.state = this.initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let tempStates = Object.keys(this.states);
        if (event == null) {
            return tempStates;
        } else if (event != null){
            let tempStateArr = [];
            for (let i = 0; i < tempStates.length; i++) {
                if (this.states[tempStates[i]].transitions[String(event)] != undefined) {
                    tempStateArr.push(tempStates[i]);
                }
            }
            return tempStateArr;
        }
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.stage == 0) {
            return false;
        } else {
            this.redoAvailability = true;
            this.stage--;
            this.state = this.history[this.stage];
            return true;
        }

    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.history.length < 2 || this.redoAvailability == false || this.history.length - this.stage == 1) {
            return false;
        } else {
            this.stage++;
            this.state = this.history[this.stage];
            return true;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history = [];
        this.history.push(this.initial);
        this.stage = 0;
        this.redoAvailability = false;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/

const config = {
    initial: 'normal',
    states: {
        normal: {
            transitions: {
                study: 'busy',
            }
        },
        busy: {
            transitions: {
                get_tired: 'sleeping',
                get_hungry: 'hungry',
            }
        },
        hungry: {
            transitions: {
                eat: 'normal'
            },
        },
        sleeping: {
            transitions: {
                get_hungry: 'hungry',
                get_up: 'normal',
            },
        },
    }
};
