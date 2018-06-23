import uuid from 'uuid/v4';
import {PlayerPosition, IPlayer, IPlayerStats} from 'game/models';
import {sample, randf, randi} from 'game/util';

// prettier-ignore
const firstNames =
[ "Markus", "Mikko", "Patrik", "Jesse", "Teemu", "Markus", "Niko", "Sebastian", "Sakari", "Mikko", "Juha", "Jarno", "Tommi", "Vili", "Harri", "Ville", "Janne", "Mikko", "Mika", "Antti", "Juuso", "Valtteri", "Ari", "Juuso", "Otso", "Tuomas", "Arttu", "Juhani", "Ilkka", "Toni", "Tero", "Otto", "Sebastian", "Jesse", "Antti", "Henrik", "Juha-Pekka", "Matti", "Miro", "Jani", "Lassi", "Joonas", "Eero", "Kristian", "Joonas", "Mikko", "Tommi", "Dave", "Lasse", "Sami", "Markku", "Kalle", "Jussi", "Veli-Matti", "Anssi", "Mikael", "Rony", "Jani", "Jasse", "Jere", "Saku", "Juha-Pekka", "Aleksi", "Valtteri", "Jani", "Janne", "Filip", "Niko", "Julius", "Jarkko", "Juha", "Arto", "Lasse", "Henrik", "Aleksi", "Veli-Matti", "Jukka", "Juuso", "Petteri", "Roope", "Sami", "Joni", "Tapio", "Tomi", "Arttu", "Robert", "Heikki", "Teemu", "Aleksi", "Esa", "Jari", "Joona", "Juha", "Eero", "Kalle", "Jake", "Joonas", "Masi", "Lauri", "Stefan", "Sami", "Alexander", "Kim", "Turo", "Hannes", "Jan", "Ville", "Jesper", "Teemu", "Aleksi", "Teemu", "Antti", "Jan-Mikael", "Henri", "Henrik", "Petr", "Ilmari", "Juhani", "Jiri", "Joonas", "Matias", "Jan-Mikael", "Mikko", "Ilkka", "Henri", "Joel", "Per", "Marko", "Jarkko", "Kim", "Mika", "Joni", "Ville-Vesa", "Toni", "Arttu", "Jere", "Joonas", "Juho", "Saku", "Petteri", "Jarkko", "Eemeli", "Julius", "Roope", "Elmeri", "Teemu", "Olli", "Simon", "Valtteri", "Sebastian", "Joonas", "Victor", "Mikko", "Mikael", "Peter", "Oskari", "Antti", "Santeri", "Arttu", "Aki", "Veeti", "Joonas", "Sami", "Erik", "Miika", "Ville", "Markus", "Janne", "Santeri", "Henrik", "Daniel", "Ville", "Christopher", "Oskari", "Peter", "Jyri", "Matias", "Waltteri", "Nico", "Mikko", "Miika", "Pekka", "Petri", "Jonne", "Mikael", "Mikko", "Ville", "Konsta", "Mike", "Markus", "Topi", "Tuomas", "Lauri", "Ville", "Tuomas", "Valtteri", "Antti", "Iikka", "Ville", "Jani", "Saku", "Janne", "Elias", "Miika", "Juuso", "Mikko", "Elmeri", "Tomi", "Tomi", "Joonas", "Antti", "Atte", "Tapio", "Juuso", "Ville", "Toni", "Eetu-Ville", "Nestori", "Miro-Pekka", "Valtteri", "Ville", "Niko", "Aleksi", "Atte", "Ville", "Mikko", "Patrik", "Olli", "Robert", "Simo-Pekka", "Timi", "Ossi-Petteri", "Markus", "Toni", "Jyri", "Jussi", "Jonne", "Niklas", "Miika", "Mikko", "Antti", "Juuso", "Tomas", "Teemu", "Severi", "Miihkali", "Ari", "Tommi", "Jyri", "Antti", "Joonas", "Joonas", "Otto", "Juho", "Joona", "Matti", "Juuso", "Kimi", "Julius", "Joel", "Taavi", "Otto", "Patrik", "Joonas", "Mikael", "Simon", "Niko", "Olli", "Antti", "Olavi", "Mikko", "Henri", "Otto", "Miska", "Petteri", "Urho", "Mikko", "Markus", "Miska", "Jaakko", "Martti", "Mikko", "Tuukka", "Aleksi", "Taneli", "Tommi", "Joose", "Miro", "Miro", "Manu", "Henri", "Teemu", "Eemeli", "William", "Otto", "Markus", "Sebastian", "Antti", "Robin", "Mathias", "Niklas", "Olli", "Markus", "Niklas", "Niclas", "Panu", "Roni", "Juuso", "Teemu", "Sami", "Matias", "Riku", "Ville", "Tomi", "Robert", "Matias", "Miro", "Mikko", "Nico", "Aleksi", "Aleksi", "Miikka", "Sami", "Roope", "Joonas", "Janne", "Esa", "Matti", "Topi", "Julius", "Eetu", "Olli", "Teemu", "Eetu", "Ville", "Michael", "Tommi", "Kevin", "Joona", "Miikka", "Christian", "Gabriel", "Eetu", "Jere", "Henri" ]

