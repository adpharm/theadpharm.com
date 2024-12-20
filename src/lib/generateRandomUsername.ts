import { logDebug } from "./utils.logger";

const xmasCharacters = [
  "Rudolph",
  "Santa",
  "Frosty",
  "Gingerbread",
  "Grinch",
  "CandyCane",
  "Nutcracker",
  "Snowman",
  "Mistletoe",
  "Reindeer",
  "Sleigh",
  "Stocking",
  "Tinsel",
  "Angel",
  "Carol",
  "Christmas",
  "December",
  "Elf",
];

export const generateRandomUsername = () => {
  // get an index from the xmasCharacters array
  const randomIndex = Math.floor(Math.random() * xmasCharacters.length);

  // get a random character
  const randomCharacter = xmasCharacters[randomIndex];

  // attach 2 random digits to the end
  const randomDigits = Math.floor(Math.random() * 100);

  // return the username
  return `${randomCharacter}${randomDigits}`;
};

/**
 * Generate a random username from a name
 * Example: "Jim Montgomery" -> "DecemberJim32" / "ElfMontgomery21"
 * @param name
 * @returns
 */
export const generateRandomUsernameFromName = (
  name: string | undefined | null,
) => {
  if (!name) {
    return generateRandomUsername();
  }

  const nameParts = name.split(" ");
  const firstName = nameParts[0];

  // capitalize the first name
  const capitalizedFirstName =
    firstName.charAt(0).toUpperCase() + firstName.slice(1);

  // get an index from the xmasCharacters array
  const randomIndex = Math.floor(Math.random() * xmasCharacters.length);

  // get a random character
  const randomCharacter = xmasCharacters[randomIndex];

  // attach the first name and 2 random digits to the end
  const randomDigits = Math.floor(Math.random() * 100);

  // return the username
  return `${randomCharacter}${capitalizedFirstName}${randomDigits}`;
};
