(function(scope) {
    scope.http = function() {
        this.get = function(url, onCompleteCb) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function()
            {
                if (xhr.readyState == 4 && xhr.status == 200)
                {
                    onCompleteCb(xhr.responseText);
                }
            };

            xhr.open("GET", url);
            xhr.send();
        }
    }
}).apply(window);
