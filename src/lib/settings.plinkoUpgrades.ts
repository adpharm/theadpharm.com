import type { upgradePlinkoGameKeys } from "./zod.schema";

export const upgradeSettings: Record<
  (typeof upgradePlinkoGameKeys)[number],
  {
    label: string;
    description: string;
    cost: number;
  }
> = {
  none: {
    label: "No upgrade",
    description: "Continue with the current board",
    cost: 0,
  },
  addNormalBall: {
    label: "Add a normal ball",
    description: "Add a normal ball to the board",
    cost: 10000,
  },
  addGoldenBall: {
    label: "Add a golden ball",
    description: "Golden balls are worth 2x the value of normal balls",
    cost: 20000,
  },
  add2NormalBalls: {
    label: "Add 2 normal balls",
    description: "Add 2 normal balls to the board",
    cost: 30000,
  },
  pocketValuePlus3000: {
    label: "Pocket value +3000",
    description: "Increase the value of any pocket by 3000",
    cost: 50000,
  },
  pocketValuePlus6000: {
    label: "Pocket value +6000",
    description: "Increase the value of any pocket by 6000",
    cost: 70000,
  },
  pocketValuePlus9000: {
    label: "Pocket value +9000",
    description: "Increase the value of any pocket by 9000",
    cost: 90000,
  },
  multiplyPayoutBy1_5: {
    label: "Multiply payout by 1.5",
    description: "Multiply your score at the end of each round by 1.5",
    cost: 100000,
  },
  multiplyPayoutBy2: {
    label: "Multiply payout by 2",
    description: "Multiply your score at the end of each round by 2",
    cost: 120000,
  },
  multiplyPayoutBy3: {
    label: "Multiply payout by 3",
    description: "Multiply your score at the end of each round by 3",
    cost: 150000,
  },
} as const;
