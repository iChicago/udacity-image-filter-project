import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

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
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

    // Filter image endpoint
  // used to filter image from url and save it.
  app.get( "/filteredimage", async ( req, res ) => {

    // 1. Validate the image_url query
    const imageUrl = req.query.image_url;
    if (!imageUrl) {
      return res.status(400).send(`Image url is required`);
    }

    // 2. Filter the image
    await filterImageFromURL(imageUrl as string).then(
    (filteredpath) => {
      // 3. send the resulting file in the response
      return res.sendFile(filteredpath, () => {
        // 4. deletes any files on the server on finish of the response
        deleteLocalFiles([filteredpath]);
      });
    },
    // catch errors in the process of filtering the image.
    (error) => {
      console.log(error);
      return res.status(500).send(`Error has happened while filtering the image`);
    });

  } );

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();