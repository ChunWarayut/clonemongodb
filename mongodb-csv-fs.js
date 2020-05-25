const mongodb = require("mongodb").MongoClient;
const Json2csvParser = require("json2csv").Parser;
const fs = require("fs");

// let url = "mongodb://username:password@localhost:27017/";
let url = "mongodb://incusdba:incus%40123@192.168.9.22,192.168.9.23,192.168.9.24:27017/arcusairdb?replicaSet=set1&readPreference=secondaryPreferred";

mongodb.connect(
  url,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    if (err) throw err;

    client
      .db("arcusairdb")
      .collection("patients")
      .aggregate([
        {
          $match: {
            firstname: {
              $in: ['Abilio',
                'Agnieszka Ewa',
                'Alexander Nikolaus',
                'Anatsaya',
                'Andrey',
                'Ang Wan Sheng',
                'Apisit',
                'Aung Zaw Win',
                'Barbara Franziska',
                'Bemele Quinta',]
            }
          }
        },
        {
          $match: {
            lastname: {
              $in: ['San Agustin Cecilio',
                'Wojtowicz',
                'Maag',
                'Korwuttipong',
                'Brendoev',
                '.',
                'Pumpuang',
                'ไม่มีนามสกุล',
                'Langer',
                'Obie',]
            }
          }
        },
        {
          $addFields: {
            // Need to prefix fields with '$'
            fullName: { $concat: ["$firstname", "$lastname"] },
          }
        },
        {
          $match: {
            fullName: {
              $in: ['AbilioSan Agustin Cecilio',
                'Agnieszka EwaWojtowicz',
                'Alexander NikolausMaag',
                'AnatsayaKorwuttipong',
                'AndreyBrendoev',
                'Ang Wan Sheng.',
                'ApisitPumpuang',
                'Aung Zaw Winไม่มีนามสกุล',
                'Barbara FranziskaLanger',
                'Bemele QuintaObie',]
            }
          }
        }
      ])
      .toArray((err, data) => {
        if (err) throw err;

        console.log(data);
        const json2csvParser = new Json2csvParser({ header: true });
        const csvData = json2csvParser.parse(data);

        fs.writeFile("bezkoder_mongodb_fs.csv", csvData, function (error) {
          if (error) throw error;
          console.log("Write to bezkoder_mongodb_fs.csv successfully!");
        });

        client.close();
      });
  }
);