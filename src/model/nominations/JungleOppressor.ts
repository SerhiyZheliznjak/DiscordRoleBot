import { Nomination } from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import { Constants } from "../../Constants";
import { Point } from "../Point";

export class JungleOppressor extends Nomination {
    constructor(protected points?: Point[]) {
        super(points);
        this.name = 'Гнобитель Джунглів';
        this.minScore = 1;
        this.msg = 'Пацани не шарю що ви там робите, але я цілі джунглі пресую!';
    }

    protected scorePoint(match, player_slot) {
        const player = DotaParser.getPlayerInfo(match, player_slot);
        if (!player || !player.damage) {
            return null;
        }
        let jungleDamaged = 0;
        let objectiveDamage = 0;
        for (var target in player.damage) {
            if (player.damage.hasOwnProperty(target)) {
                if (target.indexOf(Constants.JUNGLE_TARGETS_IDENTIFIER) === 0) {
                    jungleDamaged += player.damage[target];
                } else {
                    objectiveDamage += player.damage[target];
                }
            }
        }
        return jungleDamaged > objectiveDamage ? 1 : 0;
    }
}