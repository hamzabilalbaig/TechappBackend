const { QBRealmHostname } = require("../configs/quickbase.config");
const axios = require("axios");
const _ = require("lodash");

async function getQuickbaseTableData(body) {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${process.env.QUICKBASE_URL}/v1/records/query`,
    headers: {
      Authorization: process.env.QUICKBASE_TOKEN,
      "QB-Realm-Hostname": QBRealmHostname,
    },
    data: {
      from: body?.from,
      select: body?.select,
      where: body?.where,
    },
  };

  const result = await axios.request(config);
  if (result?.data?.data) {
    const metaData = result?.data;
    const metaDataArray = metaData.data.map((record) => {
      const fields = metaData.fields;
      const recordKeys = Object.keys(record);
      const transformedRecord = {};

      fields.forEach((field) => {
        const fieldId = field.id.toString();
        if (recordKeys.includes(fieldId)) {
          transformedRecord[field.label] = record[fieldId].value;
        }
      });

      return transformedRecord;
    });

    return metaDataArray
  }
  return null
}
async function getQuickbaseTableFields(table_id) {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${process.env.QUICKBASE_URL}/v1/fields?tableId=${table_id}`,
    headers: {
      Authorization: process.env.QUICKBASE_TOKEN,
      "QB-Realm-Hostname": QBRealmHostname,
    },
  };

  const result = await axios.request(config);
  const cv = result?.data?.map((x) => {
    if (x.appearsByDefault == true) {
      return { id: x?.id, label: x?.label };
    }
  });

  return cv;
}

async function insertVisitIntoQuickbaseTable(visit, table_id, visit_id) {
  const qbfields = await getQuickbaseTableFields(table_id);
  if (qbfields?.length > 0) {
    const ss = Object.values(qbfields).map((d) => {
      if (d?.label === "postgre_table_visit_id") {
        return { [d?.id]: { value: visit_id } };
      } else {
        return { [d?.id]: { value: visit[d?.label] ?? null } };
      }
    });
    let newData = ss.reduce((acc, cur) => {
      let key = Object.keys(cur)[0];
      acc[key] = cur[key];
      return acc;
    }, {});

    delete newData?.undefined;

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.quickbase.com/v1/records",
      headers: {
        "QB-Realm-Hostname": QBRealmHostname,
        Authorization: process.env.QUICKBASE_TOKEN,
        "Content-Type": "application/json",
      },
      data: {
        to: table_id,
        data: [newData],
      },
    };
    try {
      const result = await axios.request(config);
      if (result?.data) {
        return result.data;
      }
    } catch (ex) {
      return ex;
    }
  }
  return null;
}

module.exports = {
  getQuickbaseTableFields,
  insertVisitIntoQuickbaseTable,
  getQuickbaseTableData,
};
