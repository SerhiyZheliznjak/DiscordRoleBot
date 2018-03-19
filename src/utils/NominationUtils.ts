import PlayerRecentMatches from "../model/PlayerRecentMatches";
import PlayerFullMatches from "../model/PlayerFullMatches";
import { Observable } from "rxjs";
import { RecentMatchJson } from "../dota-api/DotaJsonTypings";
import Constants from "../Constants";
import NominationResult from "../model/NominationResult";

export default class NominationUtils {
    public isFreshMatch(recentMatch: RecentMatchJson): boolean {
        const nowInSeconds = new Date().getTime() / 1000;
        return nowInSeconds - recentMatch.start_time < Constants.MATCH_DUE_TIME_SEC;
    }

    public hasNewMatches(freshMatches: PlayerRecentMatches, storedMatches: PlayerRecentMatches): boolean {
        let hasNewMatch = false;
        if (this.noMatches(storedMatches)) {
            hasNewMatch = !this.noMatches(freshMatches);
        } else {
            if (!this.noMatches(freshMatches)) {
                hasNewMatch = this.freshMatchesNotStored(freshMatches, storedMatches);
            }
        }
        return hasNewMatch;
    }

    public noMatches(playerMatches: PlayerRecentMatches): boolean {
        return !playerMatches || !playerMatches.recentMatchesIds || !playerMatches.recentMatchesIds.length;
    }

    public freshMatchesNotStored(freshMatches: PlayerRecentMatches, storedMatches: PlayerRecentMatches): boolean {
        const notStored = freshMatches.recentMatchesIds.filter(match_id => storedMatches.recentMatchesIds.indexOf(match_id) < 0);
        return notStored.length > 0;
    }

    public getNewMatches(recentMatches: PlayerRecentMatches, storedMatches: PlayerRecentMatches): PlayerRecentMatches {
        if (this.hasNewMatches(recentMatches, storedMatches)) {
            return recentMatches;
        }
        return new PlayerRecentMatches(recentMatches.account_id, []);
    }

    public isClaimedNomination(newWinner: NominationResult, storedWinner: NominationResult): boolean {
        return !storedWinner || this.isOutOfDueDate(storedWinner)
            || newWinner.nomination.hasHigherScoreThen(storedWinner.nomination);
    }

    public isOutOfDueDate(storedWinner: NominationResult) {
        return new Date().getTime() - storedWinner.nomination.timeClaimed >= Constants.NOMINATION_DUE_INTERVAL;
    }

    public getNewRecords(hallOfFame: Map<number, NominationResult>, newResults: Map<number, NominationResult>): NominationResult[] {
        const newNominationsClaimed: NominationResult[] = [];
        for (const nominationName of newResults.keys()) {
            const newWinner = newResults.get(nominationName);
            if (newWinner.account_id !== Constants.UNCLAIMED && newWinner.nomination.isScored()) {
                const storedWinner = hallOfFame.get(nominationName);
                if (this.isClaimedNomination(newWinner, storedWinner)) {
                    newNominationsClaimed.push(newWinner);
                }
            }
        }
        return newNominationsClaimed;
    }

    public getPlayerFullMatches(pfm: PlayerFullMatches, match): PlayerFullMatches {
        if (match) {
            pfm.matches.push(match);
        }
        return pfm;
    }
}
