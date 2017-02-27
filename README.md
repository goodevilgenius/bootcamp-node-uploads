# Handling file uploads in node.js

This is a very simple example of handling file uploads using `node`. For my example, I used a basic `<input type="file">`, and no AJAX.

The key part of this is the [`multer`](https://github.com/expressjs/multer) middleware. `multer` allows us to handle a form with `enctype="multipart/form-data"`, which is usually required when uploading files with an HTML form.

Most of the relevant code is in [our server file](server.js). All relevant code is commented, so that it can be understood in context.

In this example, I copied the files to the `/public` folder. You may want to find some other solution if using heroku, such as uploading to a CDN. I've found that files kept in `/public` won't persist between builds on heroku, so that every time you `git push heroku master`, you'll lose all of your uploaded files.
