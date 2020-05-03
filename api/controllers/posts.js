const https = require('https');
var _ = require("underscore");
const url = process.env.URL || 'https://jsonplaceholder.typicode.com/'; // host url
const get_posts_path = 'posts';
const get_comments_path = 'comments';

let fetch_posts_get_all = () => {
  return new Promise((res, error) => {
    https.get(url + get_posts_path, (response) => {
      var posts = '';
      response.on('data', (chunk) => {
        posts += chunk;
      })
      response.on('end', () => {
        process.stdout.write(posts);

        if (JSON.parse(posts)) { // json parse success of the data returned
          res(posts)
        }
        else {
          error("Error")
        }
      })
    }).on('error', (e) => {
      error("Error")
    });
  })
};


let fetch_posts_comments = () => {
  return new Promise((res, error) => {
    https.get(url + get_comments_path, (response) => {
      var posts = '';
      response.on('data', (chunk) => {
        posts += chunk;
      })

      response.on('end', () => {
        process.stdout.write(posts);
        if (JSON.parse(posts)) { // json parse success of the data returned
          res(posts)
        }
        else {
          error("Error")
        }
      })
    }).on('error', (e) => {
      error("Error")
    });
  });
};

let filter_posts = async (req, res, next) => { // this func can be added as a param to the fetch_posts_get_all()
  try {
    let results = await fetch_posts_get_all();
    results=JSON.parse(results);
    let filters= req.body; // filters - there could be a model loaded to ensure only allowable filters are let
    results = _.where(results, filters); //apply the filters
      return res.status(200).json({
      filtered_posts:results
    });
  } catch (err) {
    res.status(201).json({
      err: err
    });
  }
};

let top_posts = async (req, res, next) => {
  var [comments,posts] = await Promise.all([fetch_posts_comments(),fetch_posts_get_all()]);
    posts = JSON.parse(posts).filter(function(post){
      JSON.parse(comments).filter(function(comment){
        if(comment.postId == post.id){
          post["total_number_of_comments"] ? post["total_number_of_comments"]++ : (post["total_number_of_comments"] = 1)
        }
        return true;
      })
      return true;
    });
    posts= posts.sort((a, b) => (a.total_number_of_comments > b.total_number_of_comments) ? 1 : -1); // sort by count desc

  return res.status(201).json({
    top_posts: posts,
    // data2 : JSON.parse(val2)
  });
}
module.exports = {
  top_posts: top_posts,
  filter_posts:filter_posts
};
