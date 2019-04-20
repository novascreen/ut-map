const http = require('http');
const fs = require('fs');
const fFlow = require('lodash/fp/flow');
const fMap = require('lodash/fp/map');
const fFlatten = require('lodash/fp/flatten');
const fUniqBy = require('lodash/fp/uniqBy');
const fUniq = require('lodash/fp/uniq');

const url = 'http://urbantoronto.ca/map/';

const fetch = url =>
  new Promise((resolve, reject) => {
    http.get(url, res => {
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

const getImageUrl = string => {
  if (typeof string !== 'string') return null;
  const [, url] = string.match(/<img(?:.*?)src="(.*?)"(?:.*?)>/);
  return url;
};

const getLinkDetails = string => {
  if (typeof string !== 'string') return [];
  const links = string.match(/<a(?:.*?)<\/a>/g);
  if (!links) return [];

  return links.map(link => {
    const [, url, title] = string.match(
      /<a(?:.*?)href="(.*?)"(?:.*?)>(.*?)<\/a>/
    );
    return { url, title };
  });
};

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
          content,
          type,
          developer = '',
          image,
          image_small,
          ...p
        }) => {
          const [, slug] = content.match(/database\/projects\/(.*?)"/);
          return {
            ...p,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            types: type
              .replace(/^::(.*?)::$/, '$1')
              .split('::::')
              .filter(Boolean),
            image: getImageUrl(image),
            imageSmall: getImageUrl(image_small),
            developers: fUniqBy('title', getLinkDetails(developer)),
            url: `//urbantoronto.ca/database/projects/${slug}`
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
