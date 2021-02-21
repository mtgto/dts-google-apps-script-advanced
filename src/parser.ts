import { readFile } from "fs/promises";
import { definitions } from "./api";
import wordwrap from "word-wrap";
import debug from "debug";

type Dict = { [key: string]: any };

/// Namespace
class Namespace {
  readonly package: ReadonlyArray<string>;
  readonly children: Namespace[];
  readonly interfaces: Interface[];

  constructor(fullname: string) {
    this.package = fullname.split(".");
    this.children = [];
    this.interfaces = [];
  }

  get name(): string {
    return this.package[this.package.length - 1];
  }

  add = (i: Interface) => {
    if (this.package.length + 1 === i.package.length) {
      this.interfaces.push(i);
    } else if (this.package.length + 1 < i.package.length) {
      const childName = i.package[this.package.length];
      debug(`[DEBUG] childName=${childName}, fullname=${i.package.join(".")}, children = ${this.children.map((c) => c.name)}`);
      let child = this.children.find((child) => child.name === childName);
      if (!child) {
        child = new Namespace([...this.package, childName].join("."));
        this.children.push(child);
      }
      child.add(i);
    }
  };

  toString = (depth: number = 0): string => {
    let output = depth === 0 ? "declare " : "";
    output += "  ".repeat(depth);
    output += "namespace " + this.name + " {\n";
    this.children.forEach((child) => {
      output += child.toString(depth + 1);
    });
    this.interfaces.forEach((i) => {
      output += i.toString(depth + 1);
    });
    output += "  ".repeat(depth) + "}\n";

    return output;
  };
}

class Interface {
  readonly package: ReadonlyArray<string>;
  readonly fields: ReadonlyArray<Field>;
  readonly methods: ReadonlyArray<Method>;
  readonly comment: Comment | undefined;

  constructor(fullname: string, fields: Field[], methods: Method[], comment: Comment | undefined) {
    this.package = fullname.split(".");
    this.fields = fields;
    this.methods = methods;
    this.comment = comment;
  }

  get name(): string {
    return this.package[this.package.length - 1];
  }

  toString = (depth: number = 0): string => {
    const indent = "  ".repeat(depth);
    let output = "";
    if (this.comment) {
      output += this.comment.toString(depth);
    }
    output += indent + "interface " + this.name + " {\n";
    this.fields.forEach((field) => {
      output += field.toString(depth + 1);
    });
    this.methods.forEach((method) => {
      output += method.toString(depth + 1);
    });
    output += indent + "}\n";
    return output;
  };
}

class Method {
  readonly name: string;
  readonly returnTypeName: string;
  readonly args: Field[];
  readonly comment: Comment | undefined;

  constructor(name: string, returnTypeName: string, args: Field[], comment: Comment | undefined) {
    this.name = name;
    this.returnTypeName = returnTypeName;
    this.args = args;
    this.comment = comment;
  }

  toString = (depth: number): string => {
    const indent = "  ".repeat(depth);
    let output = "";
    if (this.comment) {
      output += this.comment.toString(depth);
    }
    output += indent + this.name + "(";
    output += this.args.map((arg) => `${arg.name}: ${arg.typeName}`).join(", ");
    output += `): ${this.returnTypeName};\n`;
    return output;
  };
}

class Field {
  readonly name: string;
  readonly typeName: string;
  readonly comment: Comment | undefined;

  constructor(name: string, typeName: string, comment: Comment | undefined) {
    this.name = name;
    this.typeName = typeName;
    this.comment = comment;
  }

  toString = (depth: number): string => {
    const indent = "  ".repeat(depth);
    let output = "";
    if (this.comment) {
      output += this.comment.toString(depth);
    }
    output += indent + this.name + "?: " + this.typeName + ";\n";
    return output;
  };
}

class Comment {
  readonly comment: string;

  constructor(comment: string) {
    this.comment = comment;
  }

  toString = (depth: number): string => {
    return wordwrap(this.comment, { indent: "", width: 120 })
      .split("\n")
      .map((line) => "  ".repeat(depth) + "// " + line.trimEnd() + "\n")
      .join("");
  };
}

const normalizeVariableName = (varName: string): string => {
  return varName.replace(/(\w+)-(\w)(\w+)/, (_match, former, char, latter) => former + char.toUpperCase() + latter);
};

