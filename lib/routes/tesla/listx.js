const got = require('@/utils/got');

module.exports = async (ctx) => {
    // const { type = 'all' } = ctx.params;
    const url = `https://www.tesla.cn/inventory/api/v1/inventory-results?query=%7B%22query%22%3A%7B%22model%22%3A%22mx%22%2C%22condition%22%3A%22used%22%2C%22options%22%3A%7B%7D%2C%22arrangeby%22%3A%22Distance%22%2C%22order%22%3A%22asc%22%2C%22market%22%3A%22CN%22%2C%22language%22%3A%22zh%22%2C%22super_region%22%3A%22north%20america%22%2C%22lng%22%3A120.1619%2C%22lat%22%3A30.294%2C%22zip%22%3A%22null%22%2C%22range%22%3A0%7D%2C%22offset%22%3A0%2C%22count%22%3A50%2C%22outsideOffset%22%3A0%2C%22outsideSearch%22%3Afalse%7D`;
    // const url = 'https://www.tesla.cn/inventory/api/v1/inventory-results?query=%7B%22query%22%3A%7B%22model%22%3A%22m3%22%2C%22condition%22%3A%22used%22%2C%22options%22%3A%7B%7D%2C%22arrangeby%22%3A%22Distance%22%2C%22order%22%3A%22asc%22%2C%22market%22%3A%22CN%22%2C%22language%22%3A%22zh%22%2C%22super_region%22%3A%22north%20america%22%2C%22lng%22%3A120.1619%2C%22lat%22%3A30.294%2C%22zip%22%3A%22null%22%2C%22range%22%3A0%7D%2C%22offset%22%3A0%2C%22count%22%3A50%2C%22outsideOffset%22%3A0%2C%22outsideSearch%22%3Afalse%7D';

    const response = await got({
        method: 'get',
        url,
    });
    const { results, total_matches_found } = response.data;
    // const $ = cheerio.load(data); // 使用 cheerio 加载返回的 HTML
    // // const list = $('ul[class=sf-pai-item-list]');
    // const list = $('#J_keywords');
    if (total_matches_found <= 0) {
        return;
    }
    // console.log('test:'+JSON.stringify(results));

    const items = results.map((item) => {
        // console.log('item:'+JSON.stringify(item));
        const title = item.TrimName;
        const link = url;
        const description = item.VehicleRegion;

        return {
            title,
            link,
            description,
            guid: item.id,
        };
    });

    ctx.state.data = {
        title: 'tesla-认证二手车',
        link: url,
        description: 'tesla-认证二手车',
        item: items,
    };
};
