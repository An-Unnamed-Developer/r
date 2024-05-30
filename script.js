
document.addEventListener('DOMContentLoaded', function () {
    const post = document.getElementById("post");
    const bottom = document.getElementById("bottom");
    var loading = true;
    var logoLoaded = false;
    var stylesLoaded = false;
    var pos = 5;
    var index = 1;
    var logo = document.getElementById('logo');
    var d = new Date();
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * 30);
    console.log(d.toUTCString());

    function newLogo() {
        var chance = Math.floor(Math.random()*10);
        if (chance==1) {
            var logo = document.getElementById("logo");
            logo.src = "https://chfd-04-b2-v4wan-168027-cust24.vm15.cable.virginm.net/r/images/rLogoTest.png";
            logo.className = "logo";
            logo.style = "border-radius: 1000px; outline: rgb(32, 32, 32) solid 4px; top: 20%; height: 70%; width: auto;";
        }
    }

    function wait(ms) { // for load throttling testing purposes.
        var start = Date.now(),
            now = start;
        while (now - start < ms) {
          now = Date.now();
        }
    } 

    logo.addEventListener('load', function () {
        logoLoaded = true;
    })

    //while (loading ==true&&logoLoaded==true&&stylesLoaded==true) {
    //    loading=false;
    //    fadeOut(loadingDiv);
    //}

    let loadingDiv = document.getElementById("loadingDiv");
    loadingDiv.style.opacity = "1";
    function fadeOut(element) {
        var opacity = Number(element.style.opacity);
        for (let i = 0; i < 100; i++) {
            opacity = (100 - i) / 100
            loadingDiv.style.opacity = opacity;
            console.log(i, opacity)
        }
        element.outerHTML = "";
    }

    function clearLoadingArtefacts() {
        document.getElementById("loadingDiv").outerHTML = "";
    }


    function renewCookie() {
        document.cookie = "privbetaparticipant=true; expires=" + d.toUTCString() + ";path=/";
    }

    function updateUI() {
        if (navigator.userAgent.match("iOS") || navigator.userAgent.match("Android") || navigator.userAgent.match("iPhone")) {
            var stylesheet = document.createElement("link");
            document.head.appendChild(stylesheet);
            stylesheet.rel = "stylesheet";
            stylesheet.href = "mobile.css";
            stylesheet.addEventListener('load', function () {
                fadeOut(loadingDiv);
            })
        } else {
            var stylesheet = document.createElement("link");
            document.head.appendChild(stylesheet);
            stylesheet.rel = "stylesheet";
            stylesheet.href = "style.css";
            stylesheet.addEventListener('load', function () {
                fadeOut(loadingDiv);
            })
        }
    }

    function refreshPage() {
        var refresh = document.createElement('meta');

        refresh.httpEquiv = "refresh";
        refresh.content = "0";

        document.head.appendChild(refresh);
    }

    function viewUser(user) {
        var userPosts;
        var userContent;
        document.getElementById("logo").style.animation="rotation";
        var userUI = document.createElement("div");
        var correctUser = user.replace("u/", "");
        userUI.style.zIndex = index;
        userUI.className = "userPage";
        bottom.appendChild(userUI);
        var titlebar = document.createElement('div');
        titlebar.className = "titlebar";
        userUI.appendChild(titlebar);
        var icon = document.createElement("img");
        titlebar.appendChild(icon);
        icon.style.width = icon.offsetHeight + "px";
        var username = document.createElement("h1");
        username.style.left = titlebar.offsetWidth / 100 + icon.offsetWidth + 100 + "px";
        titlebar.appendChild(username);
        var closeButton = document.createElement("button");
        closeButton.className = "closeButton";
        userUI.appendChild(closeButton);
        closeButton.innerHTML = "<";
        // wait(1000);
        var http = new XMLHttpRequest();
        http.open("GET", "https://chfd-04-b2-v4wan-168027-cust24.vm15.cable.virginm.net/r/api/v1/viewuser.php?user=" + correctUser, false);
        http.send(null);
        setTimeout(() => updateUserPage(), 100)
        function updateUserPage() {
            userContent = JSON.parse(http.responseText);
            icon.src = userContent.pfp;
            username.innerHTML = userContent.user;
            userPosts = userContent.posts.split(",");
            console.log(userPosts);
            console.log(userPosts.length);
        }
        closeButton.addEventListener('click', function () {
            closeButton.parentElement.outerHTML = "";
            index -= 2;
        })
        closeButton.style.zIndex = index + 1;
        let uPos = 20;
        setTimeout(() => function() {
            for (let i = 0; i < userPosts.length; i++) {
                var http = new XMLHttpRequest();
                var postid = userPosts[i];
                console.log("Finding post: " + postid);
                http.open("GET", "https://chfd-04-b2-v4wan-168027-cust24.vm15.cable.virginm.net/r/api/v1/retrievepost.php?post=" + postid, false);
                setTimeout(() => http.send(null), 100)
                console.log(http.response);
                var postContent = JSON.parse(http.responseText);
                var newPost = document.createElement("div");
                userUI.appendChild(newPost);
                newPost.id = "post" + postid;
                newPost.className = "post";
                newPost.style.top = uPos + "%";
                var newPostTitle = document.createElement("h1");
                newPostTitle.className = "title";
                newPost.appendChild(newPostTitle);
                newPostTitle.innerHTML = "Loading...";
                var newPostData = document.createElement("p");
                newPostData.className = "postdata";
                newPost.appendChild(newPostData);
                newPostData.innerHTML = "Loading...";
                var newPostContent = document.createElement("p");
                newPostContent.className = "content";
                newPost.appendChild(newPostContent);
                newPostContent.innerHTML = "Loading...";
                newPostTitle.innerHTML = postContent.title;
                newPostData.innerHTML = "<a href=\"\" onclick=\"event.preventDefault();\" id=\""+i+"-"+index+"-ulink-" + postContent.author + "\">" + postContent.author + "</a>" + " - <a href=\"\" onclick=\"event.preventDefault();\" id=\""+i+"-"+index+"-clink-" + postContent.community + "\">r/" + postContent.community + "</a>";
                newPostContent.innerHTML = postContent.content;
                document.getElementById(+i+"-"+index+"-clink-" + postContent.community).addEventListener('click', function () {
                    viewCommunity(postContent.community);
                });
                document.getElementById(i+"-"+index+"-ulink-" + postContent.author).addEventListener('click', function () {
                    viewUser(postContent.author);
                }
            );
            uPos += 55;
        }}, 100);
        document.getElementById("logo").style.animation="";
        index += 2;
    }

    function viewPost(postID) {
        index += 2;
    }

    function viewCommunity(communityName) {
        document.getElementById("logo").style.animation="rotation";
        console.log(communityName);
        var communityUI = document.createElement("div");
        communityUI.style.zIndex = index;
        communityUI.className = "communityPage";
        bottom.appendChild(communityUI);
        var http = new XMLHttpRequest();
        http.open("GET", "https://chfd-04-b2-v4wan-168027-cust24.vm15.cable.virginm.net/r/api/v1/viewCommunity.php?community=" + communityName, false);
        http.send(null);
        var communityContent = JSON.parse(http.responseText);
        var banner = document.createElement("div");
        var bannerimg = document.createElement("img");
        bannerimg.src = communityContent.banneruri;
        banner.appendChild(bannerimg);
        communityUI.appendChild(banner);
        console.log("BannerDiv height: " + banner.offsetHeight + "BannerImgHeight: " + bannerimg.offsetHeight);
        bannerimg.style.bottom = banner.offsetHeight / 2 - bannerimg.offsetHeight / 2 + "px";
        banner.className = "banner";
        var titlebar = document.createElement('div');
        titlebar.className = "titlebar";
        communityUI.appendChild(titlebar);
        var icon = document.createElement("img");
        icon.src = communityContent.logouri;
        titlebar.appendChild(icon);
        icon.style.width = icon.offsetHeight + "px";
        var communityName = document.createElement("h1");
        communityName.innerHTML = "r/" + communityContent.name;
        communityName.style.left = titlebar.offsetWidth / 100 + icon.offsetWidth + 25 + "px";
        titlebar.appendChild(communityName);
        var closeButton = document.createElement("button");
        closeButton.className = "closeButton";
        communityUI.appendChild(closeButton);
        closeButton.innerHTML = "<";
        closeButton.addEventListener('click', function () {
            closeButton.parentElement.outerHTML = "";
            index -= 2;
        })
        // findCommunityPosts();
        closeButton.style.zIndex = index + 1;
        index += 2;
        document.getElementById("logo").style.animation="";
    }

    function findNewPost() {
        document.getElementById("logo").style.animation="rotation";
        var http = new XMLHttpRequest();
        var postid = Math.floor(Math.random() * 5);
        console.log("Finding post: " + postid);
        http.open("GET", "https://rcommunity.uk.to/api/v1/getPost.sjs?id=" + postid, false);
        http.send(null);
        console.log(http.response);
        var postContent = JSON.parse(http.responseText)[0];
        var newPost = document.createElement("div");
        bottom.appendChild(newPost);
        newPost.id = "post" + postid;
        newPost.className = "post";
        newPost.style.top = pos + "%";
        var newPostTitle = document.createElement("h1");
        newPostTitle.className = "title";
        newPost.appendChild(newPostTitle);
        newPostTitle.innerHTML = "Loading...";
        var newPostData = document.createElement("p");
        newPostData.className = "postdata";
        newPost.appendChild(newPostData);
        newPostData.innerHTML = "Loading...";
        var newPostContent = document.createElement("p");
        newPostContent.className = "content";
        newPost.appendChild(newPostContent);
        newPostContent.innerHTML = "Loading...";
        newPostTitle.innerHTML = postContent.title;
        newPostData.innerHTML = "<a href=\"\" onclick=\"event.preventDefault();\" id=\"ulink-" + postContent.author + "\">" + postContent.author + "</a>" + " - <a href=\"\" onclick=\"event.preventDefault();\" id=\"clink-" + postContent.community + "\">r/" + postContent.community + "</a>";
        newPostContent.innerHTML = postContent.content;
        document.getElementById("clink-" + postContent.community).addEventListener('click', function () {
            viewCommunity(postContent.community);
        });
        document.getElementById("ulink-" + postContent.author).addEventListener('click', function () {
            viewUser(postContent.author);
        });
        pos += 55;
        document.getElementById("logo").style.animation="";
    }

    function init() {
        var time = (new Date()).getTime()
        console.log(time);
        updateUI();
        findNewPost();
        renewCookie();
        newLogo();
    }

    init()
})
