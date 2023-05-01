const fs = require('fs');
const express = require('express');
const path = require('path');
const iconvLite = require('iconv-lite');
const csvParse = require('csv-parse');
const cors = require('cors');

global.__basedir = path.resolve() + "/..";

const app = express();

app.use(cors());
app.use(express.json());

app.get('/products', (req, res) => {
    const file = "./resources/products.csv";
    const result = [];

    fs.createReadStream(file)
        .pipe(iconvLite.decodeStream('utf16-le'))
        .pipe(iconvLite.encodeStream('utf8'))
        .pipe(csvParse.parse({cast: true, columns: true}))
        .on("error", (error) => {
            throw error.message;
        })
        .on("data", (row) => {
            Object.keys(row).forEach((key) => {
                if (row[key] === '') {
                    row[key] = null;
                }
            });
            result.push(row);
        })
        .on("end", () => {
            res.json(result);
        });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});
