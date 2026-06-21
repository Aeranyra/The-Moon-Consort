export const weapons = [
    'a rubber chicken',
    'a suspiciously large fish',
    'a cursed spoon',
    'a moonbeam slingshot',
    'a rogue garden gnome',
    'an enchanted frying pan',
    'a glitter cannon',
    'a sentient breadstick',
    'a tiny shield made of moonlight',
    'a wet sock of destiny',
    'a dramatically oversized pool noodle',
    'a haunted umbrella',
];

export function randomWeapon() {
    return weapons[Math.floor(Math.random() * weapons.length)];
}
