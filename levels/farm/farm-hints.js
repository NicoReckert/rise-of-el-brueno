import { HollowHint } from "../../classes/ui/hollow-hint.class.js";

export function createFarmHints(character, characters) {
  return [
    new HollowHint("Betreten", character, 80, 'desert'),
    new HollowHint("Begleiten", characters.cow, 80, 'desert'),
    new HollowHint("Warten", characters.cow, 120, 'desert'),
    new HollowHint("Belohnen", characters.cow, 80, 'rose'),
    new HollowHint("Haus Betreten", character, 80, 'desert'),
    new HollowHint("Noch nicht", character, 100, 'desert'),
  ];
}