// prettier-ignore
const lastNames =
    [ "Pekkala", "Pietilä", "Rasilainen", "Rautiainen", "Rautio", "Ruokonen", "Ruusu", "Rämö", "Saari", "Setänen", "Similä", "Sundfors", "Tanus", "Tarkki", "Tarkki", "Toivonen", "Tornberg", "Urpolahti", "Vehviläinen", "Viitala", "Viksten", "Väliharju", "Husso", "Juvonen", "Järvenpää", "Järvinen", "Järvinen", "Jääskä", "Karjalainen", "Kilpeläinen", "Kinnunen", "Kiviaho", "Kulmala", "Kähkönen", "Laakso", "Lassila", "Laurikainen", "Lehtinen", "Lehtonen", "Lehtonen", "Lipiäinen", "Markkanen", "Myllyniemi", "Niemi", "Noronen", "Nuto", "Ahonen", "Hopponen", "Huhtanen", "Järvinen", "Kainulainen", "Karjalainen", "Karjalainen", "Katosalmi", "Kestilä", "Koivula", "Lehtonen", "Nieminen", "Nikko", "Nurmi", "Rajaniemi", "Rinne", "Saikkonen", "Lammikko", "Leskinen", "Pitkänen", "Saari", "Kuokkanen", "Moisio", "Anttila", "Lindsten", "Parikka", "Varttinen", "Karvinen", "Kuru", "Ruuskanen", "Saramäki", "Karhunen", "Kulmala", "Perhonen", "Santala", "Viljanen", "Pulli", "Hahl", "Hyvärinen", "Tuomisto", "Carlsson", "Nisula", "Ruokonen", "Virtanen", "Friman", "Hämäläinen", "Mäkelä", "Männikkö", "Sandell", "Elimäki", "Huovinen", "Kettunen", "Lehikoinen", "Lamberg", "Piipponen", "Valtonen", "Tuulola", "Iisakka", "Kaislehto", "Koivistoinen", "Rajala", "Jaatinen", "Hurri", "Komulainen", "Rauhala", "Tommila", "Harjama", "Kuparinen", "Rajala", "Koivisto", "Nyqvist", "Sund", "Vartiainen", "Honkaheimo", "Moisio", "Niemelä", "Saha", "Suoranta", "Tuhkanen", "Vainio", "Halonen", "Vauhkonen", "Alikoski", "Heino", "Karvinen", "Siikonen", "Nokelainen", "Vaakanainen", "Virtanen", "Västilä", "Pentikäinen", "Sammalkangas", "Walli", "Ahlgren", "Hyvärinen", "Arkiomaa", "Koponen", "Lähde", "Saarelainen", "Virkkunen", "Hämäläinen", "Mikkola", "Mäkelä", "Mäkinen", "Vainikainen", "Vainonen", "Virta", "Malmivaara", "Riikola", "Lahtinen", "Grönholm", "Kankaanperä", "Suuronen", "Junnila", "Timonen", "Virtanen", "Friman", "Niemi", "Puhakka", "Rissanen", "Koivisto", "Nykopp", "Åsten", "Heikkilä", "Niemelä", "Bruun", "Vainio", "Rinkinen", "Sillanpää", "Teppo", "Vallin", "Välimaa", "Niemi", "Marttinen", "Sointu", "Hopponen", "Manelius", "Kukkonen", "Lahti", "Saravo", "Lammassaari", "Tammela", "Kuronen", "Pukka", "Koho", "Mäkinen", "Jokinen", "Nättinen", "Pihlman", "Tukonen", "Uusitalo", "Huhtanen", "Hotakainen", "Jaatinen", "Kangasniemi", "Leskinen", "Forsström", "Kinnunen", "Kolehmainen", "Karvonen", "Koivisto", "Pulli", "Viitanen", "Eronen", "Peltonen", "Körkkö", "Rask", "Kalapudas" ]

