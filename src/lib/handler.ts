// import * as Url from "url";
// // import providers from './providers.json';
//
// /**
//  * Keep track of vocabulary prefixes.
//  */
// exports.KNOWN_VOCABULARIES = {
//     // https://www.w3.org/2011/rdfa-context/rdfa-1.1.html
//     csvw: "http://www.w3.org/ns/csvw#",
//     dcat: "http://www.w3.org/ns/dcat#",
//     qb: "http://purl.org/linked-data/cube#",
//     grddl: "http://www.w3.org/2003/g/data-view#",
//     ma: "http://www.w3.org/ns/ma-ont#",
//     org: "http://www.w3.org/ns/org#",
//     owl: "http://www.w3.org/2002/07/owl#",
//     prov: "http://www.w3.org/ns/prov#",
//     rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
//     rdfa: "http://www.w3.org/ns/rdfa#",
//     rdfs: "http://www.w3.org/2000/01/rdf-schema#",
//     rif: "http://www.w3.org/2007/rif#",
//     rr: "http://www.w3.org/ns/r2rml#",
//     sd: "http://www.w3.org/ns/sparql-service-description#",
//     skos: "http://www.w3.org/2004/02/skos/core#",
//     skosxl: "http://www.w3.org/2008/05/skos-xl#",
//     wdr: "http://www.w3.org/2007/05/powder#",
//     void: "http://rdfs.org/ns/void#",
//     wdrs: "http://www.w3.org/2007/05/powder-s#",
//     xhv: "http://www.w3.org/1999/xhtml/vocab#",
//     xml: "http://www.w3.org/XML/1998/namespace",
//     xsd: "http://www.w3.org/2001/XMLSchema#",
//     cc: "https://creativecommons.org/ns#",
//     ctag: "http://commontag.org/ns#",
//     dc: "http://purl.org/dc/terms/",
//     dcterms: "http://purl.org/dc/terms/",
//     dc11: "http://purl.org/dc/elements/1.1/",
//     foaf: "http://xmlns.com/foaf/0.1/",
//     gr: "http://purl.org/goodrelations/v1#",
//     ical: "http://www.w3.org/2002/12/cal/icaltzd#",
//     og: "http://ogp.me/ns#",
//     rev: "http://purl.org/stuff/rev#",
//     sioc: "http://rdfs.org/sioc/ns#",
//     v: "http://rdf.data-vocabulary.org/#",
//     vcard: "http://www.w3.org/2006/vcard/ns#",
//     schema: "http://schema.org/",
//     // http://ogp.me/
//     music: "http://ogp.me/ns/music#",
//     video: "http://ogp.me/ns/video#",
//     article: "http://ogp.me/ns/article#",
//     book: "http://ogp.me/ns/book#",
//     profile: "http://ogp.me/ns/profile#",
//     website: "http://ogp.me/ns/website#",
//     fb: "http://ogp.me/ns/fb#"
// };
// /**
//  * Grab the correct attribute for RDFa support.
//  */
// exports.HTML_VALUE_MAP = {
//     meta(attrs: any) {
//         return attrs.content;
//     },
//     audio(attrs: any, baseUrl: string) {
//         return attrs.src ? Url.resolve(baseUrl, attrs.src) : undefined;
//     },
//     a(attrs: any, baseUrl: string) {
//         return attrs.href ? Url.resolve(baseUrl, attrs.href) : undefined;
//     },
//     object(attrs: any, baseUrl: string) {
//         return attrs.data ? Url.resolve(baseUrl, attrs.data) : undefined;
//     },
//     time(attrs: any) {
//         return attrs.datetime;
//     },
//     data(attrs: any) {
//         return attrs.value;
//     }
// };
// exports.HTML_VALUE_MAP["embed"] = exports.HTML_VALUE_MAP["audio"];
// exports.HTML_VALUE_MAP["iframe"] = exports.HTML_VALUE_MAP["audio"];
// exports.HTML_VALUE_MAP["img"] = exports.HTML_VALUE_MAP["audio"];
// exports.HTML_VALUE_MAP["source"] = exports.HTML_VALUE_MAP["audio"];
// exports.HTML_VALUE_MAP["track"] = exports.HTML_VALUE_MAP["audio"];
// exports.HTML_VALUE_MAP["video"] = exports.HTML_VALUE_MAP["audio"];
// exports.HTML_VALUE_MAP["area"] = exports.HTML_VALUE_MAP["a"];
// exports.HTML_VALUE_MAP["link"] = exports.HTML_VALUE_MAP["a"];
// exports.HTML_VALUE_MAP["meter"] = exports.HTML_VALUE_MAP["data"];
// exports.HandlerFlags = {
//     hasLang: 1 << 0,
//     rdfaLink: 1 << 1,
//     rdfaNode: 1 << 2,
//     rdfaVocab: 1 << 3,
//     microdataNode: 1 << 4,
//     microdataVocab: 1 << 5,
//     microdataScope: 1 << 6
// };
//
// class Handler {
//     private callback: any;
//     private options: any;
//     private result: { images: any[]; alternate: any[]; links: any[]; icons: any[] };
//     private contexts: { flags: number; attributes: {}; text: string; tagName: string }[];
//     private langs: any[];
//     private _rdfaNodes: {}[];
//     private _rdfaVocabs: any[];
//     private _rdfaRels: any[];
//     private _microdataRefs: {};
//     private _microdataScopes: any[][];
//     private _microdataNodes: {}[];
//
//     constructor(callback: any, options: any) {
//         this.callback = callback;
//         this.options = options;
//         this.result = {
//             alternate: [],
//             icons: [],
//             links: [],
//             images: []
//         };
//         this.contexts = [
//             {tagName: "", text: "", flags: 0, attributes: {}}
//         ];
//         this.langs = [];
//         this._rdfaNodes = [{}];
//         this._rdfaVocabs = [];
//         this._rdfaRels = [];
//         this._microdataRefs = {};
//         this._microdataScopes = [[]];
//         this._microdataNodes = [{}];
//     }
//
//     onend() {
//         const oembedProvider = providers.match(this.options.url);
//         // Add the known OEmbed provider when discovered externally.
//         if (oembedProvider &&
//             !this.result.alternate.some(x => x.type === oembedProvider.type)) {
//             this.result.alternate.push(oembedProvider);
//         }
//         this.callback(null, this.result);
//     }
//
//     onerror(error) {
//         this.callback(error, this.result);
//     }
//
//     onopentag(tagName, attributes) {
//         const context = {tagName, text: "", flags: 0, attributes};
//         this.contexts.push(context);
//         // HTML attributes.
//         const relAttr = normalize(attributes["rel"]);
//         const srcAttr = normalize(attributes["src"]);
//         const hrefAttr = normalize(attributes["href"]);
//         const langAttr = normalize(attributes["lang"]);
//         // RDFa attributes.
//         const propertyAttr = normalize(attributes["property"]);
//         const vocabAttr = normalize(attributes["vocab"]);
//         const prefixAttr = normalize(attributes["prefix"]);
//         const resourceAttr = normalize(attributes["resource"]);
//         const typeOfAttr = normalize(attributes["typeof"]);
//         const aboutAttr = normalize(attributes["about"]);
//         // Microdata attributes.
//         const idAttr = normalize(attributes["id"]);
//         const itempropAttr = normalize(attributes["itemprop"]);
//         const itemidAttr = normalize(attributes["itemid"]);
//         const itemtypeAttr = normalize(attributes["itemtype"]);
//         const itemrefAttr = normalize(attributes["itemref"]);
//         // Push the language onto the stack.
//         if (langAttr) {
//             this.langs.push(langAttr);
//             context.flags = context.flags | exports.HandlerFlags.hasLang;
//         }
//         // Store `id` references for later (microdata itemrefs).
//         if (idAttr && !this._microdataRefs.hasOwnProperty(idAttr)) {
//             this._microdataRefs[idAttr] = {};
//         }
//         // Microdata item.
//         if (attributes.hasOwnProperty("itemscope")) {
//             const newNode = {};
//             // Copy item reference data.
//             if (itemrefAttr) {
//                 const refs = split(itemrefAttr);
//                 for (const ref of refs) {
//                     // Set microdata id reference when it doesn't already exist.
//                     if (this._microdataRefs[ref] !== undefined) {
//                         assignJsonldProperties(newNode, this._microdataRefs[ref]);
//                     }
//                     this._microdataRefs[ref] = newNode;
//                 }
//             }
//             // Set child scopes on the root scope.
//             if (itempropAttr) {
//                 const id = normalize(context.attributes["id"]);
//                 this._addMicrodataProperty(last(this._microdataNodes), id, split(itempropAttr), newNode);
//             } else {
//                 this.result.microdata = merge(this.result.microdata, newNode);
//                 this._microdataScopes.push([]);
//                 context.flags = context.flags | exports.HandlerFlags.microdataScope;
//             }
//             // Push the new node as the current scope.
//             this._microdataNodes.push(newNode);
//             context.flags = context.flags | exports.HandlerFlags.microdataNode;
//         }
//         // Microdata `itemprop=""`.
//         if (itempropAttr && !(context.flags & exports.HandlerFlags.microdataNode)) {
//             const value = getValueMap(this.options.url, tagName, attributes);
//             const props = split(itempropAttr);
//             if (value !== undefined) {
//                 this._addMicrodataProperty(last(this._microdataNodes), normalize(context.attributes["id"]), props, normalizeJsonLdValue({
//                     "@value": value,
//                     "@language": last(this.langs)
//                 }));
//             } else {
//                 context.microdataTextProperty = props;
//             }
//         }
//         // Microdata `itemid=""`.
//         if (itemidAttr) {
//             const id = normalize(context.attributes["id"]);
//             this._setMicrodataProperty(last(this._microdataNodes), id, "@id", itemidAttr);
//         }
//         // Microdata `itemtype=""`.
//         if (itemtypeAttr) {
//             const [vocab, type] = splitItemtype(itemtypeAttr);
//             const vocabs = last(this._microdataScopes);
//             const id = normalize(context.attributes["id"]);
//             if (type && vocabs && vocab !== last(vocabs)) {
//                 setContext(last(this._microdataNodes), "@vocab", vocab);
//                 vocabs.push(vocab);
//                 context.flags = context.flags | exports.HandlerFlags.microdataVocab;
//             }
//             this._addMicrodataProperty(last(this._microdataNodes), id, "@type", type || itemtypeAttr);
//         }
//         // RDFa `vocab=""`.
//         if (vocabAttr) {
//             setContext(last(this._rdfaNodes), "@vocab", vocabAttr);
//             this._rdfaVocabs.push(vocabAttr);
//             context.flags = context.flags | exports.HandlerFlags.rdfaVocab;
//         }
//         // RDFa `prefix=""`.
//         if (prefixAttr) {
//             const parts = split(prefixAttr);
//             for (let i = 0; i < parts.length; i += 2) {
//                 const name = parts[i];
//                 const value = parts[i + 1];
//                 const prefix = name.slice(0, -1);
//                 // Detect a valid prefix.
//                 if (!name.endsWith(":") || !isValidName(prefix)) {
//                     continue;
//                 }
//                 setContext(last(this._rdfaNodes), prefix, value);
//             }
//         }
//         // RDFa `rel=""`. Additional care is taken to avoid extranuous output with HTML `rel` attributes.
//         if (relAttr) {
//             const links = this._normalizeRdfaProperty(relAttr);
//             if (links.length) {
//                 this._rdfaRels.push({links, used: false});
//                 context.flags = context.flags | exports.HandlerFlags.rdfaLink;
//             }
//         }
//         // Handle RDFa rel chaining.
//         if (this._rdfaRels.length) {
//             const rel = last(this._rdfaRels);
//             if (rel && !rel.used) {
//                 const validRelId = resourceAttr || hrefAttr || srcAttr;
//                 if (validRelId) {
//                     const newNode = {"@id": validRelId};
//                     rel.used = true;
//                     this._addRdfaProperty(last(this._rdfaNodes), rel.links, newNode);
//                     if (resourceAttr && !(context.flags & exports.HandlerFlags.rdfaNode)) {
//                         this._rdfaNodes.push(newNode);
//                         context.flags = context.flags | exports.HandlerFlags.rdfaNode;
//                     }
//                 }
//                 // Support property chaining with `rel`.
//                 if (!(context.flags & exports.HandlerFlags.rdfaLink) &&
//                     (propertyAttr || typeOfAttr)) {
//                     rel.used = true;
//                     if (!(context.flags & exports.HandlerFlags.rdfaNode)) {
//                         const newNode = {};
//                         this._rdfaNodes.push(newNode);
//                         this._addRdfaProperty(last(this._rdfaNodes), rel.links, newNode);
//                         context.flags = context.flags | exports.HandlerFlags.rdfaNode;
//                     }
//                 }
//             }
//         }
//         // RDFa `about=""`.
//         if (aboutAttr) {
//             this._rdfaNodes.push(this._createRdfaResource(aboutAttr));
//             context.flags = context.flags | exports.HandlerFlags.rdfaNode;
//         }
//         // RDFa `property=""`.
//         if (propertyAttr) {
//             const value = getValueMap(this.options.url, tagName, attributes);
//             const properties = this._normalizeRdfaProperty(propertyAttr);
//             if (value !== undefined) {
//                 this._addRdfaProperty(last(this._rdfaNodes), properties, normalizeJsonLdValue({
//                     "@value": value,
//                     "@language": last(this.langs),
//                     "@type": normalize(attributes["datatype"])
//                 }));
//             } else {
//                 if ((typeOfAttr || resourceAttr) &&
//                     !(context.flags & exports.HandlerFlags.rdfaLink)) {
//                     const newNode = {};
//                     if (resourceAttr) {
//                         newNode["@id"] = resourceAttr;
//                     }
//                     this._addRdfaProperty(last(this._rdfaNodes), properties, newNode);
//                     if (typeOfAttr && !(context.flags & exports.HandlerFlags.rdfaNode)) {
//                         this._rdfaNodes.push(newNode);
//                         context.flags = context.flags | exports.HandlerFlags.rdfaNode;
//                     }
//                 } else {
//                     context.rdfaTextProperty = properties;
//                 }
//             }
//         }
//         // RDFa `resource=""`.
//         if (resourceAttr && !propertyAttr && !relAttr && !aboutAttr) {
//             this._rdfaNodes.push(this._createRdfaResource(resourceAttr));
//             context.flags = context.flags | exports.HandlerFlags.rdfaNode;
//         }
//         // RDFa `typeof=""`.
//         if (typeOfAttr) {
//             // Standalone `typeof` attribute should be treated as a blank resource.
//             if (!this._rdfaRels.length &&
//                 !propertyAttr &&
//                 !relAttr &&
//                 !resourceAttr &&
//                 !aboutAttr) {
//                 this._rdfaNodes.push(this._createRdfaResource());
//                 context.flags = context.flags | exports.HandlerFlags.rdfaNode;
//             }
//             this._addRdfaProperty(last(this._rdfaNodes), "@type", split(typeOfAttr));
//         }
//         // Handle meta properties (E.g. HTML, Twitter cards, etc).
//         if (tagName === "meta") {
//             const nameAttr = normalize(attributes["name"]);
//             const contentAttr = normalize(attributes["content"]);
//             // Catch some bad implementations of Twitter metadata.
//             if (propertyAttr && contentAttr) {
//                 if (propertyAttr.startsWith("twitter:")) {
//                     setvalue_1.set(this.result, ["twitter", propertyAttr.substr(8)], contentAttr);
//                 } else if (propertyAttr.startsWith("al:")) {
//                     setvalue_1.set(this.result, ["applinks", propertyAttr.substr(3)], contentAttr);
//                 }
//             }
//             // It's possible someone will do `<meta name="" property="" content="" />`.
//             if (nameAttr && contentAttr) {
//                 const name = nameAttr.toLowerCase();
//                 /**
//                  * - Twitter
//                  * - Dublin Core
//                  * - Sailthru
//                  * - HTML
//                  */
//                 if (name.startsWith("twitter:")) {
//                     setvalue_1.set(this.result, ["twitter", name.substr(8)], contentAttr);
//                 } else if (name.startsWith("dc.")) {
//                     setvalue_1.set(this.result, ["dublincore", name.substr(3)], contentAttr);
//                 } else if (name.startsWith("dcterms.")) {
//                     setvalue_1.set(this.result, ["dublincore", name.substr(8)], contentAttr);
//                 } else if (name.startsWith("sailthru.")) {
//                     setvalue_1.set(this.result, ["sailthru", name.substr(9)], contentAttr);
//                 } else if (name === "date" ||
//                     name === "keywords" ||
//                     name === "author" ||
//                     name === "description" ||
//                     name === "language" ||
//                     name === "generator" ||
//                     name === "creator" ||
//                     name === "publisher" ||
//                     name === "robots" ||
//                     name === "viewport" ||
//                     name === "application-name" ||
//                     name === "apple-mobile-web-app-title") {
//                     setvalue_1.set(this.result, ["html", name], contentAttr);
//                 }
//             }
//         }
//         // Detect external metadata opporunities (E.g. OEmbed).
//         if (tagName === "link") {
//             if (relAttr && hrefAttr) {
//                 const rels = split(relAttr);
//                 for (const rel of rels) {
//                     const typeAttr = normalize(attributes["type"]);
//                     if (rel === "canonical" || rel === "amphtml" || rel === "pingback") {
//                         setvalue_1.set(this.result, ["html", rel], url_1.resolve(this.options.url, hrefAttr));
//                     } else if (rel === "alternate") {
//                         const mediaAttr = normalize(attributes["media"]);
//                         const hreflangAttr = normalize(attributes["hreflang"]);
//                         if (typeAttr || mediaAttr || hreflangAttr) {
//                             appendAndDedupe(this.result.alternate, ["type", "hreflang", "media", "href"], {
//                                 type: typeAttr || "text/html",
//                                 media: mediaAttr,
//                                 hreflang: hreflangAttr,
//                                 title: normalize(attributes["title"]),
//                                 href: url_1.resolve(this.options.url, hrefAttr)
//                             });
//                         }
//                     } else if (rel === "meta") {
//                         appendAndDedupe(this.result.alternate, ["type"], {
//                             type: typeAttr || "application/rdf+xml",
//                             href: url_1.resolve(this.options.url, hrefAttr)
//                         });
//                     } else if (rel === "icon" ||
//                         rel === "apple-touch-icon" ||
//                         rel === "apple-touch-icon-precomposed") {
//                         appendAndDedupe(this.result.icons, ["href"], {
//                             type: typeAttr,
//                             sizes: normalize(attributes["sizes"]),
//                             href: url_1.resolve(this.options.url, hrefAttr)
//                         });
//                     }
//                 }
//             }
//         }
//     }
//
//     ontext(value) {
//         const currentContext = last(this.contexts);
//         if (currentContext)
//             currentContext.text += value;
//     }
//
//     onclosetag() {
//         const prevContext = this.contexts.pop();
//         const currentContext = last(this.contexts);
//         if (!prevContext || !currentContext)
//             return;
//         const text = normalize(prevContext.text);
//         if (prevContext.flags) {
//             // This context created a new node.
//             if (prevContext.flags & exports.HandlerFlags.microdataNode) {
//                 this._microdataNodes.pop();
//             }
//             // This context used a new vocabulary.
//             if (prevContext.flags & exports.HandlerFlags.microdataVocab) {
//                 const vocabs = last(this._microdataScopes);
//                 if (vocabs)
//                     vocabs.pop();
//             }
//             // This context created a new scope altogether.
//             if (prevContext.flags & exports.HandlerFlags.microdataScope) {
//                 this._microdataScopes.pop();
//             }
//             // This context created a new node.
//             if (prevContext.flags & exports.HandlerFlags.rdfaNode) {
//                 this._rdfaNodes.pop();
//             }
//             // This context used a vocabulary.
//             if (prevContext.flags & exports.HandlerFlags.rdfaVocab) {
//                 this._rdfaVocabs.pop();
//             }
//             // This context used an RDFa link (E.g. `rel=""`).
//             if (prevContext.flags & exports.HandlerFlags.rdfaLink) {
//                 this._rdfaRels.pop();
//             }
//             // This context used language property (E.g. `lang=""`).
//             if (prevContext.flags & exports.HandlerFlags.hasLang) {
//                 this.langs.pop();
//             }
//         }
//         // Handle parsing significant script elements.
//         if (prevContext.tagName === "script") {
//             const type = normalize(prevContext.attributes["type"]);
//             if (type === "application/ld+json") {
//                 try {
//                     const jsonld = JSON.parse(prevContext.text);
//                     this.result.jsonld = merge(this.result.jsonld, jsonld);
//                 } catch (e) {
//                     /* Ignore. */
//                 }
//             }
//             return;
//         }
//         if (prevContext.tagName === "a") {
//             const text = normalize(prevContext.text);
//             const href = normalize(prevContext.attributes["href"]);
//             if (text && href) {
//                 const download = prevContext.attributes.hasOwnProperty("download");
//                 const target = normalize(prevContext.attributes["target"]);
//                 const hreflang = normalize(prevContext.attributes["hreflang"]);
//                 const type = normalize(prevContext.attributes["type"]);
//                 const rel = normalize(prevContext.attributes["rel"]);
//                 this.result.links.push({
//                     href: url_1.resolve(this.options.url, href),
//                     text,
//                     download,
//                     target,
//                     hreflang,
//                     type,
//                     rel
//                 });
//             }
//         }
//         if (prevContext.tagName === "img") {
//             const src = normalize(prevContext.attributes["src"]);
//             if (src) {
//                 const alt = normalize(prevContext.attributes["alt"]);
//                 const longdesc = normalize(prevContext.attributes["longdesc"]);
//                 const sizes = normalize(prevContext.attributes["sizes"]);
//                 const srcset = normalize(prevContext.attributes["srcset"]);
//                 this.result.images.push({
//                     src,
//                     alt,
//                     longdesc,
//                     sizes: typeof sizes === "string" ? sizes.split(/\s*,\s*/) : undefined,
//                     srcset: typeof srcset === "string" ? srcset.split(/\s*,\s*/) : undefined
//                 });
//             }
//         }
//         // Push the previous context text onto the current context.
//         currentContext.text += prevContext.text;
//         if (text) {
//             // Set RDFa to text value.
//             if (prevContext.rdfaTextProperty) {
//                 this._addRdfaProperty(last(this._rdfaNodes), prevContext.rdfaTextProperty, normalizeJsonLdValue({
//                     "@value": text,
//                     "@language": last(this.langs)
//                 }));
//             }
//             // Set microdata to text value.
//             if (prevContext.microdataTextProperty) {
//                 this._addMicrodataProperty(last(this._microdataNodes), normalize(prevContext.attributes["id"]), prevContext.microdataTextProperty, normalizeJsonLdValue({
//                     "@value": text,
//                     "@language": last(this.langs)
//                 }));
//             }
//             if (prevContext.tagName === "title" &&
//                 (currentContext.tagName === "head" || currentContext.tagName === "html")) {
//                 setvalue_1.set(this.result, ["html", "title"], text);
//             }
//         }
//     }
//
//     /**
//      * Add a microdata property, with support for `id` references (used via `itemref`).
//      */
//     _addMicrodataProperty(node, id, itemprop, value) {
//         addJsonldProperty(node, itemprop, value);
//         if (id && this._microdataRefs.hasOwnProperty(id)) {
//             addJsonldProperty(this._microdataRefs[id], itemprop, value);
//         }
//         if (!this.result.microdata) {
//             this.result.microdata = [node];
//         }
//     }
//
//     /**
//      * Set a microdata property.
//      */
//     _setMicrodataProperty(node, id, key, value) {
//         node[key] = value;
//         if (id && this._microdataRefs.hasOwnProperty(id)) {
//             this._microdataRefs[id][key] = value;
//         }
//     }
//
//     /**
//      * Add an RDFa property to the node.
//      */
//     _addRdfaProperty(node, property, value) {
//         addJsonldProperty(node, property, value);
//         if (!this.result.rdfa) {
//             this.result.rdfa = [node];
//         }
//     }
//
//     /**
//      * Correct known prefixes in the context.
//      */
//     _normalizeRdfaProperty(propertyList) {
//         const properties = [];
//         for (const property of split(propertyList)) {
//             const prefix = getPrefix(property);
//             if (prefix) {
//                 const node = last(this._rdfaNodes);
//                 if (!node.hasOwnProperty("@context") ||
//                     !node["@context"].hasOwnProperty(prefix)) {
//                     if (exports.KNOWN_VOCABULARIES.hasOwnProperty(prefix)) {
//                         setContext(node, prefix, exports.KNOWN_VOCABULARIES[prefix]);
//                     }
//                 }
//             } else {
//                 if (this._rdfaVocabs.length === 0) {
//                     continue; // Omit relative properties when no vocabulary is used.
//                 }
//             }
//             properties.push(property);
//         }
//         return properties;
//     }
//
//     /**
//      * Create an RDFa resource.
//      */
//     _createRdfaResource(id) {
//         for (const item of this._rdfaNodes) {
//             if (item["@id"] === id) {
//                 return item;
//             }
//         }
//         const node = {};
//         if (id)
//             node["@id"] = id;
//         this.result.rdfa = merge(this.result.rdfa, node);
//         return node;
//     }
// }
//
// exports.Handler = Handler;
//
// /**
//  * Set a value to the node context.
//  */
// function setContext(node, key, value) {
//     node["@context"] = node["@context"] || {};
//     node["@context"][key] = value;
// }
//
// /**
//  * Normalize a HTML value, trimming and removing whitespace.
//  */
// function normalize(value) {
//     return value === undefined ? undefined : value.trim().replace(/\s+/g, " ");
// }
//
// /**
//  * Set an object property.
//  */
// function addJsonldProperty(obj, key, value) {
//     // Skip empty keys.
//     if (!key) {
//         return;
//     }
//     if (Array.isArray(key)) {
//         for (const k of key) {
//             addJsonldProperty(obj, k, value);
//         }
//     } else {
//         obj[key] = merge(obj[key], value);
//     }
// }
//
// /**
//  * Merge properties together using regular "set" algorithm.
//  */
// function assignJsonldProperties(obj, values) {
//     for (const key of Object.keys(values)) {
//         addJsonldProperty(obj, key, values[key]);
//     }
// }
//
// /**
//  * Get the last element in a stack.
//  */
// function last(arr) {
//     return arr[arr.length - 1];
// }
//
// /**
//  * Grab the semantic value from HTML.
//  */
// function getValueMap(url, tagName, attributes) {
//     const value = normalize(attributes.content);
//     if (!value && exports.HTML_VALUE_MAP.hasOwnProperty(tagName)) {
//         return normalize(exports.HTML_VALUE_MAP[tagName](attributes, url));
//     }
//     return value;
// }
//
// /**
//  * Merge values together.
//  */
// function merge(left, right) {
//     return (Array.isArray(left) ? left : left === undefined ? [] : [left]).concat(right);
// }
//
// /**
//  * Check if a prefix is valid.
//  */
// function isValidName(value) {
//     return (value.length > 1 &&
//         RDF_NAME_START_CHAR_REGEXP.test(value.charAt(0)) &&
//         RDF_NAME_CHAR_REGEXP.test(value.substr(1)));
// }
//
// /**
//  * Extract the prefix from compact IRIs.
//  */
// function getPrefix(value) {
//     const indexOf = value.indexOf(":");
//     if (indexOf === -1) {
//         return;
//     }
//     if (value.charAt(indexOf + 1) === "/" && value.charAt(indexOf + 2) === "/") {
//         return;
//     }
//     return value.substr(0, indexOf);
// }
//
// /**
//  * Split a space-separated string.
//  */
// function split(value) {
//     return value.split(/\s+/g);
// }
//
// /**
//  * Split an `itemtype` microdata property for `@vocab`.
//  */
// function splitItemtype(value) {
//     const hashIndexOf = value.lastIndexOf("#");
//     const slashIndexOf = value.lastIndexOf("/");
//     if (hashIndexOf > -1) {
//         return [value.substr(0, hashIndexOf + 1), value.substr(hashIndexOf + 1)];
//     }
//     if (slashIndexOf > -1) {
//         return [value.substr(0, slashIndexOf + 1), value.substr(slashIndexOf + 1)];
//     }
//     return [value, ""];
// }
//
// /**
//  * Simplify a JSON-LD value for putting into the graph.
//  */
// function normalizeJsonLdValue(value) {
//     if (value["@type"] || value["@language"]) {
//         const result = {
//             "@value": value["@value"]
//         };
//         if (value["@type"]) {
//             result["@type"] = value["@type"];
//         } else if (value["@language"]) {
//             result["@language"] = value["@language"];
//         }
//         return result;
//     }
//     return value["@value"];
// }
//
// /**
//  * Copy properties from `a` to `b`, when "defined".
//  */
// function copy(a, b) {
//     for (const prop of Object.keys(b)) {
//         if (b[prop] !== undefined) {
//             a[prop] = b[prop];
//         }
//     }
// }
//
// exports.copy = copy;
//
// /**
//  * Append/merge a href entry to a list.
//  */
// function appendAndDedupe(list, props, value) {
//     for (const entry of list) {
//         const matches = props.every(x => entry[x] === value[x]);
//         if (matches) {
//             copy(entry, value);
//             return;
//         }
//     }
//     list.push(value);
// }