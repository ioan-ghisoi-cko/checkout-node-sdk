const world = '🗺️';

export function hello(word: string = world): string {
    return `Hello ${world}! `;
}

hello("johnny");