const generateRandomName = () => `${sample(firstNames)} ${sample(lastNames)}`;

export const isGoaliePosition = (position: PlayerPosition) => position === PlayerPosition.Goalie;
export const isDefensePosition = (position: PlayerPosition) => position === PlayerPosition.Defense;
export const isLeftWingPosition = (position: PlayerPosition) =>
  position === PlayerPosition.LeftWing;
export const isCenterPosition = (position: PlayerPosition) => position === PlayerPosition.Center;
export const isRightWingPosition = (position: PlayerPosition) => position === PlayerPosition.Goalie;
export const isGoalieOrDefensePosition = (position: PlayerPosition) =>
  isGoaliePosition(position) || isDefensePosition(position);
export const isForwardPosition = (position: PlayerPosition) =>
  isLeftWingPosition(position) || isCenterPosition(position) || isRightWingPosition(position);

export function createPlayerStats(): IPlayerStats {
  return {
    gamesPlayed: 0,
    goals: 0,
    goalsAgainst: 0,
    assists: 0,
    shots: 0,
    shotsAgainst: 0,
  };
}

export function createRandomPlayer(
  position: PlayerPosition,
  minSkill: number,
  maxSkill: number,
): IPlayer {
  const otherSkill = randf(0.1, maxSkill);
  const [attack, defense] = isForwardPosition(position)
    ? [randf(minSkill, maxSkill), otherSkill]
    : [otherSkill, randf(minSkill, maxSkill)];
  const [attackPotential, defensePotential] = isForwardPosition
    ? [randf(attack, 100), randf(defense, otherSkill)]
    : [randf(attack, otherSkill), randf(defense, 100)];

  return {
    id: uuid(),
    name: generateRandomName(),
    age: randi(18, 40),
    position,
    attack,
    defense,
    attackPotential,
    defensePotential,
    fitness: 100,
    morale: 100,
    stats: createPlayerStats(),
  };
}

function randomPlayerPosition() {
  const r = randi(0, 26);
  if (r < 3) {
    return PlayerPosition.Goalie;
  } else if (r < 11) {
    return PlayerPosition.Defense;
  } else if (r < 16) {
    return PlayerPosition.LeftWing;
  } else if (r < 21) {
    return PlayerPosition.Center;
  } else {
    return PlayerPosition.RightWing;
  }
}

export function createRandomPlayerPool(size: number): IPlayer[] {
  const playerPool = [];

  for (let i = 0; i < size; i++) {
    playerPool.push(createRandomPlayer(randomPlayerPosition(), 0.1, 100));
  }

  return playerPool;
}

export function getPlayerSkillForPosition(position: PlayerPosition, player: IPlayer): number {
  if (isGoaliePosition(position) || isDefensePosition(position)) {
    return player.defense;
  } else if (isCenterPosition(position)) {
    return player.defense + player.attack;
  } else {
    return player.attack;
  }
}

export function getPlayerSkill(player: IPlayer): number {
  return getPlayerSkillForPosition(player.position, player);
}
