import { program } from "commander";
import { download } from "./download";
import { parse } from "./parser";

if (process.env.NODE_ENV === "development") {
  const sourceMapSupport = require("source-map-support");
  sourceMapSupport.install();
}

program.name("dts-google-apps-script-advanced");

program
  .command("download [destination]")
  .description("download API definitions to destination directory")
  .action((destination: string = "definitions") => {
    console.log(`Download API definitions to ${destination}`);
    download(destination);
  });

program.command("parse <jsonFile>").action(async (jsonFile: string) => {
  console.log(`Parse ${jsonFile}.`);
  await parse(jsonFile);
});

program.parse();
