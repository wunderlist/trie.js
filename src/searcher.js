(function(T, undefined) {

  'use strict';

  function flatten (node) {

    var refs = [];
    if(!node) {
      return refs;
    }

    var key, ids;
    for (key in node) {
      if (key.length > 1) {
        continue;
      }
      refs = refs.concat(flatten(node[key]));
    }

    if (node.refs instanceof Array) {
      ids = node.refs.map(function(ref) {
        return ref.id;
      });
      refs = refs.concat(ids);
    }

    return refs;
  }

  // Each index should have it's own searcher as well
  T.searcher = function searcher (index) {

    return function (text) {

      if (text === undefined) {
        return [];
      }

      var tokens = index._tokenize(text) || [];
      var references = [];

      tokens.forEach(function (token) {
        // Lookup in the inverted Index
        var node = index._resolve(token);
        // Return a flat array of all matching IDs
        references.push(flatten(node));
      });

      if (references.length) {
        var meta = references;
        references = [];
        meta.forEach(function(arr) {
          arr.forEach(function(id) {
            if(references.indexOf(id) === -1) {
              references.push(id);
            }
          });
        });
      }
      return references;
    };
  };


}).call(null, T);