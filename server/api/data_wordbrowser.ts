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
   
  const body = useBody(req);
  const query = (body.query)?body.query:{};
  const options = (body.options)?body.options:{};
  
  const uri = "mongodb+srv://kevin:qazWSXedcRFV@cluster0.cvv6u.mongodb.net?retryWrites=true&writeConcern=majority";
  //const uri = 'mongodb://adm518:1qazWSX3edcRFV@soicsrv03.soic.org.tw:6603/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false';
  const client = new MongoClient(uri, { enableUtf8Validation: false });
  await client.connect();
  const database = client.db("Demo");
  const words = database.collection(" e4f_word");
  
  
  const w = await words.find(query, options).project({_id: 1,  "word_length": { $strLenCP: "$word" }, "word_sort": { $toLower: "$word" }, word: 1, prss:1 , subs: 1, dictionary: 1 }).limit(10).sort({word_sort: 1}).toArray();
  
  res.statusCode = 200;
  res.end(JSON.stringify(w));
	
  await client.close();
  return w;
}