import { program } from "commander";
import { parse } from "./parser";
import * as fs from "fs/promises";
import * as path from "path";

if (process.env.NODE_ENV === "development") {
  const sourceMapSupport = require("source-map-support");
  sourceMapSupport.install();
}

program.name("dts-google-apps-script-advanced");

// Download command does not work without session cookies
/*
program
  .command("download [destination]")
  .description("download API definitions to destination directory")
  .action((destination: string = "definitions") => {
    console.log(`Download API definitions to ${destination}`);
    download(destination);
  });
  */

program.command("parse <jsonFile>").action(async (jsonFile: string) => {
  try {
    const definition = await parse(jsonFile);
    console.log(definition);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});

program
  .command("convert <jsonFiles...>")
  .description("convert API definitions from json files to destination directory")
  .option("-o, --output <outputDir>", "Output directory")
  .action(async (jsonFiles: string[], { output }: { output: string }) => {
    const promises = jsonFiles.map(
      async (jsonFile: string, index: number): Promise<void> => {
        console.log(`${index + 1}: Converting ${jsonFile}`);
        const outputFile = path.join(output, path.basename(jsonFile, ".json") + ".d.ts");
        let definition = [
          "// Type definitions for Google Apps Script 2019-03-25",
          "// Project: https://developers.google.com/apps-script/",
          "// Generator: https://github.com/grant/google-apps-script-dts",
          "// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped",
          "",
          "",
        ].join("\n");
        definition += await parse(jsonFile);
        await fs.writeFile(outputFile, definition);
      }
    );
    try {
      await Promise.all(promises);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });

program.parse();
