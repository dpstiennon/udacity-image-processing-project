import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get('/filteredimage', async (req, res) => {
    if(!req.query.image_url) {
      res.status(400).send('must include image_url query parameter')
    }
    const image_url = req.query.image_url
    try {
      const finalUrl = await filterImageFromURL(image_url)
      if (!finalUrl) {
        throw new Error('empty url')
      }
      res.status(200).sendFile(finalUrl)
      await deleteLocalFiles({except_for: finalUrl})
    } catch (e) {
      console.error(e)
      res.status(422).send(`Unable to process image at ${image_url}`)
    }
  })
  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

    /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://127.0.0.1:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
