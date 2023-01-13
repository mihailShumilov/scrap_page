import {Request, Response} from 'express';
import * as cheerio from 'cheerio';
// import normalizeUrl from 'normalize-url';


interface HtmlToJsonResponse {
    status: string;
    result: JsonPageData;
}

interface JsonPageData {
    loaded: boolean;
    canonical?: string;
    title?: string;
    meta?: Array<{ name: string; value: string; }>,
    headers?: Array<{ tag: string; value: string; }>,
    url?: string;
    images?: Array<{
        name: string;
        src: string;
        normalizedSrc: string;
        height: number;
        width: number;
        alt?: string;
        title?: string;
    }>,
    lang?: string;
    site?: string;
    links?: Array<{
        url: string;
        normalizedUrl: string;
        title: string;
        anchor: string;
    }>,
    xRobotsTag?: Array<{ name: string; value: string; }>,
    host?: string;
    hostname?: string;
    pathname?: string;
    wordCount?: number;
    microdata?: string;
}

class HtmlToJson {

    private originText: string;

    private jsonData: JsonPageData;

    private processor: cheerio.CheerioAPI;

    private readonly url: string;

    constructor(text: string, url: string) {
        this.originText = text;
        this.processor = cheerio.load(text);
        this.url = url;
        this.jsonData = {
            loaded: true
        };
    }

    public build(): JsonPageData {
        this.getWordsCount();
        this.getSiteData();
        this.getLang();
        this.getTitle();
        this.getUrl();
        this.getHeaders();
        this.getAllMetaTags();
        this.getCanonical();
        this.getImages();
        this.getLinks();
        return this.jsonData;
    }

