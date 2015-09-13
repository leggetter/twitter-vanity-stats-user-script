// ==UserScript==
// @name         Twitter Vanity Stats
// @namespace    https://github.com/leggetter/twitter-vanity-stats-user-script
// @version      0.1
// @description  Provides some basic Twitter stats based on time you joined twitter, followers, following and tweets.
// @author       Phil Leggetter (@leggetter)
// @match        https://twitter.com/*
// @grant        none
// ==/UserScript==

function collectStats() {
    var joined = new Date(jQuery('.ProfileHeaderCard-joinDateText').text());
    var now = new Date();

    function daydiff(first, second) {
        return parseInt((second-first)/(1000*60*60*24), 10);
    }

    var daysOnTwitter = daydiff(joined, now);

    var tweetCount = parseInt(jQuery('.ProfileNav-item--tweets .ProfileNav-stat[data-nav=tweets]').attr('title').replace(',', ''), 10);

    var followerCount = parseInt(jQuery('.ProfileNav-item--followers .ProfileNav-stat').attr('title').replace(',', ''), 10);

    var followingCount = parseInt(jQuery('.ProfileNav-item--following .ProfileNav-stat').attr('title').replace(',', ''), 10);

    var followersPerDay = (followerCount/daysOnTwitter);
    var followersPerTweet = (followerCount/tweetCount);
    var followerRatio = (followerCount/followingCount);
    
    return {
        tweetCount: tweetCount,
        daysOnTwitter: daysOnTwitter,
        followerCount: followerCount,
        followingCount: followingCount,
        followersPerDay: followersPerDay,
        followersPerTweet: followersPerTweet,
        followerRatio: followerRatio
    };
}

function createResultText(stats) {
  var facts = [];
  facts.push('Days on Twitter: ' + stats.daysOnTwitter);
  facts.push('Number of Tweets: ' + stats.tweetCount);
  facts.push('Followers: ' + stats.followerCount);
  facts.push('Following: ' + stats.followingCount);

  var calcs = [];
  calcs.push('Followers per day: ' + parseFloat(stats.followersPerDay).toFixed(2));
  calcs.push('Followers per tweet: ' + parseFloat(stats.followersPerTweet).toFixed(2));
  calcs.push('Following/Follower ratio: ' + parseFloat(stats.followerRatio).toFixed(2));
  
  var resultText = facts.join('\n') + '\n\n' + calcs.join('\n');
  return resultText;
}

function runReport(e) {
    console.log('collecting stats!!!');
    var stats = collectStats();
    var text = createResultText(stats);
    alert(text);
    return false;
}

function addStatsMenuItem() {
    var ul = jQuery('.ProfileNav-list');
    var li = jQuery('<li class="ProfileNav-item">' +
        '<a class="ProfileNav-stat ProfileNav-stat--link u-borderUserColor u-textCenter js-tooltip js-nav u-textUserColor" data-nav="all_lists" href="#">' +
          '<span class="ProfileNav-label">Stats</span>' +
          '<span class="ProfileNav-value" data-is-compact="false">&hearts;</span>' +
        '</a></li>');
    ul.append(li);
    li.click(runReport);
}

function waitForJQuery() {
    if(!window['jQuery']) {
        setTimeout(waitForJQuery, 500);
    }
    else {
        addStatsMenuItem();
    }
}

window.addEventListener('load', waitForJQuery);