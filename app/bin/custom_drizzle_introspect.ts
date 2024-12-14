/**
 * WHY: Drizzle's introspection doesn't exactly match our models/schema we define in Django.
 *      This is for a variety of reasons I won't get into here.
 *
 * WHAT: This script will run `npx drizzle-kit introspect` and then modify the generated
 *       schema files to match our models/schema.
 *
 * HOW: Line by line, this script looks at the given models.py, finds the target in schema.ts, and
 *      replaces the target with a new line we explicitly define.
 *
 * This script will:
 * 1. Read the models.py file(s) and find the target lines
 * 2. Read the schema.ts file and find the target lines
 * 3. Replace the target lines in the schema.ts file with new lines
 * 4. Write the modified schema.ts file
 *
 * Current transformations:
 * - Boolean fields are transformed to integer fields with a mode of "boolean"
 * - created_at fields are transformed to text fields with a default of CURRENT_TIMESTAMP
 * - updated_at fields are transformed to text fields with an onUpdate of CURRENT_TIMESTAMP
 * - Choice fields are transformed to text fields with an enum of the choice keys
 *
 * Current capabilities of note:
 * - Multiline fields are supported (for autopep8 formatted code)
 *
 * Notes/ToDos:
 * - This script relies heavily on the format of the models.py file(s). Issues may arise if the format changes.
 *
 * POSTGRES UPDATES
 *
 * - not sure about the varchar/text setup here
 * When Django creates database tables, it translates these field types as follows
 * CharField is typically created as VARCHAR(n) in PostgreSQL, where n is the specified max_length.
 * TextField is created as TEXT in PostgreSQL.
 * -
 */

import { $, fs, chalk, argv, question } from "zx";
import * as prettier from "prettier";
import { UpdateDeleteAction } from "drizzle-orm/pg-core";
// import { CONFIG } from "./config";

$.verbose = true;

const CONFIG = {
  /**
   * Root directory of the project
   */
  rootDir: "../",
  /**
   * Where are the Django models located, relative to the rootDir
   * The appName is needed because Django creates tables with the format `app_model`
   */
  djangoModelsFilePaths: [
    {
      appName: "plinko",
      path: "django-admin/plinko/models.py",
    },
    // {
    //   appName: "plinko",
    //   path: "django-admin/plinko/models_utils.py",
    // },
    {
      appName: "users",
      path: "django-admin/users/models.py",
    },
  ],
  /**
   * Where is the schema.ts file located, relative to the rootDir
   */
  drizzleSchemaFilePath: "app/drizzle/schema.ts",
  /**
   * Where is the schema_choices.ts file located (or where should it be created), relative to the rootDir
   */
  schemaChoicesFilePath: "app/drizzle/schema_choices.ts",
  /**
   * The classes that we're looking for in the models.py file fir
   */
  rootModelClasses: ["models.Model", "AbstractUser"],
} as const;

type Finding = {
  appName: string;
  pythonClassLine: string;
  pythonClassName: string;
  line: string;
  lineNum: number;
  /**
   * These are the fields that our script will look at.
   */
  columnDataType:
    | "model-class"
    | "choice-class"
    | "choice-option"
    | "col-boolean"
    | "col-datetime"
    | "col-choicefield"
    | "col-integerfield"
    | "col-URLField"
    | "col-foreignkey"
    | "col-foreignkey-self"
    | "col-charfield-primarykey"
    | "other";
  columnConfig?: {
    columnNameSnakeCased: string;
    columnSettings: {
      default: string | number | null;
      nullable: boolean;
      autoNowAdd: boolean;
      autoNow: boolean;
      maxLength: string | null;
      onDeleteMode: "CASCADE" | "DO_NOTHING" | null;
      foreignKeyToSnakeCased: string | null;
      foreignKeyColumnNameSnakeCased: string | null;
    };
    /**
     * if the column is a choice field, we need to know the choice class
     */
    choiceClassNameRef?: string | null;
  };
  choiceConfig?: {
    choiceClassLine: string;
    choiceClassName: string;
    choiceKey: string;
    choiceDisplay: string;
  };
};

