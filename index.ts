import * as fs from "fs";

const dict: object = JSON.parse(fs.readFileSync('./admin_directory.json', 'utf8'));
// Object.keys(dict).forEach(key => {
//   const child: object = dict[key];
//   Object.keys(child).forEach(key => {
//     const grandchild: object = child[key];
//     if (typeof grandchild === "string") {
//       console.log("TARGET: " + grandchild);
//       return;
//     }
//     Object.keys(grandchild).forEach(key => {
//       console.log(grandchild[key]);
//     });
//   });
// });

const printObj = (obj: object): void => {
  const name = obj["1"];
  const fields: object[] = obj["2"] || [];
  const methods: object[] = obj["3"] || [];
  console.log(`export interface ${name} {`);
  fields.forEach(field => {
    console.log(`  ${field["1"]}: ${field["2"]};`)
  })
  methods.forEach(method => {
    console.log(`  // ${method["6"]}`);
    let line = `  ${method["1"]}(`;
    if (Array.isArray(method["3"])) {
      // has arguments
      const args: string[] = method["3"].map(arg => {
        return `${arg["1"]}: ${arg["2"]}`
      });
      line = line + args.join(", ");
    }
    line = line + `): ${method["2"]};`
    console.log(line);
  })
  console.log(`}`);
};


// Main interface
let obj = dict["1"];
printObj(obj);

dict["2"].forEach(cls => {
  printObj(cls);
});
