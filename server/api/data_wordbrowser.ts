import type { IncomingMessage, ServerResponse } from 'http'
import {
  useCookies,
  useQuery,
  useBody,
  setCookie,
  appendHeader
} from 'h3'
import { MongoClient } from 'mongodb'

export default async (req: IncomingMessage, res: ServerResponse) => {
	// Read cookies
  //const cookies = useCookies(req);

  // Set a cookie
  //setCookie(res, 'name', 'value');

  // Read query params
  //const query = useQuery(req);

  // Read body from post
  
	// Append header;
  appendHeader(res, 'content-type', 'text/json;charset=UTF-8');
   
  const body = await useBody(req);
  const query = (body.query) ? { word: new RegExp('^' + body.query) } : { word: new RegExp('^a') };
  //var page = (!isNaN(parseInt(body.page)))? body.page : 1;
  
  const uri = "mongodb+srv://kevin:qazWSXedcRFV@cluster0.cvv6u.mongodb.net?retryWrites=true&writeConcern=majority";
  //const uri = 'mongodb://adm518:1qazWSX3edcRFV@soicsrv03.soic.org.tw:6603/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false';
  const client = new MongoClient(uri, { enableUtf8Validation: false });
  await client.connect();
  const database = client.db("Demo");
  const collect = database.collection(" e4f_word");
  
  
  const words = await collect
          .find(query)
          .project({ "_length": { $strLenCP: "$word" }, "_sort": { $toLower: "$word" }, _id: 1,  word: 1, prss:1 , subs: 1, dictionary: 1 })
          .sort({ word_length: 1, word_sort: 1})
		  .limit(10)
          .toArray();
       
  await client.close();  
  
  words.sort((a, b) => (a._length > b._length) ? 1 : -1);
  return words;
  /*
  
  const MaxPage = parseInt(Math.floor(words.length / 10)) + 1;
  page = page > MaxPage ? MaxPage : page;
  var result = [];
  for(var i = 0; i < words.length; i++) {
    if( page === Math.floor( i / 10 ) + 1 )
      result.push(JSON.parse(JSON.stringify(words[i])));
  }
  
  result.sort((a, b) => (a._length > b._length) ? 1 : -1);

  return result;
  */
}