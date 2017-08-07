(function() {
  const scrollTo = (targetHeader) => {
    const textareaId = '#post_body_md';
    const $textarea = $( textareaId );

    const text = $textarea.text();
    const markdownHeader = `# ${targetHeader}`;
    const pos = text.indexOf(markdownHeader) + markdownHeader.length;
    $textarea.caret('pos', pos);

    const scrollTo = $textarea.caret('position').top;
    $textarea.scrollTop(scrollTo);
    $textarea.focus();
  };

  const markerQuery = () => {
    return "here";
  };

  const navigatedToEditPageFn = (query) => {
    return () => {
      const encoded = encodeURIComponent(query);
      const navigatedTo = `${location.href}/edit?${markerQuery()}=${encoded}`;
      location.assign( navigatedTo );
    };
  };

  const posts = () => {
    const $headers = $( '.post-body h1, .post-body h2, .post-body h3');

    $headers.each((_, header) => {
      // TODO: packaging fontawesome by oneself.
      const $editIcon = $('<i class="fa fa-pencil fa-fw" style="cursor:pointer;" />');
      const query = header.innerText;
      $editIcon.on('click', navigatedToEditPageFn(query));
      $(header).append($editIcon);
    });
  };

  const main = () => {
    // TODO: need to strictly check for markerQuery.
    if ( location.href.indexOf("edit") !== -1 && location.search.indexOf(markerQuery()) !== -1) {
      // https://*.esa.io/post/xxx/edit
      // TODO: fetch the target string from background js.
      const qs = decodeURIComponent(location.search.substring(1));
      const queries = qs.split('&').map((query) => {
        const [key, value] = query.split('=');
        return { key, value };
      });

      const hash = queries.find((queryHash) => {
        return queryHash["key"] === markerQuery();
      });

      if (hash && hash["value"]) {
        scrollTo(hash["value"]);
      }
    } else {
      // https://*.esa.io/post/xxx
      posts();
    }
  };

  main();
}());
