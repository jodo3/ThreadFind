const checkComment = (snippet, user) => {
  user = user ?? snippet.channelId;
  const name = snippet.authorDisplayName;
  const checks = [name, name.substring(1), snippet.authorChannelId.value];
  
  for (const check of checks) {
    if (check == user) return true;
  }
  return false;
}

function parseISOString(s) {
  var b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

function parseDates(threads) {  
  threads.forEach((thread) => {
    const parent = thread.snippet.topLevelComment.snippet;
    parent.publishedAt = parseISOString(parent.publishedAt);
    parent.updatedAt = parseISOString(parent.updatedAt);

    if (Object.hasOwn(thread, 'replies')) {
      thread.replies.comments.forEach(comment => {
        const child = comment.snippet;
        child.publishedAt = parseISOString(child.publishedAt);
        child.updatedAt = parseISOString(child.updatedAt);
      });
    }
  });
}

export function channelFilter(commentList, user) {

  let filteredItems = [];
  commentList.forEach(thread => {
    let parSnippet = thread.snippet.topLevelComment.snippet;
    if (checkComment(parSnippet, user)) {
      filteredItems.push(thread);
    }
    else if (Object.hasOwn(thread, 'replies')) {
      for (const reply of thread.replies.comments) {
        if (checkComment(reply.snippet, user)) {
          filteredItems.push(thread);
          break;
        }
      }
    }
  });

  parseDates(filteredItems);

  return filteredItems;
}
