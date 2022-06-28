import http from "http";
import path from "path";
import fs from "fs";
import { xml2js, Element } from "xml-js";
import { utils, writeFile } from "xlsx";

const getQueryString = (obj: Record<string, string>) => {
  return Object.entries(obj)
    .map((entrie) => entrie.join("="))
    .join("&");
};

const data = {
  serviceKey:
    "3qU%2BUnQgr2%2Fy35RbS%2BtmXhL0NTDSQMCTEGlU%2BSvKq1Ce8G7D5XAhuw2kmoZkcjSNnHspf%2FR6hmdNGA2j2oKO%2BQ%3D%3D",
  rowsCount: "1000",
  toncode: "2L",
  startDay: "20210101",
  endDay: "20211231",
};

console.log("?");
const req = http.request(
  {
    hostname: "apis.data.go.kr",
    path: `/1532000/DAY_TOT_ARR/view_list?${getQueryString(data)}`,
    method: "GET",
  },
  (res) => {
    res.on("data", (d) => {
      try {
        const xmlString = d.toString();
        fs.writeFileSync(path.join(__dirname, "result.xml"), xmlString);
        const xmlJson = xml2js(d.toString());
        const body = xmlJson.elements[0].elements.find(
          (e: Element) => e.name === "body"
        );
        console.log(xmlString);
        const parseBody = body.elements.map((element: Element) => ({
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
      } catch (e) {
        console.error(e);
      }
    });
  }
);

req.on("error", (error) => {
  console.error("Error?", error);
});

req.end();