    protected getWordsCount() {
        function noscript(strCode: string) {
            return strCode.replace(/<script.*?>.*?<\/script>/igm, '');
        }

        function nostyle(strCode: string) {
            return strCode.replace(/<style.*?>.*?<\/style>/igm, '');
        }

        function nometa(strCode: string) {
            return strCode.replace(/<link.*?>.*?<\/link>/igm, '');
        }

        function nolink(strCode: string) {
            return strCode.replace(/<meta.*?>.*?<\/meta>/igm, '');
        }

        this.jsonData.wordCount = 0;

        var body = this.processor('body').clone();
        var head = this.processor('head').clone();

        body.find('script').remove();
        head.find('script').remove();
        body.find('style').remove();
        head.find('style').remove();
        body.find('meta').remove();
        head.find('meta').remove();
        body.find('link').remove();
        head.find('link').remove();

        if (body) {
            var bodyContent = body.text();

            try {
                this.jsonData.wordCount = bodyContent.match(/\S+/g).length;
            } catch (err) {
                this.jsonData.wordCount = 0;
            }
        }

        if (head) {
            var headContent = head.text();
            try {
                this.jsonData.wordCount += headContent.match(/\S+/g).length;
            } catch (err) {
                this.jsonData.wordCount = this.jsonData.wordCount;
            }
        }

        this.jsonData.wordCount = parseInt(this.jsonData.wordCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    }

    protected getSiteData() {
        this.jsonData.site = this.url;
    }

    protected getLang() {
        this.jsonData.lang = this.processor("html").first().attr('lang') ? this.processor("html").first().attr('lang')  : null;
    }

    protected getTitle() {
        const title = this.processor("title").first().text();
        this.jsonData.title = title;
    }

    protected hasTrailingSlash() {
        return this.url.match(/\/+$/);
    }

    protected removeTrailingSlashes(url:string) {
        return url ? url.replace(/\/+$/, "") : ""; //Removes one or more trailing slashes from URL
    }

    protected getUrl() {
        const parsedUrl = new URL(this.url);
        this.jsonData.hostname = parsedUrl.hostname;
        this.jsonData.host = parsedUrl.host;
        this.jsonData.pathname = parsedUrl.pathname;
    }

    protected getHeaders() {
        const self = this;

        this.processor("h1,H1,h2,H2,h3,H3,h4,H4,h5,H5,h6,H6").each(function (index, element) {
            const lowerCaseTagName = self.processor(element).prop("tagName").toLowerCase();
            const value = self.processor(element).text().trim();
            self.jsonData.headers = self.jsonData?.headers || [];
            self.jsonData.headers.push({
                tag: lowerCaseTagName,
                value: value
            });
        });
    }

    protected getAllMetaTags() {
        const self = this;

        this.processor("meta").each(function (index, element) {
            const name = self.processor(element).prop("name") || self.processor(element).attr("property");

            if (name) {
                const value = self.processor(element).attr("content");
                self.jsonData.meta = self.jsonData?.meta || [];
                self.jsonData.meta.push({
                    name: name,
                    value: value
                });
            }
        });
    }

    protected getCanonical() {
        var canonical = this.processor('link[rel="canonical"]').attr("href");
        if (canonical) {
            this.jsonData.canonical = canonical;
        }
    }

    protected getImages() {
        const self = this;

        this.processor("img").each(function (index, element) {
            const src = self.processor(element).attr("src");

            let normalizedSrc = src;

            if (src) {
                if (!src.includes("http://") || !src.includes("https://")) {
                    // normalizedSrc = normalizeUrl(src);
                }
            }

            const name = src && src.length > 0 ? src.substring(src.lastIndexOf("/") + 1) : "";
            const alt = self.processor(element).attr("alt");
            const title = self.processor(element).attr("title");
            const height = self.processor(element).attr('height');
            const width = self.processor(element).attr('width');
            self.jsonData.images = self.jsonData?.images || [];
            self.jsonData.images.push({
                name: name,
                src: src,
                normalizedSrc: normalizedSrc,
                height: parseInt(height),
                width: parseInt(width),
                alt: alt,
                title: title
            });
        });
    }

    protected getLinks() {
        const self = this;

        this.processor("a").each(function (index, element) {
            const url = self.processor(element).attr("href");

            let normalizedUrl =url;

            if (url) {
                if (!url.includes("http://") || !url.includes("https://")) {
                    // normalizedUrl = normalizeUrl(url);
                }
            }

            const title = self.processor(element).attr("title");
            const anchor = self.processor(element).text();
            self.jsonData.links = self.jsonData?.links || [];
            self.jsonData.links.push({
                url,
                normalizedUrl,
                title,
                anchor
            });
        });
    }

    // protected getXRobotsTag() {
    //     const self = this;
    //
    //     return __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee() {
    //         var data, headers, objectArray, robotsValue;
    //         return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
    //             while (1) {
    //                 switch (_context.prev = _context.next) {
    //                     case 0:
    //                         _context.next = 2;
    //                         return __WEBPACK_IMPORTED_MODULE_6_axios__["get"](window.location.href);
    //
    //                     case 2:
    //                         data = _context.sent;
    //                         headers = data.headers;
    //                         // console.log(headers)
    //
    //                         objectArray = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_object_entries___default()(headers);
    //                         robotsValue = [];
    //
    //                         __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_keys___default()(headers).forEach(function (key) {
    //                             if (key.toLowerCase() === "x-robots-tag") {
    //                                 _this6.xRobotsTag.push(headers[key]);
    //                             }
    //                         });
    //                         return _context.abrupt("return", _this6.xRobotsTag);
    //
    //                     case 8:
    //                     case "end":
    //                         return _context.stop();
    //                 }
    //             }
    //         }, _callee, _this6);
    //     }))();
    // }

    // protected getSchema() {
    //     var _this7 = this;
    //
    //     var _require = __webpack_require__("OsoP"),
    //         Handler = _require.Handler;
    //
    //     var _require2 = __webpack_require__("Fruj"),
    //         Parser = _require2.Parser;
    //
    //     var url = window.location.href;
    //
    //     var html = "";
    //     var handler = new Handler(function (err, result) {
    //         // console.log(result)
    //         _this7.microdata = {
    //             microdata: result.microdata ? result.microdata : null,
    //             jsonld: result.jsonld ? result.jsonld : null,
    //             graph: result.microdata && result.microdata[0] && result.microdata[0]['@graph'] ? result.microdata[0]['@graph'] : null
    //             // console.log(this.microdata)
    //         };
    //     }, {
    //         url: url // The HTML pages URL is used to resolve relative URLs.
    //     });
    //     var parser = new Parser(handler, {decodeEntities: true});
    //     parser.write(this.processor("html").html());
    //     parser.done();
    // }
}

type HtmlToJsonBuilder = (text: string, socketId?: string) => Promise<HtmlToJsonResponse>;

const htmlToJsonBuilder: HtmlToJsonBuilder = async (text: string, url: string, socketId?: any) => {
    const htmlToJson = new HtmlToJson(text, url);

    return {
        status: "ok",
        result: htmlToJson.build()
    }
};

export const htmlToJsonHandler = async (req: Request, res: Response) => {
    const {body} = req;
    const {text, url} = body;
    const response = await htmlToJsonBuilder(text, url);

    return res.json(response);
};
