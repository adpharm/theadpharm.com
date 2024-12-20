// util to make all keys nullable
export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

// util to make all keys optional
export type Optional<T> = {
  [P in keyof T]?: T[P];
};

// util so that type hints are expanded
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