async function main() {
  console.log("\n");
  const byPassWarning = argv.yes || argv._.includes("--yes");
  const dryRun = argv._.includes("--dry-run") || argv._.includes("--dry");

  if (!byPassWarning && !dryRun) {
    // warn
    console.log(
      chalk.yellow(
        "This script will modify the schema.ts file to match the models/schema defined in Django.",
      ),
    );
    console.log("\n");
    console.log(
      chalk.yellow(
        "Any changes you've made to the schema.ts file will be overwritten. (This is usually fine if you've just been doing `npx drizzle-kit introspect` to generate the schema)",
      ),
    );
    console.log("\n");
    // prompt for a y/N
    const resp = await question("Are you sure you want to continue? (y/N) ");

    // if not y, return early
    if (resp !== "y" && resp !== "Y") {
      console.log(chalk.yellow("Exiting..."));
      return;
    }
  }

  console.log("Running drizzle introspect...");
  await $`bunx drizzle-kit introspect`;

  const models = await Promise.all(
    CONFIG.djangoModelsFilePaths.map(async (filePath) => {
      // await $`cd ${CONFIG.rootDir} && pwd`;

      const file = await fs.readFile(CONFIG.rootDir + filePath.path);
      return {
        appName: filePath.appName,
        fileContent: file.toString(),
      };
    }),
  );

  // step throught the models, line by line
  // find lines of the form `snake_cased_column_name = models.BooleanField...`
  // find lines of the form `snake_cased_column_name = models.DateTimeField...`
  // find lines of the form `snake_cased_column_name = models.DateTimeField...`

  let currentClassLine = "";
  let currentClassName = "";

  const findings: Finding[] = [];

  let currentChoicesClassLine = "";
  let currentChoicesClassName = "";

  // const choicesFindings: Finding[] = [];

  for (const model of models) {
    // if there are lines to skip
    const lineNumbersToSkip: number[] = [];

    model.fileContent.split("\n").forEach((line, index) => {
      // line number in the models file
      const lineNum = index + 1;
      // check if we should skip this line
      if (lineNumbersToSkip.includes(lineNum)) return;

      // root level classes whitespace (this is how we know if a class is a table, or just a class nested inside of a table)
      const rootLevelClassesWhitespace = 0;
      const isRootLevelClass = line.startsWith(
        " ".repeat(rootLevelClassesWhitespace) + "class ",
      );

      // trim the whitespace
      line = line.trim();

      // if the line ends in a "(", then we assume that it's multiline.
      // we're going to attach the next line(s) to this line until we find the closing ")"
      //      note: we ignore "),"
      // we'll also keep track of the line number so we can skip over these lines in the next iteration
      if (line.endsWith("(")) {
        // find the closing ")"
        let closingParenthesesLine = line;
        let closingParenthesesLineIndex = index;

        // attach the next line(s) to this line
        // TODO: this probably isn't perfect - for example, if the closing ")" is on the same line as the "),"
        while (
          !closingParenthesesLine.includes(")") ||
          closingParenthesesLine.includes("),")
        ) {
          closingParenthesesLineIndex++;
          closingParenthesesLine =
            model.fileContent.split("\n")[closingParenthesesLineIndex];
          line += closingParenthesesLine.trim();

          // add the line number to the list of lines to skip
          lineNumbersToSkip.push(closingParenthesesLineIndex + 1);
        }
      }

      // the type of line we're looking at
      let lineType: Finding["columnDataType"] = (() => {
        // if this line is a model defintion...
        if (
          line.includes("class ") &&
          isRootLevelClass &&
          CONFIG.rootModelClasses.some((c) => line.includes(c))
        )
          return "model-class";
        // if this line is a choices class...
        if (
          line.includes("class ") &&
          (line.includes("TextChoices") || line.includes("IntegerChoices"))
        )
          return "choice-class";
        // if this line is a choice field (e.g. models.CharField(choices=CHOICE_CLASS.choices))...
        if (
          (line.includes("models.CharField") ||
            line.includes("models.IntegerField")) &&
          line.includes("choices=")
        )
          return "col-choicefield";
        if (line.includes("models.BooleanField")) return "col-boolean";
        if (line.includes("models.DateTimeField")) return "col-datetime";
        if (line.includes("models.IntegerField")) return "col-integerfield";
        if (line.includes("models.URLField")) return "col-URLField";
        // if this line is a foreign key field...
        if (line.includes("models.ForeignKey")) return "col-foreignkey";
        // if this line is a char field that is a primary key...
        if (
          line.includes("models.CharField") &&
          line.includes("primary_key=True")
        )
          return "col-charfield-primarykey";
        // if this line is a choice option...
        // a choice-option is a line of the format `CHOICE_OPTION = "choice_key", "Choice Display"`
        // MAYBETODO: verify this is ok
        // if (line.includes(' = "') && line.includes('", "'))
        if (
          // this narrows it down
          line.includes(" = ") &&
          line.includes(', "') &&
          // this excludes some false positives
          !(line.includes("[") || line.includes("]"))
        ) {
          return "choice-option";
        }

        return "other";
      })();

      // if lineType is other, return early
      if (lineType === "other") return;

      // track the model class that these lines are under
      if (lineType === "model-class") {
        currentClassLine = line;
        // the class name is between "class " and "("
        currentClassName = line.split("class ")[1].split("(")[0];

        // return early
        return;
      }

      // track the choices class that these lines are under
      if (lineType === "choice-class") {
        currentChoicesClassLine = line;
        // the class name is between "class " and "("
        currentChoicesClassName = line.split("class ")[1].split("(")[0];

        // return early
        return;
      }

      // if the line is a choice option, add it to the findings
      if (lineType === "choice-option") {
        let choiceKey = null;
        let choiceDisplay = null;

        // split the line into the key and display
        if (currentChoicesClassLine.includes("models.TextChoices")) {
          // For TextChoices, the line is of the format `CHOICE_OPTION = "choice_key", "Choice Display"`
          choiceKey = line.split(' = "')[1].split('", "')[0];
          choiceDisplay = line.split('", "')[1].split('"')[0];
        } else if (currentChoicesClassLine.includes("models.IntegerChoices")) {
          // For IntegerChoices, the line is of the format `CHOICE_OPTION = choice_key, "Choice Display"`
          choiceKey = line.split(" = ")[1].split(", ")[0];
          choiceDisplay = line.split(', "')[1].split('"')[0];
        }

        if (!choiceKey || !choiceDisplay) {
          console.log(choiceKey, choiceDisplay);

          throw new Error(
            `Could not find choice key or choice display in line: ${line}`,
          );
        }

        // build the Finding object
        const finding: Finding = {
          appName: model.appName,
          pythonClassLine: currentClassLine,
          pythonClassName: currentClassName,
          line,
          lineNum,
          columnDataType: lineType,
          choiceConfig: {
            choiceClassLine: currentChoicesClassLine,
            choiceClassName: currentChoicesClassName,
            choiceKey,
            choiceDisplay,
          },
        };

        findings.push(finding);

        return;
      }

      // columnName is the snake_cased_column_name
      let columnNameSnakeCased = line.split(" = ")[0];

      // check if default=VALUE is in the line
      // it could be like `default=VALUE)` or `default=VALUE,`
      let defaultValue = null;
      if (line.includes("default=")) {
        // start index of the default value (right after "default=")
        const defaultStartIndex = line.indexOf("default=") + "default=".length;
        // end index of the default value
        const neighbourIndexCloseParen = line.indexOf(")", defaultStartIndex);
        const neighbourIndexComma = line.indexOf(",", defaultStartIndex);
        const defaultEndIndex =
          neighbourIndexCloseParen < neighbourIndexComma
            ? neighbourIndexCloseParen
            : neighbourIndexComma;
        // the default value
        defaultValue = line.slice(defaultStartIndex, defaultEndIndex);
        // if defaultValue is Python's True or False, convert it to JS's true or false
        if (defaultValue === "True") defaultValue = "true";
        if (defaultValue === "False") defaultValue = "false";
      }

      // check if null=True is in the line
      let nullable = false;
      if (line.includes("null=True")) {
        nullable = true;
      }

      // check if auto_now_add=True is in the line
      let autoNowAdd = false;
      if (line.includes("auto_now_add=True")) {
        autoNowAdd = true;
      }

      // check if auto_now=True is in the line
      let autoNow = false;
      if (line.includes("auto_now=True")) {
        autoNow = true;
      }

      // check for choices=CHOICE_CLASS.choices and get the choice class name
      let choiceClassNameRef = null;
      if (line.includes("choices=")) {
        // get the choice class name
        const choiceClassName = line.split("choices=")[1].split(".choices")[0];
        choiceClassNameRef = choiceClassName;
      }

      // check for max_length=VALUE
      // it could be like `max_length=VALUE)` or `max_length=VALUE,`
      let maxLength = null;
      if (line.includes("max_length=")) {
        // start index of the max_length value (right after "max_length=")
        const maxLengthStartIndex =
          line.indexOf("max_length=") + "max_length=".length;
        // end index of the max_length value
        const neighbourIndexCloseParen = line.indexOf(")", maxLengthStartIndex);
        const neighbourIndexComma = line.indexOf(",", maxLengthStartIndex);
        const maxLengthEndIndex =
          neighbourIndexCloseParen < neighbourIndexComma
            ? neighbourIndexCloseParen
            : neighbourIndexComma;
        // the max_length value
        maxLength = line.slice(maxLengthStartIndex, maxLengthEndIndex);
      }

      // check if url field (django puts a max length of 200 on by default)
      if (line.includes("models.URLField")) {
        maxLength = "200";
      }

      // FOREIGN KEY stuff
      let onDeleteMode: NonNullable<
        Finding["columnConfig"]
      >["columnSettings"]["onDeleteMode"] = null;
      let foreignKeyToSnakeCased: NonNullable<
        Finding["columnConfig"]
      >["columnSettings"]["foreignKeyToSnakeCased"] = null;
      let foreignKeyColumnNameSnakeCased: NonNullable<
        Finding["columnConfig"]
      >["columnSettings"]["foreignKeyColumnNameSnakeCased"] = null;
      if (lineType === "col-foreignkey") {
        // if the line has on_delete=something
        if (line.includes("on_delete=")) {
          if (line.includes("CASCADE")) {
            onDeleteMode = "CASCADE";
          } else if (line.includes("DO_NOTHING")) {
            onDeleteMode = "DO_NOTHING";
          }
        }

        // if the line has a db_column="something"
        // get the "something" value
        // e.g. in `domain = models.ForeignKey("Domain", db_column="domain_name", on_delete=models.CASCADE)`, the "something" value is "domain_name"
        if (line.includes("db_column=")) {
          const dbColumnStartIndex =
            line.indexOf("db_column=") + "db_column=".length;
          const dbColumnEndIndex = line.indexOf(",", dbColumnStartIndex);
          const dbColumnRaw = line
            .slice(dbColumnStartIndex, dbColumnEndIndex)
            .replace(/"/g, "");
          foreignKeyColumnNameSnakeCased = dbColumnRaw;
          columnNameSnakeCased = dbColumnRaw;
        } else {
          // NOTE: this and the above block are special cases where either:
          // 1. we set the db_column and that is the name of the column, regardless of the model field name
          // 2. we don't set the db_column and the name of the column is the model field name, plus "_id"
          columnNameSnakeCased = columnNameSnakeCased + "_id";
        }

        // if the line has a "foreign key to" value
        // get the "foreign key to" value
        // e.g. in `models.ForeignKey("app.Model", on_delete=models.CASCADE)`, the "foreign key to" value is "app.Model"
        // e.g. in `models.ForeignKey("Model", on_delete=models.CASCADE)`, the "foreign key to" value is "Model"
        const foreignKeyToStartIndex = line.indexOf("(") + 1;
        const foreignKeyToEndIndex = line.indexOf(",");
        const foreignKeyToRaw = line
          .slice(foreignKeyToStartIndex, foreignKeyToEndIndex)
          .replace(/"/g, "");

        // if the foreign key to has a dot, it's in the format "app.ModelName"
        // in this case, the foreign key to snake cased is "app_modelname"
        if (foreignKeyToRaw.includes(".")) {
          const [appName, modelName] = foreignKeyToRaw.split(".");
          foreignKeyToSnakeCased = `${appName}_${modelName}`.toLowerCase();
        } else {
          // if the foreign key to doesn't have a dot, we must prepend the current app name
          // in this case, the foreign key to snake cased is "app_modelname"
          foreignKeyToSnakeCased =
            `${model.appName}_${foreignKeyToRaw}`.toLowerCase();
        }

        // check if this is a self-referential foreign key
        if (
          foreignKeyToRaw === currentClassName ||
          foreignKeyToRaw === "self"
        ) {
          // set the lineType to col-foreignkey-self
          lineType = "col-foreignkey-self";
        }
      }

      // build the Finding object
      const finding: Finding = {
        appName: model.appName,
        pythonClassLine: currentClassLine,
        pythonClassName: currentClassName,
        line,
        lineNum,
        columnDataType: lineType,
        columnConfig: {
          columnNameSnakeCased,
          columnSettings: {
            default: defaultValue,
            nullable,
            autoNowAdd,
            autoNow,
            maxLength,
            onDeleteMode,
            foreignKeyToSnakeCased,
            foreignKeyColumnNameSnakeCased,
          },
          choiceClassNameRef,
        },
      };

      findings.push(finding);
    });
  }

  // const ignoreFindingsWithColumnDataType: Finding["columnDataType"][] = ["col-charfield-primarykey"];
  // const findings = findings.filter(f => !ignoreFindingsWithColumnDataType.includes(f.columnDataType));

  // console.log("findings");
  // console.log(findings.filter(f => f.columnConfig?.columnNameSnakeCased === "version"));
  // console.log(
  //   findings.filter(
  //     f => f.columnDataType === "choice-option" && f.choiceConfig?.choiceClassName === "TrackingLinkLocation",
  //   ),
  // );

  // console.log(findings.filter(f => f.columnDataType === "col-foreignkey"));
  // console.log(findings.filter(f => f.columnDataType === "col-charfield-primarykey"));

  // step through the findings and modify the schema.ts file
  // for each line, find the corresponding line in the schema.ts file
  // replace the corresponding line with the new line

  const schemaFile = await fs.readFile(
    CONFIG.rootDir + CONFIG.drizzleSchemaFilePath,
  );

  const schemaTsLines = schemaFile.toString().split("\n");
  const schemaTsLinesCopy = schemaTsLines.slice();

  const choicesMap = getChoicesMap(findings);

  // count the number of warnings
  let warnings = 0;

  // schemaTsLines.forEach((schemaTsLine, index) => {
  findings.forEach((finding) => {
    let insideTableDefinitionBlock = false;

    // for each finding, find the corresponding line in the schema.ts file
    // findings.forEach(finding => {
    schemaTsLines.forEach((schemaTsLine, index) => {
      // find the corresponding line in the schema.ts file
      // first, find the class which will be of the form `export const appNameModelName = pgTable...`
      // the table name is, all lowercase, finding.appName + "_" + finding.pythonClassName
      const tableName =
        `${finding.appName}_${finding.pythonClassName}`.toLowerCase();

      // now find the line that has `pgTable("${tableName}", ...`
      if (schemaTsLine.includes(`pgTable("${tableName}",`)) {
        insideTableDefinitionBlock = true;
      }

      // if insideTableDefinitionBlock is on, find the line that has `});`
      if (insideTableDefinitionBlock && schemaTsLine.includes("});")) {
        insideTableDefinitionBlock = false;
      }

      // if we're in the right place, find the line that has the column name, camelCased
      const columnNameSnakeCased = finding.columnConfig?.columnNameSnakeCased;
      if (insideTableDefinitionBlock && columnNameSnakeCased) {
        // if the line has the column name, camelCased
        const columnNameCamelCased = generateCamelCaseStr(columnNameSnakeCased);

        if (schemaTsLine.includes(`${columnNameCamelCased}:`)) {
          // ok, so we've found the right line
          // now we only want to replace lines where we know what we are replacing.
          // we do that by looking for the exact match here
          let shouldReplace = false;
          let expectedLine: string | null = null;
          let alternateExpectedLine: string | null = null;
          // get the spaces at the beginning of the line so we can replace it with the same amount of spaces
          const leadingWhitespace = schemaTsLine.match(/^\s+/)?.[0] || "";

          const { nullable, maxLength } =
            finding.columnConfig?.columnSettings || {};

          let dontTouch = false;

          // ------------------------------------------
          // ------------------------------------------
          // ------------------------------------------
          // COLUMN TYPES
          // ------------------------------------------
          // ------------------------------------------
          // ------------------------------------------
          if (finding.columnDataType === "col-boolean") {
            expectedLine = `${columnNameCamelCased}: numeric("${columnNameSnakeCased}")`;

            if (!nullable) {
              // if the field is not nullable, add .notNull()
              expectedLine += ".notNull()";
            }
          }
          // else if (finding.columnDataType === "col-datetime") {
          //   expectedLine = `${columnNameCamelCased}: numeric("${columnNameSnakeCased}")`;
          //   if (!nullable) {
          //     // if the field is not nullable, add .notNull()
          //     expectedLine += ".notNull()";
          //   }
          // }
          else if (finding.columnDataType === "col-choicefield") {
            const hasUnderscore = columnNameSnakeCased.includes("_");
            if (maxLength) {
              expectedLine = `${columnNameCamelCased}: ${hasUnderscore ? `varchar("${columnNameSnakeCased}", { length: ${maxLength} })` : `varchar({ length: ${maxLength} })`}`;
            } else {
              expectedLine = `${columnNameCamelCased}: ${hasUnderscore ? `text("${columnNameSnakeCased}")` : `text()`}`;
            }

            // if the field is not nullable, add .notNull()
            if (!nullable) {
              expectedLine += ".notNull()";
            }
          } else if (finding.columnDataType === "col-integerfield") {
            //
            const containsUnderscore = columnNameSnakeCased.includes("_");
            expectedLine = `${columnNameCamelCased}: ${containsUnderscore ? `integer("${columnNameSnakeCased}")` : `integer()`}`;

            if (!nullable) {
              // if the field is not nullable, add .notNull()
              expectedLine += ".notNull()";
            }
          } else if (finding.columnDataType === "col-URLField") {
            if (maxLength) {
              expectedLine = `${columnNameCamelCased}: varchar({ length: ${maxLength} })`;
            } else {
              expectedLine = `${columnNameCamelCased}: text("${columnNameSnakeCased}")`;
            }

            if (!nullable) {
              // if the field is not nullable, add .notNull()
              expectedLine += ".notNull()";
            }
          }
          // else if (
          //   finding.columnDataType === "col-foreignkey" ||
          //   finding.columnDataType === "col-foreignkey-self"
          // ) {
          //   // example: driveId: integer("drive_id").notNull().references(() => appDrive.id),

          //   const foreignKeyToSnakeCased =
          //     finding.columnConfig?.columnSettings.foreignKeyToSnakeCased;
          //   const foreignKeyToCamelCased = generateCamelCaseStr(
          //     foreignKeyToSnakeCased || "",
          //   );

          //   const colNameSnakeCased =
          //     finding.columnConfig?.columnSettings
          //       .foreignKeyColumnNameSnakeCased || "id";
          //   const colNameCamelCased = generateCamelCaseStr(colNameSnakeCased);

          //   // I need to know what type the foreignKey column is
          //   // it's probably an integer, but it could be a text too
          //   let primaryKeyFinding: Finding | undefined = undefined;
          //   if (foreignKeyToSnakeCased) {
          //     primaryKeyFinding = findings.find(
          //       (f) =>
          //         f.columnDataType === "col-charfield-primarykey" &&
          //         f.columnConfig?.columnNameSnakeCased === colNameSnakeCased,
          //     );
          //   }

          //   if (primaryKeyFinding) {
          //     // if we have a primary key finding, we know that the foreign key is a text field
          //     expectedLine = generateCharFieldReplacement(primaryKeyFinding);
          //     // take off the comma at the end
          //     expectedLine = expectedLine.slice(0, -1);
          //   } else {
          //     // if we don't have a primary key finding, we assume that the foreign key is an integer field
          //     const hasUnderscore = columnNameSnakeCased.includes("_");
          //     expectedLine = `${columnNameCamelCased}: ${hasUnderscore ? `bigint("${columnNameSnakeCased}", { mode: "number" })` : `bigint({ mode: "number" })`}`;

          //     if (!nullable) {
          //       // if the field is not nullable, add .notNull()
          //       expectedLine += ".notNull()";
          //     }
          //   }

          //   if (finding.columnDataType === "col-foreignkey-self") {
          //     // for whatever reason, the introspect script doesn't handle self-referential foreign keys
          //     // so the expected line here is either a text or an integer field
          //     // if it's a self-referential foreign key, we're done
          //   } else {
          //     // add references
          //     expectedLine += `.references(() => ${foreignKeyToCamelCased}.${colNameCamelCased})`;

          //     // we need an alternateExpectedLine because of our dangerousDbCascade script
          //     // for tables that it has been ran on previously, drizzle introspect will have the onDeleteMode set
          //     // otherwise, it won't
          //     // both are valid, so we need to handle both cases
          //     alternateExpectedLine = expectedLine;

          //     const drizzleOnDeleteAction: UpdateDeleteAction | null =
          //       finding.columnConfig?.columnSettings.onDeleteMode === "CASCADE"
          //         ? "cascade"
          //         : finding.columnConfig?.columnSettings.onDeleteMode ===
          //             "DO_NOTHING"
          //           ? null
          //           : null;

          //     // if onDeleteMode is set, add it to the line
          //     // let line = expectedLine.replace("),", `, { onDelete: "${drizzleOnDeleteAction}" }),`);
          //     if (
          //       expectedLine.includes("references") &&
          //       drizzleOnDeleteAction
          //     ) {
          //       expectedLine =
          //         expectedLine.slice(0, -1) +
          //         `, { onDelete: "${drizzleOnDeleteAction}" } ),`;
          //     }
          //   }
          // }
          else if (finding.columnDataType === "col-charfield-primarykey") {
            dontTouch = true;
          }
          // ------------------------------------------
          // ------------------------------------------
          // ------------------------------------------
          // END OF COLUMN TYPES
          // ------------------------------------------
          // ------------------------------------------
          // ------------------------------------------

          if (!dontTouch) {
            // add comma at the end, if it's not there
            if (expectedLine && !expectedLine.endsWith(",")) {
              expectedLine += ",";
            }

            // add comma at the end, if it's not there
            if (alternateExpectedLine && !alternateExpectedLine.endsWith(",")) {
              alternateExpectedLine += ",";
            }

            shouldReplace =
              schemaTsLine.trim() === expectedLine ||
              schemaTsLine.trim() === alternateExpectedLine;

            // if expectedLine is not set, then we don't know how to handle this columnDataType
            if (!expectedLine) {
              console.log(
                chalk.yellow(
                  "-> We don't know how to handle this columnDataType:",
                  finding.columnDataType,
                ),
              );
              warnings++;
              return;
            }

            // if we should replace, replace the line
            if (shouldReplace) {
              let pgColTypeForSelfForeignKey: "text" | "integer" = "text";
              if (expectedLine.includes("integer")) {
                pgColTypeForSelfForeignKey = "integer";
              }

              // replace the line
              let replacementLine = "";
              switch (finding.columnDataType) {
                case "col-boolean":
                  replacementLine = generateBooleanFieldReplacement(finding, {
                    leadingWhitespace,
                  });
                  break;
                case "col-datetime":
                  // replacementLine = generateDateTimeFieldReplacement(finding, {
                  //   leadingWhitespace,
                  // });
                  break;
                case "col-choicefield":
                  replacementLine = generateChoiceFieldReplacement(
                    finding,
                    choicesMap,
                    { leadingWhitespace },
                  );
                  break;
                case "col-integerfield":
                  replacementLine = generateIntegerFieldReplacement(finding, {
                    leadingWhitespace,
                  });
                  break;
                case "col-URLField":
                  replacementLine = generateURLFieldReplacement(finding, {
                    leadingWhitespace,
                  });
                  break;
                case "col-foreignkey":
                  // replacementLine = generateForeignKeyFieldReplacement(
                  //   finding,
                  //   expectedLine,
                  //   { leadingWhitespace },
                  // );
                  break;
                case "col-foreignkey-self":
                  // replacementLine = generateForeignKeySelfFieldReplacement(
                  //   finding,
                  //   pgColTypeForSelfForeignKey,
                  //   {
                  //     leadingWhitespace,
                  //   },
                  // );
                  break;
                default:
                  break;
              }

              schemaTsLinesCopy[index] = replacementLine;

              // console.log("Replaced line:", chalk.yellow(schemaTsLine), "with:", chalk.green(replacementLine));
              console.log(
                "Replaced",
                chalk.green(columnNameCamelCased),
                "of",
                chalk.green(tableName),
              );
            } else {
              console.warn(
                `-> We were told to replace a line of type ${finding.columnDataType} but the drizzle-kit introspect output differs from what we expected, so we're leaving it.`,
                "\nGot:\n",
                schemaTsLine.trim(),
                "\nExpected:\n",
                expectedLine,
              );
              warnings++;
            }
          }
        } else {
          // this finding was marked as "don't touch"
          // console.log("Leaving", chalk.green(columnNameCamelCased), "of", chalk.green(tableName));
        }
      }
    });
  });

  // if there were warnings, log them
  if (warnings === 0) {
    console.log(chalk.green(`\nNo warnings!`));
  } else if (warnings === 1) {
    console.log(chalk.yellow(`\nThere was 1 warning above.`));
  } else {
    console.log(chalk.yellow(`\nThere were ${warnings} warnings above.`));
  }

  // write the modified schema.ts file
  const schemaTsFileName = `${CONFIG.rootDir}${CONFIG.drizzleSchemaFilePath}`;

  // some comments to the top of the file
  schemaTsLinesCopy.unshift(
    "// DO NOT MODIFY THIS FILE DIRECTLY, IT WILL BE OVERWRITTEN",
    "// This file was automatically generated by running `npm run db:pull`",
    "// The modifications were made to match the models/schema defined in Django",
    "",
  );

  if (!dryRun) {
    // write the modified schema.ts file
    await fs.writeFile(schemaTsFileName, schemaTsLinesCopy.join("\n"));

    // write a file that has all of the choices with the labels
    const schemaChoicesFileName = `${CONFIG.rootDir}${CONFIG.schemaChoicesFilePath}`;
    const schemaChoicesTsContent = `
// DO NOT MODIFY THIS FILE DIRECTLY, IT WILL BE OVERWRITTEN
// This file was automatically generated by running \`npm run db:pull\`
// The modifications were made to match the models/schema defined in Django

export const schema_choices = ${JSON.stringify(choicesMap, null, 2)} as const;
`;

    //  format the content
    const formattedContent = await prettier.format(schemaChoicesTsContent, {
      parser: "typescript",
    });

    // write the content to the file
    fs.writeFileSync(schemaChoicesFileName, formattedContent);

    // Success message
    console.log("\n");
    console.log(
      chalk.green("√ Wrote the modified schema.ts file to:", schemaTsFileName),
    );
    console.log(
      chalk.green(
        "√ Wrote the schema_choices.ts file to:",
        schemaChoicesFileName,
      ),
    );

    // ask if we want to run the dangerous db cascade script
    // const runDbCascade = await question(
    //   "\nDo you want to run the dangerous db cascade script? This backs up your database, so it's not THAT dangerous. (y/N) ",
    // );

    // if (runDbCascade === "y" || runDbCascade === "Y") {
    //   await $`npm run db:cascade-unsafe`;
    // } else {
    //   console.log("\n");
    //   console.log(chalk.yellow("Did not run the dangerous db cascade script."));
    // }
  } else {
    console.log("\n");
    console.log(
      chalk.yellow("Dry run, did not write the modified schema.ts file."),
    );
  }
}

/**
 * Generate a camelCased string from a snake_cased string
 */
function generateCamelCaseStr(str: string) {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * Generate the new schema.ts line for a boolean field
 */
function generateBooleanFieldReplacement(
  { columnConfig }: Finding,
  options?: {
    leadingWhitespace: string;
  },
): string {
  const { columnNameSnakeCased, columnSettings } = columnConfig || {};
  if (!columnNameSnakeCased || !columnSettings) {
    throw new Error("Missing columnConfig or columnSettings");
  }

  let line = `${generateCamelCaseStr(
    columnNameSnakeCased,
  )}: integer("${columnNameSnakeCased}", { mode: "boolean" })`;

  // if there is a default value, add it
  if (columnSettings?.default) {
    line += `.default(${columnSettings.default})`;
  }

  // if the field is not nullable, add .notNull()
  if (!columnSettings?.nullable) {
    line += `.notNull()`;
  }

  // add a comma at the end
  line += ",";

  // if leadingWhitespace is set, add it to the beginning of the line
  if (options?.leadingWhitespace) {
    line = options.leadingWhitespace + line;
  }

  return line;
}

/**
 * Generate the new schema.ts line for a datetime field
 */
// function generateDateTimeFieldReplacement(
//   { columnConfig }: Finding,
//   options?: {
//     leadingWhitespace: string;
//   },
// ): string {
//   const { columnNameSnakeCased, columnSettings } = columnConfig || {};
//   if (!columnNameSnakeCased || !columnSettings) {
//     throw new Error("Missing columnConfig or columnSettings");
//   }
//   let line = `${generateCamelCaseStr(
//     columnNameSnakeCased,
//   )}: text("${columnNameSnakeCased}")`;

//   // if auto_now_add is set, add default value
//   if (columnSettings?.autoNowAdd) {
//     line += `.default(sql\`CURRENT_TIMESTAMP\`)`;
//   }

//   // if auto_now is set, add onUpdate
//   if (columnSettings?.autoNow) {
//     line += `.$onUpdate(() => sql\`CURRENT_TIMESTAMP\`)`;
//   }

//   // if the field is not nullable, add .notNull()
//   if (!columnSettings?.nullable) {
//     line += `.notNull()`;
//   }

//   // add a comma at the end
//   line += ",";

//   // if leadingWhitespace is set, add it to the beginning of the line
//   if (options?.leadingWhitespace) {
//     line = options.leadingWhitespace + line;
//   }

//   return line;
// }

type ChoicesMap = {
  [choiceClassName: string]: {
    [choiceKey: string]: string;
  };
};
/**
 * Generate choices map from findings
 */
function getChoicesMap(findings: Finding[]): ChoicesMap {
  const choicesMap: ChoicesMap = {};

  findings.forEach((finding) => {
    if (finding.columnDataType === "choice-option") {
      const { choiceClassName, choiceKey, choiceDisplay } =
        finding.choiceConfig || {};
      if (!choiceClassName || !choiceKey || !choiceDisplay) {
        throw new Error("Missing choiceClassName, choiceKey, or choiceDisplay");
      }

      // if the choice class doesn't exist in the map, add it
      if (!choicesMap[choiceClassName]) {
        choicesMap[choiceClassName] = {};
      }

      // add the choice to the map
      choicesMap[choiceClassName][choiceKey] = choiceDisplay;
    }
  });

  return choicesMap;
}

/**
 * Generate the new schema.ts line for a choice field
 */
function generateChoiceFieldReplacement(
  finding: Finding,
  choices: ChoicesMap,
  options?: {
    leadingWhitespace: string;
  },
): string {
  const { columnNameSnakeCased, columnSettings } = finding.columnConfig || {};
  if (!columnNameSnakeCased || !columnSettings) {
    throw new Error("Missing columnConfig or columnSettings");
  }

  const choiceKeys = Object.keys(
    choices[finding.columnConfig?.choiceClassNameRef || ""] || {},
  );
  const choiceKeysStr = `[${choiceKeys.map((key) => `"${key}"`).join(", ")}]`;

  let line = ``;

  if (columnSettings.maxLength) {
    line += `${generateCamelCaseStr(
      columnNameSnakeCased,
    )}: varchar({ enum: ${choiceKeysStr}, length: ${
      columnSettings.maxLength
    } })`;
  } else {
    line += `${generateCamelCaseStr(
      columnNameSnakeCased,
    )}: text("${columnNameSnakeCased}", { enum: ${choiceKeysStr} })`;
  }

  // if the field is not nullable, add .notNull()
  if (!columnSettings?.nullable) {
    line += `.notNull()`;
  }

  // add a comma at the end
  line += ",";

  // if leadingWhitespace is set, add it to the beginning of the line
  if (options?.leadingWhitespace) {
    line = options.leadingWhitespace + line;
  }

  return line;
}

/**
 * Generate the new schema.ts line for an integer field
 */
function generateIntegerFieldReplacement(
  { columnConfig }: Finding,
  options?: {
    leadingWhitespace: string;
  },
): string {
  const { columnNameSnakeCased, columnSettings } = columnConfig || {};
  if (!columnNameSnakeCased || !columnSettings) {
    throw new Error("Missing columnConfig or columnSettings");
  }

  const containsUnderscore = columnNameSnakeCased.includes("_");
  let line = `${generateCamelCaseStr(columnNameSnakeCased)}: ${
    containsUnderscore ? `integer("${columnNameSnakeCased}")` : `integer()`
  }`;

  // if there is a default value, add it
  if (columnSettings?.default) {
    line += `.default(${columnSettings.default})`;
  }

  // if the field is not nullable, add .notNull()
  if (!columnSettings?.nullable) {
    line += `.notNull()`;
  }

  // add a comma at the end
  line += ",";

  // if leadingWhitespace is set, add it to the beginning of the line
  if (options?.leadingWhitespace) {
    line = options.leadingWhitespace + line;
  }

  return line;
}

/**
 * Generate the new schema.ts line for a URL field
 */
function generateURLFieldReplacement(
  { columnConfig }: Finding,
  options?: {
    leadingWhitespace: string;
  },
): string {
  const { columnNameSnakeCased, columnSettings } = columnConfig || {};
  if (!columnNameSnakeCased || !columnSettings) {
    throw new Error("Missing columnConfig or columnSettings");
  }

  let line = ``;

  // if there is a max_length, add it
  if (columnSettings.maxLength) {
    line += `${generateCamelCaseStr(columnNameSnakeCased)}: varchar({ length: ${
      columnSettings.maxLength
    } })`;
  } else {
    line += `${generateCamelCaseStr(
      columnNameSnakeCased,
    )}: text("${columnNameSnakeCased}")`;
  }

  // if the field is not nullable, add .notNull()
  if (!columnSettings?.nullable) {
    line += `.notNull()`;
  }

  // add a comma at the end
  line += ",";

  // if leadingWhitespace is set, add it to the beginning of the line
  if (options?.leadingWhitespace) {
    line = options.leadingWhitespace + line;
  }

  return line;
}

/**
 * Generate the new schema.ts line for a URL field
 */
function generateCharFieldReplacement(
  { columnConfig }: Finding,
  options?: {
    leadingWhitespace: string;
  },
): string {
  const { columnNameSnakeCased, columnSettings } = columnConfig || {};
  if (!columnNameSnakeCased || !columnSettings) {
    throw new Error("Missing columnConfig or columnSettings");
  }

  let line = ``;

  // if there is a max_length, add it
  if (columnSettings.maxLength) {
    line += `${generateCamelCaseStr(columnNameSnakeCased)}: varchar({ length: ${
      columnSettings.maxLength
    } })`;
  } else {
    line += `${generateCamelCaseStr(
      columnNameSnakeCased,
    )}: text("${columnNameSnakeCased}")`;
  }

  // if the field is not nullable, add .notNull()
  if (!columnSettings?.nullable) {
    line += `.notNull()`;
  }

  // add a comma at the end
  line += ",";

  // if leadingWhitespace is set, add it to the beginning of the line
  if (options?.leadingWhitespace) {
    line = options.leadingWhitespace + line;
  }

  return line;
}

/**
 * Generate the new schema.ts line for a foreign key field
 */
function generateForeignKeyFieldReplacement(
  { columnConfig }: Finding,
  expectedLine: string,
  options?: {
    leadingWhitespace: string;
  },
): string {
  const { columnNameSnakeCased, columnSettings } = columnConfig || {};
  if (!columnNameSnakeCased || !columnSettings) {
    throw new Error("Missing columnConfig or columnSettings");
  }

  // first check if the onDeleteMode is set
  // const onDeleteMode = columnSettings?.onDeleteMode;

  // if (!onDeleteMode) {
  //   return expectedLine;
  // }

  // const drizzleOnDeleteAction: UpdateDeleteAction = onDeleteMode === "CASCADE" ? "cascade" : "no action";

  // // if onDeleteMode is set, add it to the line
  // // example: `domainName: text("domain_name", { length: 100 }).notNull().references(() => appDomain.domainName),` becomes
  // // `domainName: text("domain_name", { length: 100 }).notNull().references(() => appDomain.domainName, { onDelete: "cascade" }),`
  // let line = expectedLine.replace("),", `, { onDelete: "${drizzleOnDeleteAction}" } ),`);

  let line = expectedLine;

  // if leadingWhitespace is set, add it to the beginning of the line
  if (options?.leadingWhitespace) {
    line = options.leadingWhitespace + line;
  }

  return line;
}

/**
 * Generate the new schema.ts line for a self-referential foreign key field
 */
// function generateForeignKeySelfFieldReplacement(
//   { columnConfig }: Finding,
//   pgColType: "integer" | "text",
//   options?: {
//     leadingWhitespace: string;
//   },
// ): string {
//   const { columnNameSnakeCased, columnSettings } = columnConfig || {};
//   if (!columnNameSnakeCased || !columnSettings) {
//     throw new Error("Missing columnConfig or columnSettings");
//   }

//   // We're going to create something like this, manually
//   // parentFolderId: integer("parent_folder_id").references((): AnySQLiteColumn => appDestinationfolder.id),

//   let line = ``;

//   line += `${generateCamelCaseStr(
//     columnNameSnakeCased,
//   )}: ${pgColType}("${columnNameSnakeCased}")`;

//   // if the field is not nullable, add .notNull()
//   if (!columnSettings?.nullable) {
//     line += `.notNull()`;
//   }

//   // add references
//   const foreignKeyToSnakeCased = columnSettings.foreignKeyToSnakeCased;
//   const foreignKeyToCamelCased = generateCamelCaseStr(
//     foreignKeyToSnakeCased || "",
//   );

//   const colNameSnakeCased =
//     columnSettings.foreignKeyColumnNameSnakeCased || "id";
//   const colNameCamelCased = generateCamelCaseStr(colNameSnakeCased);

//   line += `.references((): AnySQLiteColumn => ${foreignKeyToCamelCased}.${colNameCamelCased})`;

//   const drizzleOnDeleteAction: UpdateDeleteAction | null =
//     columnSettings.onDeleteMode === "CASCADE"
//       ? "cascade"
//       : columnSettings.onDeleteMode === "DO_NOTHING"
//         ? null
//         : null;

//   // if onDeleteMode is set, add it to the line
//   if (drizzleOnDeleteAction) {
//     line = line.slice(0, -1) + `, { onDelete: "${drizzleOnDeleteAction}" } ),`;
//   }

//   // add a comma at the end, if it's not there
//   if (!line.endsWith(",")) {
//     line += ",";
//   }

//   // if leadingWhitespace is set, add it to the beginning of the line
//   if (options?.leadingWhitespace) {
//     line = options.leadingWhitespace + line;
//   }

//   return line;
// }

/**
 * Tests (fake for now, just for reference)
 */
// const tests = [
//   // boolean tests
//   {
//     lineInput: "is_qr_code = models.BooleanField(default=False)",
//     expectedDefaultOutput: 'isQrCode: numeric("is_qr_code").notNull(),',
//     transformedOutput:
//       'isQrCode: integer("is_qr_code", { mode: "boolean" }).default(false).notNull(),',
//   },
//   {
//     lineInput: "is_active = models.BooleanField(null=True)",
//     expectedDefaultOutput: 'isActive: numeric("is_active"),',
//     transformedOutput: 'isActive: integer("is_active", { mode: "boolean" }),',
//   },
//   // created at
//   {
//     lineInput: "created_at = models.DateTimeField(auto_now_add=True)",
//     expectedDefaultOutput: 'createdAt: numeric("created_at").notNull(),',
//     transformedOutput:
//       'createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),',
//   },
//   // updated at
//   {
//     lineInput: "updated_at = models.DateTimeField(auto_now=True)",
//     expectedDefaultOutput: 'updatedAt: numeric("updated_at").notNull(),',
//     transformedOutput:
//       'updatedAt: text("updated_at").$onUpdate(() => sql`CURRENT_TIMESTAMP`).notNull(),',
//   },
// ];

// TODO: if test is passed as an argument, run the tests

main().catch(console.error);
