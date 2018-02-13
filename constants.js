let playersBeingObserved = [];

module.exports = {
    OBJECTIVE_FB: () => 'CHAT_MESSAGE_FIRSTBLOOD',
    JUNGLE_TARGETS_IDENTIFIER: () => 'npc_dota_neutral',
    DIRE_TOWER_TARGET_IDENTIFIER: () => 'npc_dota_badguys_tower',
    RADIANT_TOWER_TARGET_IDENTIFIER: () => 'npc_dota_goodguys_tower',
    PLAYERS_FILE_PATH: () => './storage/players.json',
    getPlayersBeingObserved: () => playersBeingObserved,
    setPlayersBeingObserved: arr => playersBeingObserved = arr
};