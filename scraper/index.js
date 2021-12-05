const puppeteer = require("puppeteer");
const fs = require("fs");

/* Helper Functions */
function setURL(lat, lng) {
  return `https://fishing-app.gpsnauticalcharts.com/i-boating-fishing-web-app/fishing-marine-charts-navigation.html?title=Greenwood+Greenwood+%2CReservoir+boating+app#${scraper.zoom}/${lat}/${lng}`;
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function screenshot(lakeName) {
  return new Promise(async (resolve) => {
    let path = `./lakes/${lakeName.replace(" ", "")}/lake${scraper.rowCount}-${scraper.columnCount}.png`;
    scraper.page.screenshot({ path }).then(async () => {
      await resolve();
    });
  });
}
function moveMap(direction) {
  switch (direction) {
    case "right":
      scraper.currentPos.lng += 0.00128;
      break;
    case "left":
      scraper.currentPos.lng -= 0.00128;
      break;
    case "down":
      scraper.currentPos.lat -= 0.00043;
      break;
    case "up":
      scraper.currentPos.lat += 0.00043;
      break;
  }
}
/* End Helper Functions */

module.exports = scraper = {
  browser: null,
  page: null,
  startPos: null,
  endPos: null,
  currentPos: null,
  rowCount: 1,
  columnCount: 1,
  zoom: 20,
  xDelta: 0.00128,
  yDelta: 0.00043,

  scrapeLake: async function (name, startPos, endPos) {
    scraper.startPos = startPos;
    scraper.endPos = endPos;

    scraper.currentPos = startPos;

    scraper.browser = await puppeteer.launch({
      defaultViewport: {
        width: 1920,
        height: 937,
      },
    });
    scraper.page = await scraper.browser.newPage();

    return await photographLake(name, startPos.lat, startPos.lng, true);
  },
};

async function photographLake(name, lat, lng, isFirst) {
  let rowDirection = "right";
  if (!(await fs.existsSync(`./lakes/${name.replace(" ", "")}`))) {
    await fs.mkdirSync(`./lakes/${name.replace(" ", "")}`);
  }

  try {
    await scraper.page.goto(setURL(lat, lng, scraper.zoom));
    await sleep(800);
    if (isFirst) await sleep(2200);

    await scraper.page.addStyleTag({
      content:
        ".mapboxgl-ctrl-real-center,.mapboxgl-ctrl-top-left,.mapboxgl-ctrl-bottom-left,.mapboxgl-ctrl-top-right,.mapboxgl-ctrl-bottom-right{display:none}",
    });

    scraper.currentPos = { lat, lng };

    await screenshot(name);

    if (scraper.currentPos.lat <= scraper.endPos.lat && scraper.currentPos.lng >= scraper.endPos.lng) {
      return [scraper.rowCount, scraper.columnCount];
    }

    if (rowDirection === "right") {
      // if we are at the end of the row, move down and change direction
      if (scraper.currentPos.lng >= scraper.endPos.lng) {
        rowDirection = "left";
        await moveMap("down");
        await scraper.rowCount++;
      } else {
        await moveMap("right");
        await scraper.columnCount++;
      }
    } else {
      // if we are at the end of the row, move down and change direction
      if (scraper.currentPos.lng <= scraper.startPos.lng) {
        rowDirection = "right";
        await moveMap("down");
        await scraper.rowCount++;
      } else {
        await moveMap("left");
        await scraper.columnCount--;
      }
    }

    await console.log(`Row: ${scraper.rowCount}, Column: ${scraper.columnCount}`);
    await photographLake(name, scraper.currentPos.lat, scraper.currentPos.lng);
  } catch (e) {
    console.log(e);
  }
}
