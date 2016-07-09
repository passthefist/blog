(function() {
    this.Http = function() {
        this.get = function(url, onCompleteCb) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function()
            {
                if (xhr.readyState == 4 && xhr.status == 200)
                {
                    onCompleteCb(JSON.parse(xhr.responseText));
                }
            };

            xhr.open("GET", url);
            xhr.send();
        }
    }
}).apply(window);

(function() {
    this.Blog = function() {
        var key = '8086d62266ceb885af4862ed5ff1387f5293c36d';
        var http = new Http();

        var api = function(endpoint) {
            return 'https://rdgoetz:'+key+'@/'+endpoint;
        }

        this.posts = function(year,callback) {
            http.get(api('repos/rdgoetz/blog/contents/blog/posts/'+year),function(response) {
                var posts = [];

                for(var i in response) {
                    var post = response[i];
                    var name = post.name;
                    var meta = post.name.split('|');

                    posts.push({
                        file: name,
                        date: meta[0],
                        title: meta[1]
                    });
                }

                callback(posts);
            });
        }
    }
}).apply(window);
