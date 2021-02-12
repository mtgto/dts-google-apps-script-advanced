import { definitions } from "./api";

import * as https from "https";
import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";

// Download advanced API definition files
export const download = async (destination: string) => {
  await promisify(fs.mkdir)(destination, { recursive: true });

  definitions.slice(0, 1).forEach((definition) => {
    console.log(`Download the definition of ${definition.id}`);
    const filename = path.join(destination, `${definition.id}.json`);
    const file = fs.createWriteStream(filename);
    https.get(definition.url, (response) => {
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filename);
        throw new Error(
          `Fail to download definition. status=${response.statusCode} url=${definition.url}`
        );
      }
      response.pipe(file);
    });
  });
};
