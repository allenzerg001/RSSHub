const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

module.exports = async (ctx) => {
    // const { type = 'all' } = ctx.params;
    const url = `https://sf.taobao.com/item_list.htm?category=50025972`;

    // const response = await got({
    //     method: 'get',
    //     url
    // });
    // const data = response.data;
    // const $ = cheerio.load(data); // 使用 cheerio 加载返回的 HTML
    // // const list = $('ul[class=sf-pai-item-list]');
    // const list = $('#J_keywords');

    // 使用 RSSHub 提供的 puppeteer 工具类，初始化 Chrome 进程
    const browser = await puppeteer.launch({
        args: ['--disable-gpu', '--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-first-run', '--no-sandbox', '--no-zygote', '--single-process'],
    });
    // 创建一个新的浏览器页面
    const page = await browser.newPage();
    // 访问指定的链接
    await page.goto(url);
    // 渲染目标网页
    const html = await page.evaluate(
        async () =>
            // 选取渲染后的 HTML
            // eslint-disable-next-line
            document.querySelector('body').innerHTML
    );
    // 关闭浏览器进程
    browser.close();

    const $ = cheerio.load(html); // 使用 cheerio 加载返回的 HTML
    const list = $('li', 'ul[class=sf-pai-item-list]'); // 使用 cheerio 选择器，选择所有 <div class="item"> 元素，返回 cheerio node 对象数组

    ctx.state.data = {
        title: '淘宝司法拍卖-机动车',
        link: url,
        description: '淘宝司法拍卖-机动车',
        item: list
            .map((i, item) => ({
                aid: $(item).attr('id'),
                // 文章标题
                title: $(item).find('.title').text().trim(),
                pic: $(item).find('.pic').attr('src'),
                // 文章链接
                link: $(item).find('.link-wrap').attr('href'),
                // 文章发布时间
                pubDate: new Date(item.time * 1000).toUTCString(),
                desc: $(item).find('.title').text().trim(),
            }))
            .get(), // cheerio get() 方法将 cheerio node 对象数组转换为 node 对象数组
    };
};
