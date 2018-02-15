const Point = require('./Point');
const util = require('util');

class Nomination {
    constructor(name, condition, minCount, msg, points) {
        this._name = name;
        this._condition = condition;
        this._msg = msg;
        this._points = !points ? [] : points;
        this._minScore = minCount;
    }
    getName() {
        return this._name
    };
    getCondition() {
        return this._condition;
    }
    scoreMatch(match, player_slot) {
        this.addPoint(match.match_id, this._condition(match, player_slot));
    }
    addPoint(match_id, val) {
        this._points.push(new Point(match_id, val));
        while(this._points.length > 20) {
            this._points.shift();
        }
    }
    getPoints() {
        return this._points;
    }
    getScore() {
        return this._points.reduce((r, p) => {
            return p != null ? r + p.point : r;
        }, 0);
    }
    getMessage() {        
        return util.format(this._msg, this.getScore());
    }
    isCorrupted() {
        return this._points.every(point => point.point === null);
    }
    getMinScore() {
        return this._minScore;
    }
}

module.exports = Nomination;