const router = require('express').Router();
const { Gif, Comment, User } = require('../models/');
const withAuth = require("../utils/auth");

// ROUTE ./home

// Main homepage that the public users and authenticated users can see.
router.get('/', async (req, res) => {

  const gifData = await Gif.findAll();

  const gifs = gifData.map(gif => {
    const gifImage = gif.imageData.toString('base64')
    return gif['imageData'] = gifImage
  });

  // const newGifData = gifData[0];
  res.render('homepage', {
    gifs
  });
  // res.json(newGifData);
})

// create commnets  with a gifId---working!!--localhost:3001/home/comment/2 
router.post("/comment/:gifId",  (req, res) => {

  const gifId =parseInt(req.params.gifId);
  Comment.create({ 
    ...req.body, 
    author: req.session.userId ,
    gif_id: gifId
  })
  .then(newComment => {
    res.json(newComment);
  })
  .catch(err => {
    res.status(500).json(err);
  });
});


// get all comments of  gifs for logged in user localhost:3001/home/comment/2 
router.get('/comments/:gifId',(req,res)=>{
  const gifId =parseInt(req.params.gifId);
  Comment.findAll({
    where: {
      author: req.session.userId ,
      gif_id: gifId
    }
  })
    .then((dbcommentData) => {
      const comments = dbcommentData.map((comment) => comment.get({ plain: true }));
      // console.log(comments)
      if(comments.length > 0){
       // res.status(200).json(comments);   //uncomment for testing
        res.render("all-gifComments", { comments });
      } else {
        res.status(404).json({message:"No comments found!!"});
      }
      
    })
    .catch((err) => {
      res.status(500).json(err);
    });

});

// get all  gifs for logged in user
router.get('/allGifs',(req,res)=>{
  
  Gif.findAll({
    where: {
      author: req.session.userId ,
    }
  })
    .then((dbgifData) => {
      const gifs = dbgifData.map((gif) => gif.get({ plain: true }));
      // console.log(comments)
      if(gifs.length > 0){
       // res.status(200).json(gifs);
        res.render("all-gifs", { gifs });
      } else {
        res.status(404).json({message:"No Gifs found!!"});
      }
      
    })
    .catch((err) => {
      res.status(500).json(err);
    });

});



router.get("/login", (req, res) => {
    if (req.session.loggedIn) {
      res.redirect("/");
      return;
    }
  
    res.render("login");
  });
  
  router.get("/signup", (req, res) => {
    if (req.session.loggedIn) {
      res.redirect("/");
      return;
    }
  
    res.render("signup");
  });
  
  module.exports = router;