app.service("NewsService", function(API_URL, $http, PostService,UserService) {
  function PostLikeNews(article) {
    PostService.Post.call(this, 0, article.description, article.urlToImage);
    this.date = article.publishedAt;
    this.isNews = true;
    this.owner = {
      name: article.author,
      site: article.source.name,
      photoUrl:"images/icons/newsIcon2.png"
    };
  }
  PostLikeNews.prototype = Object.create(PostService.Post.prototype, {
    constructor: {
      configurable: true,
      enumerable: true,
      value: PostLikeNews,
      writable: true
    }
  });
  PostLikeNews.prototype.loadOwnerInfo = function() {};
  PostLikeNews.prototype.share = function() {
    
    var userId =localStorage.getItem("loggedUserId")
    this.ownerId=userId
    this.isShared=true
    console.log("sharing");
    console.log(this);
    console.log(userId)
    return $http
      .post(`${API_URL}api/posts`, this)
      .then(res => {
        console.log(res);
        return res.data.id;
      })
      .then(newPostId => {
        console.log("zapisah posta sq chte go dobavq i na " + userId);
        return UserService.addPost(userId, newPostId).then(() => newPostId);
      });
  };
  const NEWS_TOPICS = [
    "Trump",
    "oil",
    "Putin",
    "javascript",
    "angular",
    "tesla",
    "bulgaria",
    "mongodb",
    "giraffes",
    "iphone"
  ];
  this.getFortune = () => $http.get("http://www.yerkee.com/api/fortune");
  this.getNews = function(keyword) {
    if (!keyword) {
      keyword = NEWS_TOPICS[Math.floor(Math.random() * NEWS_TOPICS.length)];
    }
    console.log("loading news for " + keyword);
    var url =
      "https://newsapi.org/v2/everything?" +
      "q=" +
      keyword +
      "&" +
      "from=2018-05-06&" +
      "language=en&" +
      "sortBy=popularity&" +
      "apiKey=76d42ce9336a4bed83377dc0e78221b1";

    return $http.get(url).then(responce => {
      var article = responce.data.articles[0];
      var post = new PostLikeNews(article);
      return post;
    });
  };
});
