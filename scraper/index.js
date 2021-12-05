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
  lakePath: null,
  startPos: null,
  endPos: null,
  currentPos: null,
  rowDirection: "right",
  rowCount: 1,
  columnCount: 1,
  zoom: 20,
  xDelta: 0.00128,
  yDelta: 0.00043,
  xCount: null,
  yCount: null,

  scrapeLake: async function (name, startPos, endPos) {
    scraper.startPos = startPos;
    scraper.endPos = endPos;
    scraper.currentPos = startPos;

    scraper.xCount = Math.floor(Math.abs((startPos.lng - endPos.lng) / scraper.xDelta)) + 2;
    scraper.yCount = Math.floor((startPos.lat - endPos.lat) / scraper.yDelta) + 2;

    scraper.browser = await puppeteer.launch({
      defaultViewport: {
        width: 1920,
        height: 937,
      },
      args: ["--no-sandbox"],
    });
    scraper.page = await scraper.browser.newPage();

    await console.time(`Row ${scraper.rowCount}`);
    await photographLake(name, startPos.lat, startPos.lng, true);
    await console.timeEnd(`Row ${scraper.rowCount}`);

    return { imageDir: scraper.lakePath, totalCol: scraper.rowCount, totalRow: scraper.columnCount };
  },
};

async function photographLake(name, lat, lng, isFirst) {
  scraper.lakePath = `./lakes/${name.replace(" ", "")}`;
  if (!(await fs.existsSync(scraper.lakePath))) {
    await fs.mkdirSync(scraper.lakePath);
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
      return;
    }

    if (scraper.rowDirection === "right") {
      // if we are at the end of the row, move down and change direction
      if (scraper.currentPos.lng >= scraper.endPos.lng) {
        scraper.rowDirection = "left";
        await console.timeEnd(`Row ${scraper.rowCount}`);
        await moveMap("down");
        await scraper.rowCount++;
        await console.time(`Row ${scraper.rowCount}`);
      } else {
        await moveMap("right");
        await scraper.columnCount++;
      }
    } else {
      // if we are at the end of the row, move down and change direction
      if (scraper.currentPos.lng <= scraper.startPos.lng) {
        scraper.rowDirection = "right";
        await console.timeEnd(`Row ${scraper.rowCount}`);
        await moveMap("down");
        await scraper.rowCount++;
        await console.time(`Row ${scraper.rowCount}`);
      } else {
        await moveMap("left");
        await scraper.columnCount--;
      }
    }

    await photographLake(name, scraper.currentPos.lat, scraper.currentPos.lng);
  } catch (e) {
    console.log(e);
  }
}
