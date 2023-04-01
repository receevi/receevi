export class IncompleteSetupError extends Error {
    constructor() {
        super("Incomplete setup. Please call /setup first")
    }
}
