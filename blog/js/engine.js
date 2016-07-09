(function() {
    this.Blog = function(ready) {
        var key = '8086d62266ceb885af4862ed5ff1387f5293c36d';

        var api = function(endpoint) {
            return 'https://rdgoetz:'+key+'@api.github.com/'+endpoint;
        }

        var templates = {};

        $.ajax('https://raw.githubusercontent.com/rdgoetz/blog/gh-pages/blog/templates/post.html', {
            crossDomain: true,
            mimeType:'text/plain'
        }).done((function(response) {
            templates.post = response;
            ready.call(this,this);
        }).bind(this)).fail(function(){
            console.log(arguments)
        });

        this.posts = function(year,callback) {
            $.ajax(api('repos/rdgoetz/blog/contents/blog/posts/'+year), {
                dataType: 'jsonp',
                jsonp:'callback',
                crossDomain: true
            }).done(function(response) {
                var posts = [];

                for(var i in response.data) {
                    var post = response.data[i];
                    var name = post.name;
                    var meta = post.name.split('-');

                    var dates = meta[0].split(',')
                    var month = dates[0];
                    var day = dates[1];
                    var title = meta[1];

                    //apparently months are zero indexed
                    var timestamp = new Date(year,month-1,day);
                    var dateFormat = { year: 'numeric', month:'long',  day: 'numeric'};

                    posts.push({
                        file: year+'/'+name,
                        timestamp: timestamp.getTime(),
                        date: timestamp.toLocaleDateString('en-us',dateFormat),
                        title: title
                    });
                }

                posts.sort(function(a,b){
                    if (a.timestamp < b.timestamp) {
                        return 1;
                    }

                    if (a.timestamp > b.timestamp) {
                        return -1;
                    }

                    return 0;
                });

                callback(posts);
            }).fail(function(){
                console.log(arguments)
            });
        }

        this.postContent = function(post,callback) {
            $.ajax('https://raw.githubusercontent.com/rdgoetz/blog/gh-pages/blog/posts/'+post.file, {
                crossDomain: true,
                mimeType:'text/plain'
            }).done(function(response) {
                callback(marked(response));
            }).fail(function(){
                console.log(arguments)
            });
        }

        this.renderPost = function(post, callback) {
            this.postContent(post, function(content) {
                $template = $(templates.post);
                $template.find('[data-post-title]').html(post.title);
                $template.find('[data-post-date]').html(post.date);
                $template.find('[data-post-content]').html(content);

                callback($template);
            });
        }
    }
}).apply(window);
