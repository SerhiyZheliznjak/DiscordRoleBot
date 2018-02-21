import { Nomination } from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import { Constants } from "../../Constants";
import { Point } from "../Point";

export class OponentOwsMoney extends Nomination {
    constructor(protected points?: Point[]) {
        super(points);
        this.name = 'Суперник мені гроші винен';
        this.minScore = 10;
        this.msg = 'Ну то тіпа капець';
    }

    protected scorePoint(match, player_slot) {
        const player = DotaParser.getPlayerInfo(match, player_slot);
        return !!player && player.kills === 0 ? 1 : 0;
    }
}