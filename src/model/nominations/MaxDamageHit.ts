import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Constants from "../../Constants";
import { format } from 'util';
import Pair from "../Pair";

export class MaxDamageHit extends Nomination {
    constructor(protected points: Array<Pair<string, number | string>> = []) {
        super(points);
        this.name = 'Вірастюк';
        this.minScore = Constants.AM_HP;
        this.msg = 'Йобне раз, але сильно. Вбив %s антимагів одиним ударом!';
    }

    public getScore() {
        const dmgArr = this.getPoints().map(p => parseInt(p.p2 + ''));
        return Math.max(...dmgArr);
    }
    public getMessage() {
        return format(this.msg, this.roundToTwoDec(this.getScore() / Constants.AM_HP));
    }

    protected scorePoint(match, player_slot) {
        const player = DotaParser.getPlayerInfo(match, player_slot);
        return !!player && !!player.max_hero_hit && !!player.max_hero_hit.value ? player.max_hero_hit.value : null;
    }

    private roundToTwoDec(num) {
        return Math.round(num * 100) / 100;
    }
}
