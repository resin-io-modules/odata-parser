!function(root, factory) {
    "function" == typeof define && define.amd ? define([ "require", "exports", "ometa-core" ], factory) : "object" == typeof exports ? factory(require, exports, require("ometa-js").core) : factory(function(moduleName) {
        return root[moduleName];
    }, root, root.OMeta);
}(this, function(require, exports, OMeta) {
    var methods = {
        cast: [ 1, 2 ],
        ceiling: 1,
        concat: 2,
        contains: 2,
        date: 1,
        day: 1,
        endswith: 2,
        floor: 1,
        fractionalseconds: 1,
        hour: 1,
        indexof: 2,
        isof: [ 1, 2 ],
        length: 1,
        maxdatetime: 0,
        mindatetime: 0,
        minute: 1,
        month: 1,
        now: 0,
        replace: 3,
        round: 1,
        second: 1,
        startswith: 2,
        substringof: 2,
        substring: [ 2, 3 ],
        time: 1,
        tolower: 1,
        totaloffsetminutes: 1,
        totalseconds: 1,
        toupper: 1,
        trim: 1,
        year: 1
    }, ODataParser = exports.ODataParser = OMeta._extend({
        Process: function() {
            var $elf = this, _fromIdx = this.input.idx, tree;
            this.reset();
            tree = this._apply("OData");
            return {
                tree: tree,
                binds: this.binds
            };
        },
        ProcessRule: function() {
            var $elf = this, _fromIdx = this.input.idx, result, rule;
            rule = this.anything();
            this._form(function() {
                return result = this._applyWithArgs("apply", rule);
            });
            this._apply("end");
            return result;
        },
        OData: function() {
            var $elf = this, _fromIdx = this.input.idx, model;
            return this._or(function() {
                model = this._apply("PathSegment");
                this._apply("end");
                return model;
            }, function() {
                switch (this.anything()) {
                  case "/":
                    return this._or(function() {
                        switch (this.anything()) {
                          case "$":
                            this._applyWithArgs("exactly", "m");
                            this._applyWithArgs("exactly", "e");
                            this._applyWithArgs("exactly", "t");
                            this._applyWithArgs("exactly", "a");
                            this._applyWithArgs("exactly", "d");
                            this._applyWithArgs("exactly", "a");
                            this._applyWithArgs("exactly", "t");
                            this._applyWithArgs("exactly", "a");
                            return {
                                resource: "$metadata"
                            };

                          default:
                            throw this._fail();
                        }
                    }, function() {
                        this._apply("end");
                        return {
                            resource: "$serviceroot"
                        };
                    });

                  default:
                    throw this._fail();
                }
            });
        },
        QueryOptions: function() {
            var $elf = this, _fromIdx = this.input.idx, options;
            this._applyWithArgs("exactly", "?");
            options = this._applyWithArgs("listOf", "QueryOption", "&");
            return this._applyWithArgs("ParseOptionsObject", options);
        },
        QueryOption: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._or(function() {
                return this._apply("SortOption");
            }, function() {
                return this._apply("TopOption");
            }, function() {
                return this._apply("SkipOption");
            }, function() {
                return this._apply("ExpandOption");
            }, function() {
                return this._apply("InlineCountOption");
            }, function() {
                return this._apply("CountOption");
            }, function() {
                return this._apply("FilterByOption");
            }, function() {
                return this._apply("FormatOption");
            }, function() {
                return this._apply("SelectOption");
            }, function() {
                return this._apply("OperationParam");
            });
        },
        OperationParam: function() {
            var $elf = this, _fromIdx = this.input.idx, name, value;
            name = this._apply("Text");
            this._applyWithArgs("exactly", "=");
            value = this._apply("Text");
            return {
                name: name,
                value: value
            };
        },
        SortOption: function() {
            var $elf = this, _fromIdx = this.input.idx, properties;
            this._applyWithArgs("RecognisedOption", "orderby");
            properties = this._applyWithArgs("listOf", "SortProperty", ",");
            return {
                name: "$orderby",
                value: {
                    properties: properties
                }
            };
        },
        SortProperty: function() {
            var $elf = this, _fromIdx = this.input.idx, order, property;
            property = this._apply("PropertyPath");
            this._apply("spaces");
            order = this._or(function() {
                switch (this.anything()) {
                  case "a":
                    this._applyWithArgs("exactly", "s");
                    this._applyWithArgs("exactly", "c");
                    return "asc";

                  case "d":
                    this._applyWithArgs("exactly", "e");
                    this._applyWithArgs("exactly", "s");
                    this._applyWithArgs("exactly", "c");
                    return "desc";

                  default:
                    throw this._fail();
                }
            }, function() {
                return "desc";
            });
            property.order = order;
            return property;
        },
        TopOption: function() {
            var $elf = this, _fromIdx = this.input.idx, value;
            this._applyWithArgs("RecognisedOption", "top");
            value = this._apply("UnsignedInteger");
            return {
                name: "$top",
                value: value
            };
        },
        SkipOption: function() {
            var $elf = this, _fromIdx = this.input.idx, value;
            this._applyWithArgs("RecognisedOption", "skip");
            value = this._apply("UnsignedInteger");
            return {
                name: "$skip",
                value: value
            };
        },
        InlineCountOption: function() {
            var $elf = this, _fromIdx = this.input.idx, value;
            this._applyWithArgs("RecognisedOption", "inlinecount");
            value = this._or(function() {
                switch (this.anything()) {
                  case "a":
                    this._applyWithArgs("exactly", "l");
                    this._applyWithArgs("exactly", "l");
                    this._applyWithArgs("exactly", "p");
                    this._applyWithArgs("exactly", "a");
                    this._applyWithArgs("exactly", "g");
                    this._applyWithArgs("exactly", "e");
                    this._applyWithArgs("exactly", "s");
                    return "allpages";

                  case "n":
                    this._applyWithArgs("exactly", "o");
                    this._applyWithArgs("exactly", "n");
                    this._applyWithArgs("exactly", "e");
                    return "none";

                  default:
                    throw this._fail();
                }
            }, function() {
                this._apply("Text");
                return "";
            });
            return {
                name: "$inlinecount",
                value: value
            };
        },
        CountOption: function() {
            var $elf = this, _fromIdx = this.input.idx, value;
            this._applyWithArgs("RecognisedOption", "count");
            value = this._apply("Boolean");
            return {
                name: "$count",
                value: value
            };
        },
        ExpandOption: function() {
            var $elf = this, _fromIdx = this.input.idx, properties;
            this._applyWithArgs("RecognisedOption", "expand");
            properties = this._apply("ExpandPropertyPathList");
            return {
                name: "$expand",
                value: {
                    properties: properties
                }
            };
        },
        SelectOption: function() {
            var $elf = this, _fromIdx = this.input.idx, properties, value;
            this._applyWithArgs("RecognisedOption", "select");
            value = this._or(function() {
                switch (this.anything()) {
                  case "*":
                    return "*";

                  default:
                    throw this._fail();
                }
            }, function() {
                properties = this._apply("PropertyPathList");
                return {
                    properties: properties
                };
            });
            return {
                name: "$select",
                value: value
            };
        },
        FilterByOption: function() {
            var $elf = this, _fromIdx = this.input.idx, expr;
            this._applyWithArgs("RecognisedOption", "filter");
            expr = this._apply("FilterByExpression");
            return {
                name: "$filter",
                value: expr
            };
        },
        FormatOption: function() {
            var $elf = this, _fromIdx = this.input.idx, type;
            this._applyWithArgs("RecognisedOption", "format");
            type = this._apply("ContentType");
            return {
                name: "$format",
                value: type
            };
        },
        RecognisedOption: function(name) {
            var $elf = this, _fromIdx = this.input.idx;
            this._apply("Dollar");
            this._applyWithArgs("seq", name);
            return this._applyWithArgs("exactly", "=");
        },
        FilterByExpression: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._apply("FilterAndExpression");
        },
        FilterAndExpression: function() {
            var $elf = this, _fromIdx = this.input.idx, lhs, op, rhs;
            return this._or(function() {
                lhs = this._apply("FilterAndExpression");
                op = this._apply("FilterAndOperand");
                rhs = this._apply("FilterLogicalExpression");
                return this._or(function() {
                    this._pred(op == lhs[0]);
                    return [ op ].concat(lhs.slice(1), [ rhs ]);
                }, function() {
                    return [ op, lhs, rhs ];
                });
            }, function() {
                return this._apply("FilterLogicalExpression");
            });
        },
        FilterLogicalExpression: function() {
            var $elf = this, _fromIdx = this.input.idx, lhs, op, rhs;
            return this._or(function() {
                lhs = this._apply("FilterLogicalExpression");
                op = this._apply("FilterByOperand");
                rhs = this._apply("FilterSubExpression");
                return [ op, lhs, rhs ];
            }, function() {
                return this._apply("FilterSubExpression");
            });
        },
        FilterSubExpression: function() {
            var $elf = this, _fromIdx = this.input.idx, lhs, op, rhs;
            return this._or(function() {
                lhs = this._apply("FilterSubExpression");
                this._apply("spaces");
                op = this._applyWithArgs("FilterRecognisedMathOperand", "sub");
                this._apply("spaces");
                rhs = this._apply("FilterAddExpression");
                return [ op, lhs, rhs ];
            }, function() {
                return this._apply("FilterAddExpression");
            });
        },
        FilterAddExpression: function() {
            var $elf = this, _fromIdx = this.input.idx, lhs, op, rhs;
            return this._or(function() {
                lhs = this._apply("FilterAddExpression");
                this._apply("spaces");
                op = this._applyWithArgs("FilterRecognisedMathOperand", "add");
                this._apply("spaces");
                rhs = this._apply("FilterModExpression");
                return [ op, lhs, rhs ];
            }, function() {
                return this._apply("FilterModExpression");
            });
        },
        FilterModExpression: function() {
            var $elf = this, _fromIdx = this.input.idx, lhs, op, rhs;
            return this._or(function() {
                lhs = this._apply("FilterModExpression");
                this._apply("spaces");
                op = this._applyWithArgs("FilterRecognisedMathOperand", "mod");
                this._apply("spaces");
                rhs = this._apply("FilterDivExpression");
                return [ op, lhs, rhs ];
            }, function() {
                return this._apply("FilterDivExpression");
            });
        },
        FilterDivExpression: function() {
            var $elf = this, _fromIdx = this.input.idx, lhs, op, rhs;
            return this._or(function() {
                lhs = this._apply("FilterDivExpression");
                this._apply("spaces");
                op = this._applyWithArgs("FilterRecognisedMathOperand", "div");
                this._apply("spaces");
                rhs = this._apply("FilterMulExpression");
                return [ op, lhs, rhs ];
            }, function() {
                return this._apply("FilterMulExpression");
            });
        },
        FilterMulExpression: function() {
            var $elf = this, _fromIdx = this.input.idx, lhs, op, rhs;
            return this._or(function() {
                lhs = this._apply("FilterMulExpression");
                this._apply("spaces");
                op = this._applyWithArgs("FilterRecognisedMathOperand", "mul");
                this._apply("spaces");
                rhs = this._apply("FilterByValue");
                return [ op, lhs, rhs ];
            }, function() {
                return this._apply("FilterByValue");
            });
        },
        FilterByValue: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._or(function() {
                return this._apply("FilterMethodCallExpression");
            }, function() {
                return this._apply("FilterNegateExpression");
            }, function() {
                return this._apply("NumberBind");
            }, function() {
                return this._apply("Null");
            }, function() {
                return this._apply("BooleanBind");
            }, function() {
                return this._apply("QuotedTextBind");
            }, function() {
                return this._apply("DateBind");
            }, function() {
                return this._apply("Duration");
            }, function() {
                return this._apply("LambdaPropertyPath");
            }, function() {
                return this._apply("PropertyPath");
            }, function() {
                return this._apply("GroupedPrecedenceExpression");
            });
        },
        GroupedPrecedenceExpression: function() {
            var $elf = this, _fromIdx = this.input.idx, expr;
            this._applyWithArgs("exactly", "(");
            this._apply("spaces");
            expr = this._apply("FilterByExpression");
            this._apply("spaces");
            this._applyWithArgs("exactly", ")");
            return expr;
        },
        FilterRecognisedMathOperand: function(name) {
            var $elf = this, _fromIdx = this.input.idx;
            return this._applyWithArgs("seq", name);
        },
        FilterAndOperand: function() {
            var $elf = this, _fromIdx = this.input.idx, op;
            this._apply("spaces");
            op = function() {
                switch (this.anything()) {
                  case "a":
                    this._applyWithArgs("exactly", "n");
                    this._applyWithArgs("exactly", "d");
                    return "and";

                  case "o":
                    this._applyWithArgs("exactly", "r");
                    return "or";

                  default:
                    throw this._fail();
                }
            }.call(this);
            this._apply("spaces");
            return op;
        },
        FilterByOperand: function() {
            var $elf = this, _fromIdx = this.input.idx, op;
            this._apply("spaces");
            op = function() {
                switch (this.anything()) {
                  case "e":
                    this._applyWithArgs("exactly", "q");
                    return "eq";

                  case "g":
                    switch (this.anything()) {
                      case "e":
                        return "ge";

                      case "t":
                        return "gt";

                      default:
                        throw this._fail();
                    }

                  case "l":
                    switch (this.anything()) {
                      case "e":
                        return "le";

                      case "t":
                        return "lt";

                      default:
                        throw this._fail();
                    }

                  case "n":
                    this._applyWithArgs("exactly", "e");
                    return "ne";

                  default:
                    throw this._fail();
                }
            }.call(this);
            this._apply("spaces");
            return op;
        },
        FilterNegateExpression: function() {
            var $elf = this, _fromIdx = this.input.idx, expr, value;
            this._apply("spaces");
            this._applyWithArgs("exactly", "n");
            this._applyWithArgs("exactly", "o");
            this._applyWithArgs("exactly", "t");
            this._apply("spaces");
            value = this._or(function() {
                return this._apply("FilterByValue");
            }, function() {
                switch (this.anything()) {
                  case "(":
                    this._apply("spaces");
                    expr = this._apply("FilterByExpression");
                    this._apply("spaces");
                    this._applyWithArgs("exactly", ")");
                    return expr;

                  default:
                    throw this._fail();
                }
            });
            return [ "not", value ];
        },
        FilterMethodCallExpression: function() {
            var $elf = this, _fromIdx = this.input.idx, args, methodName;
            methodName = function() {
                switch (this.anything()) {
                  case "c":
                    switch (this.anything()) {
                      case "a":
                        this._applyWithArgs("exactly", "s");
                        this._applyWithArgs("exactly", "t");
                        return "cast";

                      case "e":
                        this._applyWithArgs("exactly", "i");
                        this._applyWithArgs("exactly", "l");
                        this._applyWithArgs("exactly", "i");
                        this._applyWithArgs("exactly", "n");
                        this._applyWithArgs("exactly", "g");
                        return "ceiling";

                      case "o":
                        switch (this.anything()) {
                          case "n":
                            switch (this.anything()) {
                              case "c":
                                this._applyWithArgs("exactly", "a");
                                this._applyWithArgs("exactly", "t");
                                return "concat";

                              case "t":
                                this._applyWithArgs("exactly", "a");
                                this._applyWithArgs("exactly", "i");
                                this._applyWithArgs("exactly", "n");
                                this._applyWithArgs("exactly", "s");
                                return "contains";

                              default:
                                throw this._fail();
                            }

                          default:
                            throw this._fail();
                        }

                      default:
                        throw this._fail();
                    }

                  case "d":
                    switch (this.anything()) {
                      case "a":
                        switch (this.anything()) {
                          case "t":
                            this._applyWithArgs("exactly", "e");
                            return "date";

                          case "y":
                            return "day";

                          default:
                            throw this._fail();
                        }

                      default:
                        throw this._fail();
                    }

                  case "e":
                    this._applyWithArgs("exactly", "n");
                    this._applyWithArgs("exactly", "d");
                    this._applyWithArgs("exactly", "s");
                    this._applyWithArgs("exactly", "w");
                    this._applyWithArgs("exactly", "i");
                    this._applyWithArgs("exactly", "t");
                    this._applyWithArgs("exactly", "h");
                    return "endswith";

                  case "f":
                    switch (this.anything()) {
                      case "l":
                        this._applyWithArgs("exactly", "o");
                        this._applyWithArgs("exactly", "o");
                        this._applyWithArgs("exactly", "r");
                        return "floor";

                      case "r":
                        this._applyWithArgs("exactly", "a");
                        this._applyWithArgs("exactly", "c");
                        this._applyWithArgs("exactly", "t");
                        this._applyWithArgs("exactly", "i");
                        this._applyWithArgs("exactly", "o");
                        this._applyWithArgs("exactly", "n");
                        this._applyWithArgs("exactly", "a");
                        this._applyWithArgs("exactly", "l");
                        this._applyWithArgs("exactly", "s");
                        this._applyWithArgs("exactly", "e");
                        this._applyWithArgs("exactly", "c");
                        this._applyWithArgs("exactly", "o");
                        this._applyWithArgs("exactly", "n");
                        this._applyWithArgs("exactly", "d");
                        this._applyWithArgs("exactly", "s");
                        return "fractionalseconds";

                      default:
                        throw this._fail();
                    }

                  case "h":
                    this._applyWithArgs("exactly", "o");
                    this._applyWithArgs("exactly", "u");
                    this._applyWithArgs("exactly", "r");
                    return "hour";

                  case "i":
                    switch (this.anything()) {
                      case "n":
                        this._applyWithArgs("exactly", "d");
                        this._applyWithArgs("exactly", "e");
                        this._applyWithArgs("exactly", "x");
                        this._applyWithArgs("exactly", "o");
                        this._applyWithArgs("exactly", "f");
                        return "indexof";

                      case "s":
                        this._applyWithArgs("exactly", "o");
                        this._applyWithArgs("exactly", "f");
                        return "isof";

                      default:
                        throw this._fail();
                    }

                  case "l":
                    this._applyWithArgs("exactly", "e");
                    this._applyWithArgs("exactly", "n");
                    this._applyWithArgs("exactly", "g");
                    this._applyWithArgs("exactly", "t");
                    this._applyWithArgs("exactly", "h");
                    return "length";

                  case "m":
                    switch (this.anything()) {
                      case "a":
                        this._applyWithArgs("exactly", "x");
                        this._applyWithArgs("exactly", "d");
                        this._applyWithArgs("exactly", "a");
                        this._applyWithArgs("exactly", "t");
                        this._applyWithArgs("exactly", "e");
                        this._applyWithArgs("exactly", "t");
                        this._applyWithArgs("exactly", "i");
                        this._applyWithArgs("exactly", "m");
                        this._applyWithArgs("exactly", "e");
                        return "maxdatetime";

                      case "i":
                        switch (this.anything()) {
                          case "n":
                            switch (this.anything()) {
                              case "d":
                                this._applyWithArgs("exactly", "a");
                                this._applyWithArgs("exactly", "t");
                                this._applyWithArgs("exactly", "e");
                                this._applyWithArgs("exactly", "t");
                                this._applyWithArgs("exactly", "i");
                                this._applyWithArgs("exactly", "m");
                                this._applyWithArgs("exactly", "e");
                                return "mindatetime";

                              case "u":
                                this._applyWithArgs("exactly", "t");
                                this._applyWithArgs("exactly", "e");
                                return "minute";

                              default:
                                throw this._fail();
                            }

                          default:
                            throw this._fail();
                        }

                      case "o":
                        this._applyWithArgs("exactly", "n");
                        this._applyWithArgs("exactly", "t");
                        this._applyWithArgs("exactly", "h");
                        return "month";

                      default:
                        throw this._fail();
                    }

                  case "n":
                    this._applyWithArgs("exactly", "o");
                    this._applyWithArgs("exactly", "w");
                    return "now";

                  case "r":
                    switch (this.anything()) {
                      case "e":
                        this._applyWithArgs("exactly", "p");
                        this._applyWithArgs("exactly", "l");
                        this._applyWithArgs("exactly", "a");
                        this._applyWithArgs("exactly", "c");
                        this._applyWithArgs("exactly", "e");
                        return "replace";

                      case "o":
                        this._applyWithArgs("exactly", "u");
                        this._applyWithArgs("exactly", "n");
                        this._applyWithArgs("exactly", "d");
                        return "round";

                      default:
                        throw this._fail();
                    }

                  case "s":
                    switch (this.anything()) {
                      case "e":
                        this._applyWithArgs("exactly", "c");
                        this._applyWithArgs("exactly", "o");
                        this._applyWithArgs("exactly", "n");
                        this._applyWithArgs("exactly", "d");
                        return "second";

                      case "t":
                        this._applyWithArgs("exactly", "a");
                        this._applyWithArgs("exactly", "r");
                        this._applyWithArgs("exactly", "t");
                        this._applyWithArgs("exactly", "s");
                        this._applyWithArgs("exactly", "w");
                        this._applyWithArgs("exactly", "i");
                        this._applyWithArgs("exactly", "t");
                        this._applyWithArgs("exactly", "h");
                        return "startswith";

                      case "u":
                        switch (this.anything()) {
                          case "b":
                            switch (this.anything()) {
                              case "s":
                                switch (this.anything()) {
                                  case "t":
                                    switch (this.anything()) {
                                      case "r":
                                        switch (this.anything()) {
                                          case "i":
                                            switch (this.anything()) {
                                              case "n":
                                                switch (this.anything()) {
                                                  case "g":
                                                    return this._or(function() {
                                                        switch (this.anything()) {
                                                          case "o":
                                                            this._applyWithArgs("exactly", "f");
                                                            return "substringof";

                                                          default:
                                                            throw this._fail();
                                                        }
                                                    }, function() {
                                                        return "substring";
                                                    });

                                                  default:
                                                    throw this._fail();
                                                }

                                              default:
                                                throw this._fail();
                                            }

                                          default:
                                            throw this._fail();
                                        }

                                      default:
                                        throw this._fail();
                                    }

                                  default:
                                    throw this._fail();
                                }

                              default:
                                throw this._fail();
                            }

                          default:
                            throw this._fail();
                        }

                      default:
                        throw this._fail();
                    }

                  case "t":
                    switch (this.anything()) {
                      case "i":
                        this._applyWithArgs("exactly", "m");
                        this._applyWithArgs("exactly", "e");
                        return "time";

                      case "o":
                        switch (this.anything()) {
                          case "l":
                            this._applyWithArgs("exactly", "o");
                            this._applyWithArgs("exactly", "w");
                            this._applyWithArgs("exactly", "e");
                            this._applyWithArgs("exactly", "r");
                            return "tolower";

                          case "t":
                            switch (this.anything()) {
                              case "a":
                                switch (this.anything()) {
                                  case "l":
                                    switch (this.anything()) {
                                      case "o":
                                        this._applyWithArgs("exactly", "f");
                                        this._applyWithArgs("exactly", "f");
                                        this._applyWithArgs("exactly", "s");
                                        this._applyWithArgs("exactly", "e");
                                        this._applyWithArgs("exactly", "t");
                                        this._applyWithArgs("exactly", "m");
                                        this._applyWithArgs("exactly", "i");
                                        this._applyWithArgs("exactly", "n");
                                        this._applyWithArgs("exactly", "u");
                                        this._applyWithArgs("exactly", "t");
                                        this._applyWithArgs("exactly", "e");
                                        this._applyWithArgs("exactly", "s");
                                        return "totaloffsetminutes";

                                      case "s":
                                        this._applyWithArgs("exactly", "e");
                                        this._applyWithArgs("exactly", "c");
                                        this._applyWithArgs("exactly", "o");
                                        this._applyWithArgs("exactly", "n");
                                        this._applyWithArgs("exactly", "d");
                                        this._applyWithArgs("exactly", "s");
                                        return "totalseconds";

                                      default:
                                        throw this._fail();
                                    }

                                  default:
                                    throw this._fail();
                                }

                              default:
                                throw this._fail();
                            }

                          case "u":
                            this._applyWithArgs("exactly", "p");
                            this._applyWithArgs("exactly", "p");
                            this._applyWithArgs("exactly", "e");
                            this._applyWithArgs("exactly", "r");
                            return "toupper";

                          default:
                            throw this._fail();
                        }

                      case "r":
                        this._applyWithArgs("exactly", "i");
                        this._applyWithArgs("exactly", "m");
                        return "trim";

                      default:
                        throw this._fail();
                    }

                  case "y":
                    this._applyWithArgs("exactly", "e");
                    this._applyWithArgs("exactly", "a");
                    this._applyWithArgs("exactly", "r");
                    return "year";

                  default:
                    throw this._fail();
                }
            }.call(this);
            this._applyWithArgs("exactly", "(");
            this._apply("spaces");
            args = this._applyWithArgs("numberOf", "FilterByExpression", methods[methodName], ",");
            this._apply("spaces");
            this._applyWithArgs("exactly", ")");
            return [ "call", {
                args: args,
                method: methodName
            } ];
        },
        LambdaMethodCall: function() {
            var $elf = this, _fromIdx = this.input.idx, expression, identifier, name;
            name = function() {
                switch (this.anything()) {
                  case "a":
                    switch (this.anything()) {
                      case "l":
                        this._applyWithArgs("exactly", "l");
                        return "all";

                      case "n":
                        this._applyWithArgs("exactly", "y");
                        return "any";

                      default:
                        throw this._fail();
                    }

                  default:
                    throw this._fail();
                }
            }.call(this);
            this._applyWithArgs("exactly", "(");
            this._apply("spaces");
            identifier = this._apply("ResourceName");
            this._applyWithArgs("exactly", ":");
            expression = this._apply("FilterByExpression");
            this._apply("spaces");
            this._applyWithArgs("exactly", ")");
            return {
                expression: expression,
                identifier: identifier,
                method: name
            };
        },
        PropertyPathList: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._applyWithArgs("listOf", "PropertyPath", ",");
        },
        PropertyPath: function() {
            var $elf = this, _fromIdx = this.input.idx, next, resource;
            resource = this._apply("ResourceName");
            this._opt(function() {
                this._applyWithArgs("exactly", "/");
                return next = this._apply("PropertyPath");
            });
            return {
                name: resource,
                property: next
            };
        },
        ExpandPropertyPathList: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._applyWithArgs("listOf", "ExpandPropertyPath", ",");
        },
        ExpandPropertyPath: function() {
            var $elf = this, _fromIdx = this.input.idx, count, next, options, optionsObj, resource;
            resource = this._apply("ResourceName");
            count = this._opt(function() {
                this._applyWithArgs("exactly", "/");
                this._applyWithArgs("exactly", "$");
                this._applyWithArgs("exactly", "c");
                this._applyWithArgs("exactly", "o");
                this._applyWithArgs("exactly", "u");
                this._applyWithArgs("exactly", "n");
                this._applyWithArgs("exactly", "t");
                return !0;
            });
            this._opt(function() {
                this._applyWithArgs("exactly", "(");
                options = this._applyWithArgs("listOf", "ExpandPathOption", "&");
                optionsObj = this._applyWithArgs("ParseOptionsObject", options);
                return this._applyWithArgs("exactly", ")");
            });
            this._opt(function() {
                this._applyWithArgs("exactly", "/");
                return next = this._apply("PropertyPath");
            });
            return {
                name: resource,
                property: next,
                count: count,
                options: optionsObj
            };
        },
        ExpandPathOption: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._or(function() {
                return this._apply("SortOption");
            }, function() {
                return this._apply("TopOption");
            }, function() {
                return this._apply("SkipOption");
            }, function() {
                return this._apply("ExpandOption");
            }, function() {
                return this._apply("InlineCountOption");
            }, function() {
                return this._apply("CountOption");
            }, function() {
                return this._apply("FilterByOption");
            }, function() {
                return this._apply("FormatOption");
            }, function() {
                return this._apply("SelectOption");
            }, function() {
                return this._apply("OperationParam");
            });
        },
        LambdaPropertyPath: function() {
            var $elf = this, _fromIdx = this.input.idx, lambda, next, resource;
            resource = this._apply("ResourceName");
            this._applyWithArgs("exactly", "/");
            return this._or(function() {
                next = this._apply("LambdaPropertyPath");
                return {
                    name: resource,
                    property: next
                };
            }, function() {
                lambda = this._apply("LambdaMethodCall");
                return {
                    name: resource,
                    lambda: lambda
                };
            });
        },
        Key: function() {
            var $elf = this, _fromIdx = this.input.idx, key;
            this._applyWithArgs("exactly", "(");
            key = this._apply("KeyBind");
            this._applyWithArgs("exactly", ")");
            return key;
        },
        KeyBind: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._or(function() {
                return this._apply("NumberBind");
            }, function() {
                return this._apply("QuotedTextBind");
            });
        },
        ExternalKeyBind: function() {
            var $elf = this, _fromIdx = this.input.idx, b;
            b = this._apply("KeyBind");
            return this.getBind(b);
        },
        Links: function() {
            var $elf = this, _fromIdx = this.input.idx, link;
            this._applyWithArgs("exactly", "/");
            this._applyWithArgs("exactly", "$");
            this._applyWithArgs("exactly", "l");
            this._applyWithArgs("exactly", "i");
            this._applyWithArgs("exactly", "n");
            this._applyWithArgs("exactly", "k");
            this._applyWithArgs("exactly", "s");
            link = this._apply("SubPathSegment");
            return link;
        },
        PathSegment: function() {
            var $elf = this, _fromIdx = this.input.idx, count, key, link, next, options, ref, resource;
            this._or(function() {
                switch (this.anything()) {
                  case "/":
                    resource = this._apply("ResourceName");
                    return this._opt(function() {
                        return this._or(function() {
                            key = this._apply("Key");
                            return this._opt(function() {
                                return this._or(function() {
                                    return link = this._apply("Links");
                                }, function() {
                                    return next = this._apply("SubPathSegment");
                                });
                            });
                        }, function() {
                            return count = this._opt(function() {
                                this._applyWithArgs("exactly", "/");
                                this._applyWithArgs("exactly", "$");
                                this._applyWithArgs("exactly", "c");
                                this._applyWithArgs("exactly", "o");
                                this._applyWithArgs("exactly", "u");
                                this._applyWithArgs("exactly", "n");
                                this._applyWithArgs("exactly", "t");
                                return !0;
                            });
                        });
                    });

                  default:
                    throw this._fail();
                }
            }, function() {
                ref = this._apply("ContentReference");
                resource = ref.resource;
                key = ref.key;
                return this._opt(function() {
                    return this._or(function() {
                        return link = this._apply("Links");
                    }, function() {
                        return next = this._apply("SubPathSegment");
                    });
                });
            });
            options = this._opt(function() {
                return this._apply("QueryOptions");
            });
            return {
                resource: resource,
                key: key,
                link: link,
                property: next,
                count: count,
                options: options
            };
        },
        SubPathSegment: function() {
            var $elf = this, _fromIdx = this.input.idx, count, key, link, next, options, resource;
            this._applyWithArgs("exactly", "/");
            resource = this._apply("ResourceName");
            key = this._opt(function() {
                return this._apply("Key");
            });
            this._opt(function() {
                return this._or(function() {
                    switch (this.anything()) {
                      case "/":
                        this._applyWithArgs("exactly", "$");
                        this._applyWithArgs("exactly", "l");
                        this._applyWithArgs("exactly", "i");
                        this._applyWithArgs("exactly", "n");
                        this._applyWithArgs("exactly", "k");
                        this._applyWithArgs("exactly", "s");
                        return link = this._apply("SubPathSegment");

                      default:
                        throw this._fail();
                    }
                }, function() {
                    return next = this._apply("SubPathSegment");
                });
            });
            count = this._opt(function() {
                this._applyWithArgs("exactly", "/");
                this._applyWithArgs("exactly", "$");
                this._applyWithArgs("exactly", "c");
                this._applyWithArgs("exactly", "o");
                this._applyWithArgs("exactly", "u");
                this._applyWithArgs("exactly", "n");
                this._applyWithArgs("exactly", "t");
                return !0;
            });
            options = this._opt(function() {
                return this._apply("QueryOptions");
            });
            return {
                resource: resource,
                key: key,
                link: link,
                property: next,
                count: count,
                options: options
            };
        },
        ContentType: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._consumedBy(function() {
                this._many1(function() {
                    return this._apply("letter");
                });
                this._applyWithArgs("exactly", "/");
                this._many1(function() {
                    return this._apply("letter");
                });
                return this._opt(function() {
                    this._applyWithArgs("exactly", "+");
                    return this._many1(function() {
                        return this._apply("letter");
                    });
                });
            });
        },
        ResourceName: function() {
            var $elf = this, _fromIdx = this.input.idx, resourceName;
            resourceName = this._consumedBy(function() {
                return this._many1(function() {
                    this._not(function() {
                        return this._or(function() {
                            return this._apply("ReservedUriComponent");
                        }, function() {
                            return this._apply("space");
                        });
                    });
                    return this.anything();
                });
            });
            return decodeURIComponent(resourceName);
        },
        Number: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._or(function() {
                return this._apply("Decimal");
            }, function() {
                return this._apply("Integer");
            });
        },
        Decimal: function() {
            var $elf = this, _fromIdx = this.input.idx, d, sign;
            sign = this._apply("Sign");
            d = this._consumedBy(function() {
                this._many1(function() {
                    return this._apply("digit");
                });
                this._applyWithArgs("exactly", ".");
                return this._many1(function() {
                    return this._apply("digit");
                });
            });
            return Number(sign + d);
        },
        Integer: function() {
            var $elf = this, _fromIdx = this.input.idx, d, sign;
            sign = this._apply("Sign");
            d = this._consumedBy(function() {
                return this._many1(function() {
                    return this._apply("digit");
                });
            });
            return parseInt(sign + d, 10);
        },
        UnsignedInteger: function() {
            var $elf = this, _fromIdx = this.input.idx, d;
            d = this._consumedBy(function() {
                return this._many1(function() {
                    return this._apply("digit");
                });
            });
            return parseInt(d, 10);
        },
        Null: function() {
            var $elf = this, _fromIdx = this.input.idx;
            this._applyWithArgs("exactly", "n");
            this._applyWithArgs("exactly", "u");
            this._applyWithArgs("exactly", "l");
            this._applyWithArgs("exactly", "l");
            return null;
        },
        Boolean: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._or(function() {
                return this._apply("True");
            }, function() {
                return this._apply("False");
            });
        },
        True: function() {
            var $elf = this, _fromIdx = this.input.idx;
            this._applyWithArgs("exactly", "t");
            this._applyWithArgs("exactly", "r");
            this._applyWithArgs("exactly", "u");
            this._applyWithArgs("exactly", "e");
            return !0;
        },
        False: function() {
            var $elf = this, _fromIdx = this.input.idx;
            this._applyWithArgs("exactly", "f");
            this._applyWithArgs("exactly", "a");
            this._applyWithArgs("exactly", "l");
            this._applyWithArgs("exactly", "s");
            this._applyWithArgs("exactly", "e");
            return !1;
        },
        Duration: function() {
            var $elf = this, _fromIdx = this.input.idx, day, hour, minute, second, sign, timeExists;
            this._applyWithArgs("exactly", "d");
            this._applyWithArgs("exactly", "u");
            this._applyWithArgs("exactly", "r");
            this._applyWithArgs("exactly", "a");
            this._applyWithArgs("exactly", "t");
            this._applyWithArgs("exactly", "i");
            this._applyWithArgs("exactly", "o");
            this._applyWithArgs("exactly", "n");
            this._apply("Apostrophe");
            sign = this._apply("Sign");
            this._applyWithArgs("exactly", "P");
            day = this._opt(function() {
                return this._applyWithArgs("DurationInteger", "D");
            });
            timeExists = this._opt(function() {
                this._applyWithArgs("exactly", "T");
                hour = this._opt(function() {
                    return this._applyWithArgs("DurationInteger", "H");
                });
                minute = this._opt(function() {
                    return this._applyWithArgs("DurationInteger", "M");
                });
                second = this._opt(function() {
                    return this._applyWithArgs("DurationNumber", "S");
                });
                return this._pred(hour || minute || second);
            });
            this._pred(day || timeExists);
            this._apply("Apostrophe");
            return {
                negative: "-" == sign,
                day: day,
                hour: hour,
                minute: minute,
                second: second
            };
        },
        DurationInteger: function(letter) {
            var $elf = this, _fromIdx = this.input.idx, n;
            n = this._apply("UnsignedInteger");
            this._applyWithArgs("exactly", letter);
            return n;
        },
        DurationNumber: function(letter) {
            var $elf = this, _fromIdx = this.input.idx, d;
            return this._or(function() {
                return this._applyWithArgs("DurationInteger", letter);
            }, function() {
                d = this._consumedBy(function() {
                    this._many1(function() {
                        return this._apply("digit");
                    });
                    this._applyWithArgs("exactly", ".");
                    return this._many1(function() {
                        return this._apply("digit");
                    });
                });
                this._applyWithArgs("exactly", letter);
                return Number(d);
            });
        },
        ReservedUriComponent: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return function() {
                switch (this.anything()) {
                  case "!":
                    return "!";

                  case "#":
                    return "#";

                  case "$":
                    return "$";

                  case "%":
                    this._applyWithArgs("exactly", "2");
                    this._applyWithArgs("exactly", "7");
                    return "'";

                  case "&":
                    return "&";

                  case "'":
                    return "'";

                  case "(":
                    return "(";

                  case ")":
                    return ")";

                  case "*":
                    return "*";

                  case "+":
                    return "+";

                  case ",":
                    return ",";

                  case "/":
                    return "/";

                  case ":":
                    return ":";

                  case ";":
                    return ";";

                  case "=":
                    return "=";

                  case "?":
                    return "?";

                  case "@":
                    return "@";

                  case "[":
                    return "[";

                  case "]":
                    return "]";

                  default:
                    throw this._fail();
                }
            }.call(this);
        },
        Text: function() {
            var $elf = this, _fromIdx = this.input.idx, text;
            text = this._consumedBy(function() {
                return this._many(function() {
                    this._not(function() {
                        return this._apply("ReservedUriComponent");
                    });
                    return this.anything();
                });
            });
            return decodeURIComponent(text);
        },
        Sign: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return this._or(function() {
                switch (this.anything()) {
                  case "%":
                    this._applyWithArgs("exactly", "2");
                    this._applyWithArgs("exactly", "B");
                    return "+";

                  case "+":
                    return "+";

                  case "-":
                    return "-";

                  default:
                    throw this._fail();
                }
            }, function() {
                return "";
            });
        },
        Apostrophe: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return function() {
                switch (this.anything()) {
                  case "%":
                    this._applyWithArgs("exactly", "2");
                    this._applyWithArgs("exactly", "7");
                    return "'";

                  case "'":
                    return "'";

                  default:
                    throw this._fail();
                }
            }.call(this);
        },
        Dollar: function() {
            var $elf = this, _fromIdx = this.input.idx;
            return function() {
                switch (this.anything()) {
                  case "$":
                    return "$";

                  case "%":
                    this._applyWithArgs("exactly", "2");
                    this._applyWithArgs("exactly", "4");
                    return "%24";

                  default:
                    throw this._fail();
                }
            }.call(this);
        },
        QuotedText: function() {
            var $elf = this, _fromIdx = this.input.idx, text;
            this._apply("Apostrophe");
            text = this._many(function() {
                return this._or(function() {
                    this._apply("Apostrophe");
                    return this._apply("Apostrophe");
                }, function() {
                    this._not(function() {
                        return this._apply("Apostrophe");
                    });
                    return this.anything();
                });
            });
            this._apply("Apostrophe");
            return decodeURIComponent(text.join(""));
        },
        Bind: function(type, value) {
            var $elf = this, _fromIdx = this.input.idx;
            this.binds.push([ type, value ]);
            return {
                bind: this.binds.length - 1
            };
        },
        NumberBind: function() {
            var $elf = this, _fromIdx = this.input.idx, n;
            n = this._apply("Number");
            return this._applyWithArgs("Bind", "Real", n);
        },
        DateBind: function() {
            var $elf = this, _fromIdx = this.input.idx, date, type;
            type = function() {
                switch (this.anything()) {
                  case "d":
                    switch (this.anything()) {
                      case "a":
                        switch (this.anything()) {
                          case "t":
                            switch (this.anything()) {
                              case "e":
                                return this._or(function() {
                                    switch (this.anything()) {
                                      case "t":
                                        this._applyWithArgs("exactly", "i");
                                        this._applyWithArgs("exactly", "m");
                                        this._applyWithArgs("exactly", "e");
                                        return "Date Time";

                                      default:
                                        throw this._fail();
                                    }
                                }, function() {
                                    "date";
                                    return "Date";
                                });

                              default:
                                throw this._fail();
                            }

                          default:
                            throw this._fail();
                        }

                      default:
                        throw this._fail();
                    }

                  default:
                    throw this._fail();
                }
            }.call(this);
            date = this._apply("QuotedText");
            date = Date.parse(date);
            this._pred(!isNaN(date));
            return this._applyWithArgs("Bind", type, date);
        },
        BooleanBind: function() {
            var $elf = this, _fromIdx = this.input.idx, b;
            b = this._apply("Boolean");
            return this._applyWithArgs("Bind", "Boolean", b);
        },
        ContentReference: function() {
            var $elf = this, _fromIdx = this.input.idx, bind, resource;
            this._applyWithArgs("exactly", "$");
            resource = this._apply("ResourceName");
            bind = this._applyWithArgs("Bind", "ContentReference", resource);
            return {
                resource: bind,
                key: bind
            };
        },
        QuotedTextBind: function() {
            var $elf = this, _fromIdx = this.input.idx, t;
            t = this._apply("QuotedText");
            return this._applyWithArgs("Bind", "Text", t);
        }
    });
    ODataParser.initialize = ODataParser.reset = function() {
        this.binds = [];
    };
    ODataParser.ParseOptionsObject = function(options) {
        var optionsObj = {};
        for (var i in options) optionsObj[options[i].name] = options[i].value;
        return optionsObj;
    };
    ODataParser.space = function() {
        var r = this._apply("char");
        if (r.charCodeAt(0) <= 32) return r;
        if ("%" === r) {
            this._applyWithArgs("exactly", "2");
            this._applyWithArgs("exactly", "0");
            return " ";
        }
        throw this._fail();
    };
    ODataParser.numberOf = function(rule, count, separator) {
        if (count.length) {
            count.sort();
            for (var origInput = this.input, i = count.length - 1; i >= 0; i--) try {
                this.input = origInput;
                return this.numberOf(rule, count[i], separator);
            } catch (e) {
                if (!(e instanceof SyntaxError)) throw e;
            }
            throw this._fail();
        }
        if (0 === count) return [];
        for (var ret = [], i = 1; i < count; i++) {
            ret.push(this._apply(rule));
            this._apply("spaces");
            this._applyWithArgs("exactly", separator);
            this._apply("spaces");
        }
        ret.push(this._apply(rule));
        return ret;
    };
    ODataParser.getBind = function(key) {
        return this.binds[key.bind];
    };
    ODataParser._enableTokens = function() {
        OMeta._enableTokens.call(this, [ "Text", "ResourceName", "Number", "RecognisedOption", "FilterAndOperand", "FilterByOperand", "FilterRecognisedMathOperand" ]);
    };
});