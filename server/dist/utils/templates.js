export function chooseTemplate(ctx) {
    const { energy, timeAvailableMin, goals } = ctx;
    const primaryGoal = goals[0] || 'hypertrophy';
    // Rough template shapes
    if (energy <= 2)
        return { type: 'low', blocks: 4, targetSets: [2, 2, 2, 2], repScheme: ['12-15', '12-15', '10-12', '10-12'], restSec: 60, goal: primaryGoal };
    if (energy >= 4 && timeAvailableMin >= 60)
        return { type: 'high', blocks: 6, targetSets: [4, 4, 3, 3, 3, 3], repScheme: ['3-5', '5-6', '8-10', '8-10', '10-12', '10-12'], restSec: 150, goal: primaryGoal };
    return { type: 'medium', blocks: 5, targetSets: [3, 3, 3, 3, 3], repScheme: ['6-8', '6-8', '8-10', '10-12', '10-12'], restSec: 90, goal: primaryGoal };
}
