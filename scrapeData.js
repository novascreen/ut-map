const https = require('https');
const fs = require('fs');
const fFlow = require('lodash/fp/flow');
const fMap = require('lodash/fp/map');
const fFlatten = require('lodash/fp/flatten');
const fUniq = require('lodash/fp/uniq');

const url = 'https://urbantoronto.ca/map/';

const fetch = url =>
  new Promise((resolve, reject) => {
    https.get(url, res => {
      res.setEncoding('utf8');
      let body = '';
      res.on('data', data => {
        body += data;
      });
      res.on('end', () => {
        resolve(body);
      });
      res.on('error', reject);
    });
  });

const sort = a => a.sort();
const getKey = key => obj => obj[key];
const getFilters = projects => ({
  status: fFlow(fMap(getKey('status')), fUniq, sort)(projects).filter(Boolean),
  type: fFlow(fMap(getKey('types')), fFlatten, fUniq, sort)(projects).filter(
    Boolean
  )
});

(async () => {
  try {
    const body = await fetch(url);
    let [, projects] = body.match(/var projects = \[([\s\S]*?)\]/, '$1');
    projects = JSON.parse(`[${projects}]`);
    projects = projects
      .filter(p => p.latitude && p.longitude)
      .map(
        ({
          latitude,
          longitude,
          path,
          category,
          // filter out these fields
          website,
          type,
          city,
          country,
          storeys,
          height,
          region,
          ...p
        }) => {
          return {
            ...p,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            types: category.replace(/\s/g, '').split(','),
            url: `https://urbantoronto.ca/${path}`
          };
        }
      );

    const filters = getFilters(projects);

    fs.writeFileSync(
      './src/data.json',
      JSON.stringify({ filters, projects }, null, 2)
    );
  } catch (e) {
    console.error(e);
  }
})();
