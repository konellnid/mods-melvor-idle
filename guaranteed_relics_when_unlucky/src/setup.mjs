export function setup(ctx) {
    ctx.settings.section('General').add([
        {
            type: 'label',
            name: 'info',
            label: 'Note that order here does NOT matter and numbering here does NOT correspond to numbering of relics in game.',
            hint: 'You can set the value to 121 (or 100 without TotH) to disable a guaranteed drop'
        },
        {
        type: 'number',
        name: 'guaranteed_relic_1',
        label: 'First guaranteed relic',
        hint: 'Number from 0 to 121',
        default: 20
        },
        {
        type: 'number',
        name: 'guaranteed_relic_2',
        label: 'Second guaranteed relic',
        hint: 'Number from 0 to 121',
        default: 40
        },
        {
        type: 'number',
        name: 'guaranteed_relic_3',
        label: 'Third guaranteed relic',
        hint: 'Number from 0 to 121',
        default: 60
        },
        {
        type: 'number',
        name: 'guaranteed_relic_4',
        label: 'Fourth guaranteed relic',
        hint: 'Number from 0 to 121',
        default: 80
        },
        {
        type: 'number',
        name: 'guaranteed_relic_5',
        label: 'Fifth guaranteed relic',
        hint: 'Number from 0 to 121',
        default: 99
        },
    ]);

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
