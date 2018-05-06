app.service("NewsService", function($http, PostService) {
  this.getNews = function(keyword) {
    var url =
      "https://newsapi.org/v2/everything?" +
      "q=" +
      keyword +
      "&" +
      //   "from=2018-05-06&" +
      "language=en&" +
      "sortBy=popularity&" +
      "apiKey=76d42ce9336a4bed83377dc0e78221b1";

    return $http.get(url).then(responce => {
      console.log(responce.data);
      var article = responce.data.articles[0];
      console.log(article);
      console.log(new PostLikeNews(article));
      return new PostLikeNews(article)
    });
    function PostLikeNews(article) {
      PostService.Post.call(this, 0, article.description, article.urlToImage);
      this.date = article.publishedAt;
      this.owner={
          name:article.author + " for "+article.source.name,
          photoUrl:"https://cdn3.iconfinder.com/data/icons/communication-mass-media-news/512/world_news-512.png"
      }
    }
    PostLikeNews.prototype = Object.create(PostService.Post.prototype, {
      constructor: {
        configurable: true,
        enumerable: true,
        value: PostLikeNews,
        writable: true
      }
    });
    PostLikeNews.prototype.loadOwnerInfo=function(){}
  };
});
