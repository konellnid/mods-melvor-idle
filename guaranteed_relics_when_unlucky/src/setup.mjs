export function setup(ctx) {
    game.skills.forEach(skill => {
        if (skill.hasAncientRelics && skill.ancientRelicSets.has(game.defaultRealm))
            skill.ancientRelicSets.get(game.defaultRealm).levelUpUnlocks = [20, 40, 60, 80, 99];
    });

    ctx.patch(Skill, 'unlockAncientRelicsOnLevelUp').replace(function (o, oldLevel, newLevel) {
        if (!this.hasAncientRelics || !this.game.currentGamemode.allowAncientRelicDrops)
            return;
        this.ancientRelicSets.forEach((relicSet) => {
            if (relicSet.levelUpUnlocks.length === 0 || relicSet.isComplete)
                return;
            const guaranteedRelics = relicSet.levelUpUnlocks.filter(level => newLevel >= level).length;
            const foundRelics = relicSet.relicDrops.filter((drop) => relicSet.isRelicFound(drop.relic)).length;

            if (guaranteedRelics > foundRelics) {
                const relicsToUnlock = guaranteedRelics - foundRelics;
                this.unlockRelicDrops(relicSet, relicsToUnlock);
            }
        });
    });
}
