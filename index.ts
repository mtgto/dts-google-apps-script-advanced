import * as fs from "fs";

class Namespace {
  /// Full namespace name. ex. "Admin_directory_v1.Admin.Directory_v1.Collection.AspsCollection"
  names: string[];
  /// last name of fullname. ex. "AspsCollection"
  name: string;
  children: Namespace[];
  interfaces: Interface[];

  constructor(fullname: string) {
    this.names = fullname.split(".");
    this.name = nameFromFullname(fullname);
    this.children = [];
    this.interfaces = [];
  }

  add(i: Interface): void {
    if (this.names.length + 1 === i.names.length) {
      this.interfaces.push(i);
    } else if (this.names.length + 1 < i.names.length) {
      const childName = i.names[this.names.length];
      let child = this.children.find(child => child.name === childName);
      if (!child) {
        child = new Namespace(this.names.join(".") + "." + childName);
        this.children.push(child);
      }
      child.add(i);
    }
  }

  print(depth: number): void {
    console.log(`${depth === 0 ? "declare " : ""}${" ".repeat(depth * 2)}namespace ${this.name} {`);
    this.children.forEach(child => {
      child.print(depth+1);
    })
    this.interfaces.forEach(i => {
      i.print(depth+1);
    })
    console.log(`${" ".repeat(depth * 2)}}`);
  }
}

class Interface {
  /// Full namespace name. ex. "Admin_directory_v1.Admin.Directory_v1.Collection.AspsCollection"
  names: string[];
  /// last name of fullname. ex. "AspsCollection"
  name: string;
  fields: object[];
  methods: object[];

  constructor(fullname: string, fields: object[], methods: object[]) {
    this.names = fullname.split(".");
    this.name = nameFromFullname(fullname);
    this.fields = fields;
    this.methods = methods;
  }

  print(depth: number): void {
    const indent = " ".repeat(depth * 2);
    console.log(`${indent}export interface ${this.name} {`);
    this.fields.forEach(field => {
      let type: string = normalizeTypeName(field["2"]);
      console.log(`  ${indent}${field["1"]}?: ${type};`)
    })
    this.methods.forEach(method => {
      method["6"].split("\n").forEach(comment => {
        if (comment.length > 0) {
          console.log(`  ${indent}// ${comment}`);
        }
      });
      let line = `  ${indent}${method["1"]}(`;
      if (Array.isArray(method["3"])) {
        // has arguments
        const args: string[] = method["3"].map(arg => {
          let type: string = normalizeTypeName(arg["2"]);
          return `${arg["1"]}: ${type}`;
        });
        line = line + args.join(", ");
      }
      const type = normalizeTypeName(method["2"]);
      line = line + `): ${type};`
      console.log(line);
    })
    console.log(`${indent}}`);
  }
}

const normalizeTypeName = (type: string): string => {
  if (type === "Integer") {
    return "number";
  } else if (type === "Integer[]") {
    return "number[]";
  } else if (type === "Byte[]") {
    return "string";
  } else if (type === "String") {
    return "string";
  } else if (type === "String[]") {
    return "string[]";
  } else if (type === "Boolean") {
    return "boolean";
  } else if (type === "Object") {
    return "object";
  } else if (type === "Peopleapi.V1.Schema.Empty" || type === "Classroom.V1.Schema.Empty") {
    // Bugs in classroom_v1, peopleapi_v1
    return "void";
  }
  /**
   * Generate by
   * $ ls * | xargs -n1 jq '.["1"]["2"][0]["2"]' | ruby -ne 'puts ".replace(\"%s.%s.\", \"\")" % $_.split(".")[1..2]'
   */
  return type
    // https://github.com/DefinitelyTyped/DefinitelyTyped/pull/34073#discussion_r267847474
    .replace("Adsense.V1_4.", "")
    .replace("Analytics.V3.", "")
    .replace("Analyticsreporting.V4.", "")
    .replace("Appsactivity.V1.", "")
    .replace("Bigquery.V2.", "")
    .replace("Calendar.V3.", "")
    .replace("Classroom.V1.", "")
    .replace("Content.V2.", "")
    .replace("Dfareporting.V3_3.", "")
    .replace("Admin.Directory_v1.", "")
    .replace("Docs.V1.", "")
    .replace("Drive.V2.", "")
    .replace("Driveactivity.V2.", "")
    .replace("Fusiontables.V2.", "")
    .replace("Gmail.V1.", "")
    .replace("Groupsmigration.V1.", "")
    .replace("Groupssettings.V1.", "")
    .replace("Licensing.V1.", "")
    .replace("Mirror.V1.", "")
    .replace("Peopleapi.V1.", "")
    .replace("Admin.Reports_v1.", "")
    .replace("Reseller.V1.", "")
    .replace("Sheets.V4.", "")
    .replace("Slides.V1.", "")
    .replace("Tagmanager.V2.", "")
    .replace("Tasks.V1.", "")
    .replace("Urlshortener.V1.", "")
    .replace("Youtube.V3.", "")
    .replace("YoutubeAnalytics.V2.", "")
    .replace("YoutubePartner.V1.", "");
}

const convert = (obj: object): Interface => {
  const name = normalizeTypeName(obj["1"]);
  const fields: object[] = obj["2"] || [];
  const methods: object[] = obj["3"] || [];
  return new Interface("GoogleAppsScript." + name, fields, methods);
}

const nameFromFullname = (fullname: string): string => {
  const names: string[] = fullname.split(".");
  return names[names.length - 1];
}

if (process.argv.length < 3) {
  console.log("Usage: node index.js <json>");
  process.exit(1);
}

const dict: object = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const root = new Namespace("GoogleAppsScript");

// Main interface
let obj = dict["1"];
root.add(convert(obj));

dict["2"].forEach(cls => {
  root.add(convert(cls));
});
root.print(0);
