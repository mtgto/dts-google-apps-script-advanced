import { readFile } from "fs/promises";

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
      console.log(
        `[DEBUG] childName=${childName}, fullname=${i.package.join(
          "."
        )}, children = ${this.children.map((c) => c.name)}`
      );
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

  constructor(fullname: string, fields: Field[]) {
    this.package = fullname.split(".");
    this.fields = fields;
  }

  get name(): string {
    return this.package[this.package.length - 1];
  }

  toString = (depth: number = 0): string => {
    const indent = "  ".repeat(depth);
    let output = indent + "export interface " + this.name + " {\n";
    this.fields.forEach((field) => {
      output += field.toString(depth + 1);
    });
    output += indent + "}\n";
    return output;
  };
}

class Field {
  readonly name: string;
  readonly typeName: string;
  readonly comment: string | undefined;

  constructor(name: string, typeName: string, comment: string | undefined) {
    this.name = name;
    this.typeName = typeName;
    this.comment = comment;
  }

  toString = (depth: number): string => {
    const indent = "  ".repeat(depth);
    let output = "";
    if (this.comment) {
      output += indent + "// " + this.comment + "\n";
    }
    output += indent + this.name + ": " + this.typeName + ";\n";
    return output;
  };
}

const normalizeVariableName = (varName: string): string => {
  return varName.replace(
    /(\w+)-(\w)(\w+)/,
    (match, former, char, latter) => former + char.toUpperCase() + latter
  );
};

const normalizeTypeName = (typeName: string): string => {
  if (typeName === "Integer") {
    return "number";
  } else if (typeName === "Integer[]") {
    return "number[]";
  } else if (typeName === "String") {
    return "string";
  } else if (typeName === "String[]") {
    return "string[]";
  } else if (typeName === "Boolean") {
    return "boolean";
  }
  const match = /^([^.]+)(\.\w+\.\w+)\.(.+)$/.exec(typeName);
  if (match) {
    typeName = match[1] + "." + match[3];
  } else {
    console.error(`[ERROR] Unsupported typeName: ${typeName}`);
  }
  return typeName;
};

const parseHierarchy = (obj: Dict): Interface => {
  const name = normalizeTypeName(obj["1"]);
  const fields: Field[] = (obj["2"] ?? []).map((field: Dict) => {
    const name = normalizeVariableName(field["1"]);
    const typeName = normalizeTypeName(field["2"]);
    const comment = field["6"];
    return new Field(name, typeName, comment);
  });
  const methods = obj["3"] ?? [];
  //console.log(`name = ${name}`);
  console.log(fields);
  //console.log(methods);
  return new Interface(`GoogleAppsScript.${name}`, fields);
};

export const parse = async (filename: string) => {
  const json = await readFile(filename);
  const dict: Dict = JSON.parse(json.toString());
  const root = new Namespace("GoogleAppsScript");
  // Main interface
  root.add(parseHierarchy(dict["1"]));
  // classes
  dict["2"].forEach((cls: Dict) => {
    root.add(parseHierarchy(cls));
  });
  console.log(root.toString(0));
};
