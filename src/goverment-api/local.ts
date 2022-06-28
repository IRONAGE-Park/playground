import path from "path";
import fs from "fs";
import { xml2js, Element } from "xml-js";
import { utils, writeFileXLSX } from "xlsx";

const xmlString = fs.readFileSync(path.join(__dirname, "local.xml")).toString();
const xmlJson = xml2js(xmlString);
const body = xmlJson.elements[0].elements.find(
  (e: Element) => e.name === "body"
);

const parseBody = (body.elements as Array<Element>).map((element: Element) => ({
  name: element.name,
  ...element.elements?.reduce((prev, cur) => {
    if (cur.name) {
      return {
        ...prev,
        [cur.name]: cur.elements?.[0].text,
      };
    }
    return {
      ...prev,
    };
  }, {}),
}));

console.log(parseBody);

writeFileXLSX(
  {
    SheetNames: ["result"],
    Sheets: { result: utils.json_to_sheet(parseBody) },
  },
  "local_result.xlsx"
);