// Unknown types which defined in automatic macros
const unknownTypeNames: { [unknownName: string]: string } = {
  "Area120tables.V1alpha1.Schema.Empty": "any",
  "Bigquery.V2.Schema.JsonObject": "any",
  "Classroom.V1.Schema.Empty": "void",
  "Classroom.V1.Schema.ReclaimStudentSubmissionRequest": "any",
  "Docs.V1.Schema.EmbeddedDrawingProperties": "any",
  "Driveactivity.V2.Schema.Edit": "any",
  "Driveactivity.V2.Schema.Administrator": "any",
  "Driveactivity.V2.Schema.AnonymousUser": "any",
  "Driveactivity.V2.Schema.Legacy": "any",
  "Driveactivity.V2.Schema.NoConsolidation": "any",
  "Driveactivity.V2.Schema.New": "any",
  "Driveactivity.V2.Schema.Upload": "any",
  "Driveactivity.V2.Schema.DriveFile": "any",
  "Driveactivity.V2.Schema.File": "any",
  "Driveactivity.V2.Schema.Anyone": "any",
  "Licensing.V1.Schema.Empty": "void",
  "Peopleapi.V1.Schema.Empty": "void",
  "Sheets.V4.Schema.ClearValuesRequest": "any",
  "Youtube.V3.Schema.TokenPagination": "any",
  "Youtube.V3.Schema.TestItemTestItemSnippet": "any",
  "Youtube.V3.Schema.VideoProjectDetails": "any",
  "YoutubePartner.V1.Schema.Empty": "void",
};

/**
 * Convert package name from autocomplete macros format.
 *
 * Example:
 * "Admin_directory_v1.Admin.Directory_v1.Collection" => "AdminDirectory.Collection"
 * "Admin.Directory_v1.Schema.Channel" => "Schema.Channel"
 */
const normalizePackageName = (packageName: string): string | undefined => {
  for (const definition of definitions) {
    if (packageName === definition.innerName) {
      return definition.id;
    } else {
      const word = `${definition.innerName}.${definition.abbreviatedName}`;
      if (packageName.startsWith(word)) {
        return packageName.replace(word, "");
      } else if (packageName.startsWith(definition.abbreviatedName)) {
        return packageName.replace(definition.abbreviatedName, "");
      }
    }
  }
  return undefined;
};

const normalizeTypeName = (typeName: string): string => {
  if (typeName === "Blob" || typeName === "void") {
    return typeName;
  } else if (typeName === "Integer") {
    return "number";
  } else if (typeName === "Integer[]") {
    return "number[]";
  } else if (typeName === "Number") {
    return "number";
  } else if (typeName === "Number[]") {
    return "number[]";
  } else if (typeName === "String") {
    return "string";
  } else if (typeName === "String[]") {
    return "string[]";
  } else if (typeName === "String[][]") {
    return "string[][]";
  } else if (typeName === "Byte[]") {
    return "string";
  } else if (typeName === "Boolean") {
    return "boolean";
  } else if (typeName === "Boolean[]") {
    return "boolean[]";
  } else if (typeName === "Object") {
    return "object";
  } else if (typeName === "Object[]") {
    return "object[]";
  } else if (typeName === "Object[][]") {
    return "object[][]";
  } else {
    const converted = unknownTypeNames[typeName];
    if (converted) {
      return converted;
    }
  }
  const normalizedName = normalizePackageName(typeName);
  if (normalizedName) {
    return normalizedName;
  } else {
    throw new Error(`${typeName} is not registered in package names`);
  }
};

const parseHierarchy = (obj: Dict): Interface => {
  const interfaceName = normalizeTypeName(obj["1"]);
  const fields: Field[] = (obj["2"] ?? []).map(
    (field: Dict): Field => {
      let name: string = field["1"];
      if (name.includes("-")) {
        name = `"${name}"`;
      }
      const typeName = normalizeTypeName(field["2"]);
      const comment = field["6"] ? new Comment(field["6"]) : undefined;
      return new Field(name, typeName, comment);
    }
  );
  const methods = (obj["3"] ?? []).map(
    (method: Dict): Method => {
      const name = normalizeVariableName(method["1"]);
      const returnTypeName = normalizeTypeName(method["2"]);
      const args = (method["3"] ?? []).map((field: Dict) => {
        const name = normalizeVariableName(field["1"]);
        const typeName = normalizeTypeName(field["2"]);
        const comment = field["6"] ? new Comment(field["6"]) : undefined;
        return new Field(name, typeName, comment);
      });
      const comment = method["6"] ? new Comment(method["6"]) : undefined;
      return new Method(name, returnTypeName, args, comment);
    }
  );
  const comment = obj["6"] ? new Comment(obj["6"]) : undefined;
  return new Interface(`GoogleAppsScript.${interfaceName}`, fields, methods, comment);
};

export const parse = async (filename: string): Promise<string> => {
  const json = await readFile(filename);
  const dict: Dict = JSON.parse(json.toString());
  const root = new Namespace("GoogleAppsScript");
  // Main
  const main = parseHierarchy(dict["1"]);
  root.add(main);
  // classes
  dict["2"].forEach((cls: Dict) => {
    root.add(parseHierarchy(cls));
  });

  let output = root.toString(0);
  output += `declare const ${main.name}: GoogleAppsScript.${main.name};\n`;
  return output;
};
