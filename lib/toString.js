'use strict';

var implicit = '<implicit>';

function recurse(ast) {

  let result = '';

  if (!ast) {
    return result;
  }

  if (ast.start != null) {
    result += (ast.parenthesized ? '(' : '') + ast.start + ' ';
  }

  if (ast.field && ast.field !== implicit) {
    result += ast.field + ':';
  }

  if (ast.left) {
    if (ast.parenthesized && !ast.start) {
      result += '(';
    }
    result += recurse(ast.left);

    if (ast.parenthesized && !ast.right) {
      result += ')';
    }
  }

  if (ast.operator) {
    if (ast.left) {
      result += ' ';
    }

    if (ast.operator !== implicit) {
      result += ast.operator;
    }
  }

  if (ast.right) {
    if (ast.operator && ast.operator !== implicit) {
      result += ' ';
    }
    result += recurse(ast.right);

    if (ast.parenthesized) {
      result += ')';
    }
  }

  if (ast.term || (ast.term === '' && (ast.quoted || ast.regex))) {
    if (ast.prefix) {
      result += ast.prefix;
    }
    if (ast.quoted) {
      result += '"';
      result += ast.term;
      result += '"';
    } else if (ast.regex) {
      result += '/';
      result += ast.term;
      result += '/';
    } else {
      result += ast.term;
    }

    if (ast.proximity != null) {
      result += '~' + ast.proximity;
    }

    if (ast.boost != null) {
      result += '^' + ast.boost;
    }
  }

  if (ast.term_min) {
    if (ast.inclusive === 'both' || ast.inclusive === 'left') {
      result += '[';
    } else {
      result += '{';
    }

    result += ast.term_min;
    result += ' TO ';
    result += ast.term_max;

    if (ast.inclusive === 'both' || ast.inclusive === 'right') {
      result += ']';
    } else {
      result += '}';
    }
  }

  if (ast.similarity) {
    result += '~';

    if (ast.similarity !== 0.5) {
      result += ast.similarity;
    }
  }

  return result;
}

function findParser(ast) {

  if(!ast) {
    return '';
  }

  if(ast.parser) {
    return ast.parser;
  } else if(ast.right) {
    return findParser(ast.right);
  } else if(ast.left) {
    return findParser(ast.left);
  }
}

module.exports = function toString(ast) {

  let resultString = '';
  const parser = findParser(ast);
  const qs = recurse(ast);

  if(parser) {
    resultString += '{!' + parser + '}';
  }

  resultString += qs;

  return resultString;
};
