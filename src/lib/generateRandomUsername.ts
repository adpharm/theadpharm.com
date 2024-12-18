import { uniqueUsernameGenerator } from "unique-username-generator";

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
  return uniqueUsernameGenerator({
    dictionaries: [xmasCharacters],
    separator: "",
    style: "capital",
    randomDigits: 2,
  });
};
